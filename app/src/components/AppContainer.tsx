import { EthersAppContext } from 'eth-hooks/context';
import { AuthContext } from '../context/auth';
import { StateContext } from '../context/state';
import { SnackbarProvider } from 'notistack';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { ContractsAppContext } from '../config/contract';

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

interface IProps {
  children: React.ReactNode;
}

export default function AppContainer(props: IProps) {
  return (
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
  );
}
