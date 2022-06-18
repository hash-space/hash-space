import { useEthersAppContext } from 'eth-hooks/context';
import { useEffect, useState } from 'react';
import { gql, useMutation, useQuery } from 'urql';
import Cookies, { CookieAttributes } from 'js-cookie';

const CHALLENGE_QUERY = gql`
  query Challenge($request: ChallengeRequest!) {
    challenge(request: $request) {
      text
    }
  }
`;

const COOKIE_CONFIG: CookieAttributes = {
  sameSite: 'None',
  secure: true,
  expires: 360,
};

export const AUTHENTICATE_MUTATION = gql`
  mutation Authenticate($request: SignedAuthChallenge!) {
    authenticate(request: $request) {
      accessToken
      refreshToken
    }
  }
`;

export function useAuthLens() {
  const ethersAppContext = useEthersAppContext();
  const [isAuthenticated, setAuth] = useState(false);

  const [challangeResult, getChallange] = useQuery({
    query: CHALLENGE_QUERY,
    pause: true,
    requestPolicy: 'network-only',
    variables: { request: { address: ethersAppContext.account } },
  });
  const [_, startAuth] = useMutation(AUTHENTICATE_MUTATION);

  useEffect(() => {
    if (challangeResult.data) {
      ethersAppContext.signer
        .signMessage(challangeResult.data.challenge.text)
        .then((signature) => {
          return startAuth({
            request: { address: ethersAppContext.account, signature },
          });
        })
        .then((res) => {
          Cookies.set(
            'accessToken',
            res.data.authenticate.accessToken,
            COOKIE_CONFIG
          );
          setTimeout(() => {
            setAuth(true);
          });
        });
    }
  }, [challangeResult.data]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!Cookies.get('accessToken')) {
        setAuth(false);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return {
    auth: getChallange,
    isAuthenticated,
  };
}
