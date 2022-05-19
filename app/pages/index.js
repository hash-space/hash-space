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

  const { playerState, playerRegister } = useStateContext();
  return (
    <main className={styles.main}>
      <div>{JSON.stringify(playerState)}</div>
      <button onClick={authContext.login}>login</button>
      <button onClick={authContext.logout}>logout</button>
      <button onClick={playerRegister}>register</button>

      <p>account: {ethersAppContext.account}</p>
      <p>chain: {ethersAppContext.chainId}</p>
      <p>active: {ethersAppContext.active ? 'yes' : 'no'}</p>
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
