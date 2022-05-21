import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useEthersAppContext } from 'eth-hooks/context';
import { useAuthContext } from '../src/context/auth';
import { useStateContext } from '../src/context/state';
import { PageWrapper } from '../src/components/PageWrapper';
import { Typography } from '@mui/material';
import SyncStepDialog from '../src/components/SyncStepDialog';
import MoveShipDialog from '../src/components/MoveShipDialog';
import { useRouter } from 'next/router';

import Link from 'next/link';
const EpnsButtonNoSSR = dynamic(() => import('../src/components/EpnsButton'), {
  ssr: false,
});
import { Container, Paper, Box } from '@mui/material';

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
            About
          </Typography>
          <Typography variant="body1" gutterBottom>
            body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Quos blanditiis tenetur unde suscipit, quam beatae rerum inventore
            consectetur, neque doloribus, cupiditate numquam dignissimos laborum
            fugiat deleniti? Eum quasi quidem quibusdam.
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
              {!playerContract.playerState.isSignedUp && (
                <button onClick={playerContract.playerRegister}>
                  register
                </button>
              )}
              <button
                onClick={() => {
                  location.href =
                    '/api/auth?lastSync=' +
                    playerContract.playerState.lastQueried;
                }}>
                sync steps
              </button>
              <Link
                href={{
                  pathname: '/game',
                }}>
                <button>to to game</button>
              </Link>
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
          <Typography variant="h5" gutterBottom gutterTop component="div">
            Subscribe To our EPNS Channel (only on kovan)
          </Typography>
          <div>
            <EpnsButtonNoSSR />
          </div>
        </Paper>
      </Container>
    </PageWrapper>
  );
}
