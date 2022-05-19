import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState, useReducer } from 'react';
import styles from '../styles/Home.module.css';
import { useEthersAppContext } from 'eth-hooks/context';
import { useAuthContext } from '../src/context/auth';
import { useStateContext } from '../src/context/state';
import { factories } from '../src/generated/contract-types/index';
import { getAddress } from '../src/helper/getAddress';
import { PageWrapper } from '../src/components/PageWrapper';
import { useAppContracts } from '../src/config/contract';
import { asEthersAdaptor } from 'eth-hooks/functions';
import {
  useConnectAppContracts,
  useLoadAppContracts,
} from '../src/config/contract';
import { Typography } from '@mui/material';
import SyncStepDialog from '../src/components/SyncStepDialog';
export default function Home() {
  const ethersAppContext = useEthersAppContext();
  return (
    <PageWrapper>
      <MainView />
    </PageWrapper>
  );
}

function MainView() {
  const [result, setResult] = useState({
    hasResult: false,
    steps: 0,
    error: '',
  });

  useEffect(() => {
    const urlParams = new URL(window.location.href).searchParams;
    const steps = urlParams.get('steps');
    const error = urlParams.get('error');
    const hasResult = error || steps;
    setResult({ hasResult, error, steps });
  }, []);

  const ethersAppContext = useEthersAppContext();
  const authContext = useAuthContext();

  const { playerContract, shipsContract } = useStateContext();
  return (
    <main className={styles.main}>
      <SyncStepDialog />
      <Typography variant="h6" component="div">
        <h1>user</h1>
        <div>{JSON.stringify(playerContract.playerState)}</div>
        <hr></hr>
        <h1>ships</h1>
        <div>{JSON.stringify(shipsContract.ships)}</div>
        <hr></hr>
        <button onClick={authContext.login}>login</button>
        <button onClick={authContext.logout}>logout</button>
        <button onClick={playerContract.playerRegister}>register</button>
        <button
          onClick={() => {
            location.href =
              '/api/auth?lastSync=' + playerContract.playerState.lastQueried;
          }}>
          sync steps
        </button>
        <p>account: {ethersAppContext.account}</p>
        <p>chain: {ethersAppContext.chainId}</p>
        <p>active: {ethersAppContext.active ? 'yes' : 'no'}</p>
      </Typography>
    </main>
  );
}

function mapError(errorMsg) {
  switch (errorMsg) {
    case 'error2':
      return 'maybe you need to sync your steps first';
    case 'error1':
      return 'could not get data';
    default:
      return 'undefined error';
  }
}
