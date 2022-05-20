import '../styles/globals.css';
import Head from 'next/head';
import AppContainer from '../src/components/AppContainer';

function MyApp({ Component, pageProps }) {
  return (
    <AppContainer>
      <Head>
        <title>Hash Space</title>
        <meta name="description" content="Hash Space" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"></meta>
      </Head>
      <Component {...pageProps} />
    </AppContainer>
  );
}

export default MyApp;
