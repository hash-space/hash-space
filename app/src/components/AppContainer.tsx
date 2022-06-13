import { EthersAppContext } from 'eth-hooks/context';
import { AuthContext } from '../context/auth';
import { StateContext } from '../context/state';
import { SnackbarProvider } from 'notistack';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { ContractsAppContext } from '../config/contract';
import {
  cacheExchange,
  createClient,
  dedupExchange,
  Provider,
  fetchExchange,
  makeOperation,
  errorExchange,
} from 'urql';
import { authExchange } from '@urql/exchange-auth';
import Cookies from 'js-cookie';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#31f6e9',
    },
    secondary: {
      main: '#31f6e9',
    },
  },
});

const APIURL = 'https://api-mumbai.lens.dev/';

const getAuth = async ({ authState }) => {
  if (!authState) {
    const token = Cookies.get('accessToken');
    if (token) {
      return { token };
    }
    return null;
  }

  return null;
};

const addAuthToOperation = ({ authState, operation }) => {
  if (!authState || !authState.token) {
    return operation;
  }

  const fetchOptions =
    typeof operation.context.fetchOptions === 'function'
      ? operation.context.fetchOptions()
      : operation.context.fetchOptions || {};

  return makeOperation(operation.kind, operation, {
    ...operation.context,
    fetchOptions: {
      ...fetchOptions,
      headers: {
        ...fetchOptions.headers,
        Authorization: `Bearer ${authState.token}`,
      },
    },
  });
};

const client = createClient({
  url: APIURL,
  exchanges: [
    dedupExchange,
    cacheExchange,
    errorExchange({
      onError: (error) => {
        const isAuthError = error.graphQLErrors.some(
          (e) => e.message.indexOf('User not authenticated') != -1
        );

        if (isAuthError) {
          //Cookies.remove('accessToken');
        }
      },
    }),
    authExchange({
      getAuth,
      addAuthToOperation,
    }),
    fetchExchange,
  ],
});

interface IProps {
  children: React.ReactNode;
}

export default function AppContainer(props: IProps) {
  return (
    <Provider value={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ContractsAppContext>
          <EthersAppContext>
            <SnackbarProvider maxSnack={3}>
              <AuthContext>
                <StateContext>{props.children}</StateContext>
              </AuthContext>
            </SnackbarProvider>
          </EthersAppContext>
        </ContractsAppContext>
      </ThemeProvider>
    </Provider>
  );
}
