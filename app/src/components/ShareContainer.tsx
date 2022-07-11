import { gql, useMutation, useQuery } from 'urql';
import { v4 as uuidv4 } from 'uuid';
import { useEthersAppContext } from 'eth-hooks/context';
import { useAuthLens } from '../hooks/useAuthLens';
import { create } from 'ipfs-http-client';
import omitDeep from 'omit-deep';
import lensAbi from '../abi/lensAbi.json';
import {
  Button,
  FormControl,
  TextField,
  Box,
  MenuItem,
  Grid,
  Alert,
  Typography,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useEffect, useState } from 'react';
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

interface IShareProps {
  defaultText: string;
}

export default function ShareContainer(props: IShareProps) {
  const [createPostResult, createPost] = useMutation(
    CREATE_POST_TYPED_DATA_MUTATION
  );
  const [isLoading, setLoading] = useState(false);
  const [postText, setPostText] = useState('');
  const [selectedProfile, setProfile] = useState('');
  const ethersAppContext = useEthersAppContext();
  const auth = useAuthLens();
  const [profiles, getProfiles] = useQuery({
    query: CURRENT_USER_QUERY,
    requestPolicy: 'network-only',
    variables: { ownedBy: ethersAppContext.account },
    pause: false,
  });
  const profilesArray = profiles?.data?.profiles?.items || [];
  const selectedProfileObject = profilesArray.find(
    (profile) => profile.id === selectedProfile
  );
  const nounce = profiles?.data?.userSigNonces?.lensHubOnChainSigNonce;
  const noProfile = profiles.data && profilesArray.length == 0;
  const hashSpaceInviteLink ='https://v2.hashspace.quest/join/?invited_by=' + ethersAppContext.account;

  useEffect(() => {
    getProfiles();
  }, [auth.isAuthenticated, getProfiles]);

  const disablePostButton = !(
    selectedProfile &&
    auth.isAuthenticated &&
    postText.length > 1
  );

  const processChange = debounce((text) => setPostText(text));

  const upload = () => {
    setLoading(true);
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
        .finally(() => {
          setLoading(false);
        })
    );
  };
  return (
    <div>
      <FormControl
        fullWidth
        sx={{
          padding: 0,
          position: 'relative',
          display: auth.isAuthenticated ? undefined : 'none',
        }}>
        {!noProfile && (
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
        )}
        {noProfile && (
          <Alert severity="error">
            You dont seem to have a lens profile, please create one first on
            lenster.xyz or claim.lens.xyz
          </Alert>
        )}
        <Box sx={{ height: 10 }} />
        <TextField
          disabled={!selectedProfile || !auth.isAuthenticated}
          id="outlined-multiline-static"
          label="Content"
          multiline
          rows={4}
          defaultValue={props.defaultText}
          onChange={(e) => processChange(e.target.value)}
        />
        <Box sx={{ height: 10 }} />
        <LoadingButton
          disabled={disablePostButton}
          variant="outlined"
          loading={isLoading}
          onClick={() => upload()}>
          Post on Lens
        </LoadingButton>
      </FormControl>
      {!auth.isAuthenticated && (
        <>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                disabled={!ethersAppContext.active}
                fullWidth
                variant="outlined"
                onClick={() => auth.auth()}>
                {!ethersAppContext.active
                  ? 'Lens (connect wallet first)'
                  : 'Lens'}
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  window.open(
                    'https://twitter.com/intent/tweet?screen_name=HashSpaceQuest&text= %0D%0A' +
                      hashSpaceInviteLink
                  );
                }}>
                Twitter
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="outlined"
                data-action="share/whatsapp/share" 
                onClick={() => {
                  window.open(
                    'whatsapp://send?text=Join Hash Space %0D%0A' + "\n" +
                    hashSpaceInviteLink
                  );
                }}>
                WhatsApp
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  window.open(
                    'https://t.me/share/url?url=' + hashSpaceInviteLink +'&text=Join Hash Space'
                  );
                }}>
                Telegram
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  window.open(
                    'https://www.facebook.com/sharer/sharer.php?u='+ hashSpaceInviteLink +'&t=Join Hash Space'
                  );
                }}>
                Facebook
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  window.open(
                    'http://www.reddit.com/submit?url='+ hashSpaceInviteLink +'&title=Join Hash Space'
                  );
                }}>
                Reddit
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  window.open(
                    'https://www.linkedin.com/shareArticle?mini=true&url='+ hashSpaceInviteLink +'&t=Join Hash Space'
                  );
                }}>
                LinkedIn
              </Button>
            </Grid>
          </Grid>
        </>
      )}
    </div>
  );
}

function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}
