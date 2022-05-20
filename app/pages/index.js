import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { useEthersAppContext } from 'eth-hooks/context';
import { useAuthContext } from '../src/context/auth';
import { useStateContext } from '../src/context/state';
import { PageWrapper } from '../src/components/PageWrapper';
import { Typography } from '@mui/material';
import SyncStepDialog from '../src/components/SyncStepDialog';
import MoveShipDialog from '../src/components/MoveShipDialog';
import Link from 'next/link';
export default function Home() {
  return (
    <PageWrapper>
      <MainView />
    </PageWrapper>
  );
}

function MainView() {
  const ethersAppContext = useEthersAppContext();
  const authContext = useAuthContext();

  const { playerContract, shipsContract, worldContract } = useStateContext();
  return (
    <main className={styles.main}>
      <SyncStepDialog />
      <MoveShipDialog />
      <Typography variant="h6" component="div">
        <h1>user</h1>
        <div>{JSON.stringify(playerContract.playerState)}</div>
        <hr></hr>
        <h1>ships</h1>
        <ul>
          {shipsContract.ships.map((ship) => (
            <li key={ship.id}>
              <div>
                id: {ship.id}, owner: {ship.owner}, x: {ship.x}, y: {ship.y},
                isMine: {ship.isMine ? 'yes' : 'no'}
              </div>
              <Link
                href={{
                  pathname: '/',
                  query: { modal: 'move' },
                }}>
                <button>move ship {ship.id}</button>
              </Link>
              <Link
                href={{
                  pathname: '/?steps=5000',
                  query: { modal: 'move' },
                }}>
                <button>get 5000 steps</button>
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
                id: {planet.id}, mapId: {planet.worldMapIndex}, x: {planet.x},
                y: {planet.y}, type; {planet.planetType}
              </div>
            </li>
          ))}
        </ul>
        <hr></hr>
        {!playerContract.playerState.isSignedUp && (
          <button onClick={playerContract.playerRegister}>register</button>
        )}
        <button
          onClick={() => {
            location.href =
              '/api/auth?lastSync=' + playerContract.playerState.lastQueried;
          }}>
          sync steps
        </button>
        <Link
          href={{
            pathname: '/game',
          }}>
          <button>to to game</button>
        </Link>
        <p>account: {ethersAppContext.account}</p>
        <p>chain: {ethersAppContext.chainId}</p>
        <p>active: {ethersAppContext.active ? 'yes' : 'no'}</p>
      </Typography>
    </main>
  );
}
