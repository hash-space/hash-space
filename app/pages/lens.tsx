import { gql, useMutation, useQuery } from 'urql';
import { v4 as uuidv4 } from 'uuid';
import { PageWrapper } from '../src/components/PageWrapper';
import { useEthersAppContext } from 'eth-hooks/context';
import { useAuthLens } from '../src/hooks/useAuthLens';
import { create } from 'ipfs-http-client';
import omitDeep from 'omit-deep';
import lensAbi from './lensAbi.json';
import { Button, FormControl, TextField, Box, MenuItem } from '@mui/material';
import { useState } from 'react';
import { ethers } from 'ethers';

const omit = (object: any, name: string) => {
  return omitDeep(object, name);
};

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
});

export const CREATE_POST_TYPED_DATA_MUTATION = gql`
  mutation CreatePostTypedData(
    $options: TypedDataOptions
    $request: CreatePublicPostRequest!
  ) {
    createPostTypedData(options: $options, request: $request) {
      id
      expiresAt
      typedData {
        types {
          PostWithSig {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          profileId
          contentURI
          collectModule
          collectModuleInitData
          referenceModule
          referenceModuleInitData
        }
      }
    }
  }
`;

export const CURRENT_USER_QUERY = gql`
  query CurrentUser($ownedBy: [EthereumAddress!]) {
    profiles(request: { ownedBy: $ownedBy }) {
      items {
        id
        name
        handle
        isDefault
      }
    }
    userSigNonces {
      lensHubOnChainSigNonce
    }
  }
`;

const trimify = (value: string): string =>
  value?.replace(/\n\s*\n/g, '\n\n').trim();

async function uploadToIPFS(postContent: string) {
  const data = JSON.stringify({
    version: '1.0.0',
    metadata_id: uuidv4(),
    description: trimify(postContent),
    content: trimify(postContent),
    external_url: null,
    name: `Post by`,
    attributes: [
      {
        traitType: 'string',
        key: 'type',
        value: 'post',
      },
    ],
    media: [],
    appId: 'hash-space',
  });

  const cid = await client.add(data);
  return `https://ipfs.infura.io/ipfs/${cid.path}`;
}

const LENS_ADDRESS = '0x60Ae865ee4C725cd04353b5AAb364553f56ceF82';

export default function Lens() {
  const [createPostResult, createPost] = useMutation(
    CREATE_POST_TYPED_DATA_MUTATION
  );
  const [postText, setPostText] = useState('');
  const [selectedProfile, setProfile] = useState('');
  const ethersAppContext = useEthersAppContext();
  const auth = useAuthLens();
  const [profiles] = useQuery({
    query: CURRENT_USER_QUERY,
    variables: { ownedBy: ethersAppContext.account },
    pause: !auth.isAuthenticated,
  });
  const profilesArray = profiles?.data?.profiles?.items || [];
  const selectedProfileObject = profilesArray.find(
    (profile) => profile.id === selectedProfile
  );
  const nounce = profiles?.data?.userSigNonces?.lensHubOnChainSigNonce;

  const upload = () => {
    uploadToIPFS(postText).then((contentURI) =>
      createPost({
        options: { overrideSigNonce: nounce },
        request: {
          profileId: selectedProfileObject?.id,
          contentURI,
          collectModule: {
            freeCollectModule: {
              followerOnly: false,
            },
          },
          referenceModule: {
            followerOnlyReferenceModule: false,
          },
        },
      })
        .then((res) => {
          const payload = [
            omit(res.data.createPostTypedData.typedData?.domain, '__typename'),
            omit(res.data.createPostTypedData.typedData?.types, '__typename'),
            omit(res.data.createPostTypedData.typedData?.value, '__typename'),
          ];
          return (ethersAppContext.signer as any)
            ._signTypedData(...payload)
            .then((signature) => {
              const contract = new ethers.Contract(
                LENS_ADDRESS,
                lensAbi,
                ethersAppContext.signer
              );
              const { v, r, s } = ethers.utils.splitSignature(signature);
              const sig = {
                v,
                r,
                s,
                deadline: res.data.createPostTypedData.typedData.value.deadline,
              };
              const {
                profileId,
                contentURI,
                collectModule,
                collectModuleInitData,
                referenceModule,
                referenceModuleInitData,
              } = res.data.createPostTypedData.typedData?.value;
              const inputStruct = {
                profileId,
                contentURI,
                collectModule,
                collectModuleInitData,
                referenceModule,
                referenceModuleInitData,
                sig,
              };
              return contract.postWithSig(inputStruct);
            });
        })
        .then((tx) => {
          return tx.wait();
        })
    );
  };
  return (
    <PageWrapper>
      {!auth.isAuthenticated && (
        <button onClick={() => auth.auth()}>auth</button>
      )}
      <FormControl fullWidth>
        <TextField
          id="outlined-select-currency"
          select
          disabled={!auth.isAuthenticated}
          label="Profile"
          onChange={(e) => {
            setProfile(e.target.value);
          }}
          value={selectedProfile}>
          {profilesArray.map((profile) => (
            <MenuItem key={profile.id} value={profile.id}>
              {profile.handle}
            </MenuItem>
          ))}
        </TextField>
        <Box height="10" />
        <TextField
          disabled={!selectedProfile}
          id="outlined-multiline-static"
          label="Content"
          multiline
          rows={4}
          defaultValue=""
          onBlur={(e) => setPostText(e.target.value)}
        />
        <Button variant="outlined" onClick={() => upload()}>
          Upload
        </Button>
      </FormControl>
    </PageWrapper>
  );
}
