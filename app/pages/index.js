import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useEthersAppContext } from 'eth-hooks/context';
import { useAuthContext } from '../src/context/auth';
import { useStateContext } from '../src/context/state';
import { PageWrapper } from '../src/components/PageWrapper';
import { Typography, Button, ButtonGroup, Alert } from '@mui/material';
import SyncStepDialog from '../src/components/SyncStepDialog';
import MoveShipDialog from '../src/components/MoveShipDialog';
import { useRouter } from 'next/router';
import { getAddress } from '../src/helper/getAddress';

import Link from 'next/link';
const EpnsButtonNoSSR = dynamic(() => import('../src/components/EpnsButton'), {
  ssr: false,
});
import { Container, Paper, Box } from '@mui/material';
import { getCallbackUrl } from '../src/helper/callbackUrl';

export default function Home() {
  const ethersAppContext = useEthersAppContext();
  const authContext = useAuthContext();
  const router = useRouter();
  const isDebug = !!router.query.debug; // enable for debugging

  const { playerContract, shipsContract, worldContract } = useStateContext();
  return (
    <PageWrapper>
      <Container maxWidth="sm">
        <Box sx={{ height: 10 }} />
        <Paper style={{ padding: '10px' }}>
          <SyncStepDialog />
          <MoveShipDialog />
          <Typography variant="h5" gutterBottom component="div">
            HASH SPACE: The DeFi Explorer
          </Typography>
          <Typography variant="body1" gutterBottom>
            <b>Are you ready to go on a quest?
            Learn about DeFi and earn yield while exploring different worlds.</b>
          </Typography>
          {isDebug && (
            <div>
              <hr></hr>
              <h1>ships</h1>
              <ul>
                {shipsContract.ships.map((ship) => (
                  <li key={ship.id}>
                    <div>{JSON.stringify(ship)}</div>
                    <Link
                      href={{
                        pathname: '/',
                        query: { modal: 'move' },
                      }}>
                      <button>move ship {ship.id}</button>
                    </Link>
                  </li>
                ))}
              </ul>
              <hr></hr>
              <h1>planets</h1>
              <ul>
                {worldContract.planets.map((planet) => (
                  <li key={planet.id}>
                    <div>
                      id: {planet.id}, mapId: {planet.worldMapIndex}, x:{' '}
                      {planet.x}, y: {planet.y}, type; {planet.planetType}
                    </div>
                  </li>
                ))}
              </ul>
              <hr></hr>
              <Link
                href={{
                  pathname: '/',
                  query: { steps: 5000 },
                }}>
                <button>get 5000 steps</button>
              </Link>
              <p>account: {ethersAppContext.account}</p>
              <p>chain: {ethersAppContext.chainId}</p>
              <p>active: {ethersAppContext.active ? 'yes' : 'no'}</p>
            </div>
          )}
        </Paper>
        <Box sx={{ height: 10 }} />
        <Paper style={{ padding: '10px' }}>
          <Typography variant="h5" gutterBottom component="div">
            Action
          </Typography>
          <div>
            {!playerContract.playerState.isSignedUp && (
              <Button
                color="secondary"
                variant="outlined"
                onClick={playerContract.playerRegister}>
                Register
              </Button>
            )}
            {playerContract.playerState.isSignedUp && (
              <ButtonGroup size="large" aria-label="large button group">
                <Button
                  color="secondary"
                  variant="outlined"
                  onClick={() => {
                    const url = new URL('/api/auth', getCallbackUrl());
                    url.searchParams.set(
                      'lastSync',
                      playerContract.playerState.lastQueried
                    );
                    url.searchParams.set('redirectUrl', location.href);
                    location.href = url.href;
                  }}>
                  Sync your steps
                </Button>
                <Link
                  href={{
                    pathname: '/game',
                  }}>
                  <Button color="secondary" variant="outlined">
                    Go to game
                  </Button>
                </Link>
              </ButtonGroup>
            )}
          </div>
        </Paper>
        <Box sx={{ height: 10 }} />
        <Paper style={{ padding: '10px' }}>
          <Typography variant="h5" gutterBottom component="div">
            NFT Collection / OpenSea
          </Typography>
          <Typography variant="body1" gutterBottom>
            You'll receive a starship NFT on registration. View the full collection on the following networks:
          </Typography>
          <div>
            <ButtonGroup size="large" aria-label="large button group">
              <Link
                href={`https://testnets.opensea.io/assets?search[query]=${getAddress(
                  80001,
                  'Starship'
                )}`}>
                <Button color="secondary" variant="outlined">
                  Mumbai
                </Button>
              </Link>
            </ButtonGroup>
          </div>
        </Paper>
        <Box sx={{ height: 10 }} />
        <Paper style={{ padding: '10px' }}>
          <Typography variant="h5" gutterBottom component="div">
            Subscribe To our EPNS Channel
          </Typography>
          <Typography variant="body1" gutterBottom>
            Keep up-to-date with the latest events across your chosen universes.
          </Typography>
          <Alert severity="warning">only available on testnet kovan</Alert>
          <Box sx={{ height: 10 }} />
          <div>
            <EpnsButtonNoSSR />
          </div>
        </Paper>
      </Container>
    </PageWrapper>
  );
}
