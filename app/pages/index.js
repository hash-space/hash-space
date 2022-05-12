import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
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

  return (
    <div className={styles.container}>
      <Head>
        <title>Steps app</title>
        <meta name="description" content="Steps app" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"></meta>
      </Head>
      {!result.hasResult && <MainView></MainView>}
      {result.hasResult && (
        <ResultView steps={result.steps} error={result.error}></ResultView>
      )}
    </div>
  );
}

function MainView() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>How many steps you did today?</h1>

      <p className={styles.description}>
        <Link href="/api/auth">
          <span className={styles.card}>
            Connect t o your device to find out
          </span>
        </Link>
      </p>
    </main>
  );
}

function ResultView(props) {
  return (
    <main className={styles.main}>
      {!props.error && (
        <h1 className={styles.title}>You did {props.steps} today.</h1>
      )}
      {props.error && (
        <h1 className={styles.title}>Error: {mapError(props.error)}</h1>
      )}
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
