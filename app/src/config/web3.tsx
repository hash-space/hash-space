import { ICoreOptions } from 'web3modal';
import { TNetworkInfo } from 'eth-hooks/models';

export const web3ModalConfigKeys = {
  coinbaseKey: 'custom-walletlink',
  localhostKey: 'custom-localhost',
} as const;

let hostname = 'localhost';
if (typeof window !== 'undefined') {
  hostname = window?.location?.hostname ?? 'localhost';
}

export type TNetworkNames =
  | 'localhost'
  | 'mumbai'
  | 'emerald_testnet'
  | 'arbitrum_nitro';

export const NETWORKS: Readonly<Record<TNetworkNames, TNetworkInfo>> = {
  localhost: {
    name: 'localhost',
    color: '#666666',
    chainId: 31337,
    blockExplorer: '',
    price: 1,
    gasPrice: 1100000000,
    url: 'http://' + hostname + ':8545',
  },
  mumbai: {
    name: 'mumbai',
    color: '#92D9FA',
    chainId: 80001,
    price: 1,
    gasPrice: 1100000000,
    url: 'https://rpc-mumbai.maticvigil.com',
    faucet: 'https://faucet.matic.network/',
    blockExplorer: 'https://mumbai-explorer.matic.today/',
  },
  arbitrum_nitro: {
    name: 'arbitrum_nitro',
    color: '#7003DD',
    chainId: 421612,
    url: `https://nitro-devnet.arbitrum.io/rpc`,
    blockExplorer: 'https://nitro-devnet-explorer.arbitrum.io',
  },
  emerald_testnet: {
    url: 'https://testnet.emerald.oasis.dev',
    chainId: 42261,
    name: 'emerald_testnet',
    color: '#92D9FA',
    price: 1,
    gasPrice: 1100000000,
    blockExplorer: 'https://testnet.explorer.emerald.oasis.dev/',
  },
};

export const getWeb3ModalConfig = async (): Promise<Partial<ICoreOptions>> => {
  const providerOptions: Record<string, any> = {};

  // === WALLETCONNECT
  try {
    const WalletConnectProvider = (
      await import('@walletconnect/ethereum-provider')
    ).default;
    const walletConnectEthereum = {
      package: WalletConnectProvider,
      options: {
        bridge: 'https://polygon.bridge.walletconnect.org',
        infuraId: process.env.INFURA_ID,
        rpc: {},
      },
    };
    providerOptions.walletconnect = walletConnectEthereum;
  } catch (e) {
    console.log('Failed to load config for web3 connector WalletConnect: ', e);
  }

  try {
    const CoinbaseWalletSDK = (await import('@coinbase/wallet-sdk')).default;
    const coinbasewallet = {
      package: CoinbaseWalletSDK,
      options: {
        appName: 'Web 3 Modal Demo',
        infuraId: process.env.INFURA_ID,
        rpc: {},
      },
    };
    providerOptions.coinbasewallet = coinbasewallet;
  } catch (e) {
    console.log('Failed to load config for web3 connector coinbase: ', e);
  }

  return {
    cacheProvider: true,
    theme: 'dark',
    providerOptions,
  };
};
