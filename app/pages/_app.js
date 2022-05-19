import '../styles/globals.css';
import { EthersAppContext } from 'eth-hooks/context';
import { AuthContext } from '../src/context/auth';
import { StateContext } from '../src/context/state';
import { SnackbarProvider } from 'notistack';
import { createTheme, ThemeProvider } from '@mui/material';
import Head from 'next/head';
import { ContractsAppContext } from '../src/config/contract';

const theme = createTheme({
  palette: {
    primary: {
      main: '#424242',
    },
    secondary: {
      main: '#ffd54f',
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <ContractsAppContext>
        <EthersAppContext>
          <SnackbarProvider maxSnack={3}>
            <AuthContext>
              <StateContext>
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
              </StateContext>
            </AuthContext>
          </SnackbarProvider>
        </EthersAppContext>
      </ContractsAppContext>
    </ThemeProvider>
  );
}

export default MyApp;
