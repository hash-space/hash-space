import '../styles/globals.css';
import { EthersAppContext } from 'eth-hooks/context';
import { AuthContext } from '../src/context/auth';

function MyApp({ Component, pageProps }) {
  return (
    <EthersAppContext>
      <AuthContext>
        <Component {...pageProps} />
      </AuthContext>
    </EthersAppContext>
  );
}

export default MyApp;
