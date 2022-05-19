import React, {
  useCallback,
  useEffect,
  useState,
  useContext,
  useReducer,
} from 'react';
import { useEthersAppContext, EthersModalConnector } from 'eth-hooks/context';
import { ICoreOptions } from 'web3modal';
import { useSnackbar } from 'notistack';
import { useLoadAppContracts } from '../config/contract';
import { asEthersAdaptor } from 'eth-hooks/functions';
import { useEthersAdaptorFromProviderOrSigners } from 'eth-hooks';
import { useConnectAppContracts } from '../config/contract';

const _AuthContext = React.createContext<IAuthProps>(
  undefined as unknown as IAuthProps
);

interface IProps {
  children: React.ReactNode;
}

interface IAuthProps {
  login: () => void;
  logout: () => void;
}

export function useAuthContext() {
  return useContext(_AuthContext);
}

export const AuthContext: React.FC<IProps> = (props) => {
  const [web3Config, setConfig] = useState<Partial<ICoreOptions>>();
  const [networks, setNetworks] = useState<string[]>([]);

  const ethersAppContext = useEthersAppContext();

  const createLoginConnector = useCallback(
    (id?: string) => {
      if (web3Config) {
        const connector = new EthersModalConnector(
          { ...web3Config },
          { reloadOnNetworkChange: false, immutableProvider: false },
          id
        );
        return connector;
      }
    },
    [web3Config]
  );

  useEffect(() => {
    const importedConfig = import('../config/web3');

    importedConfig.then((getter) => {
      getter.getWeb3ModalConfig().then((config) => {
        setConfig(config);
      });
      setNetworks(
        Object.keys(getter.NETWORKS).map((key) =>
          getter.NETWORKS[key].chainId.toString()
        )
      );
    });
  }, []);

  const login = useCallback(() => {
    if (createLoginConnector != null && ethersAppContext?.openModal != null) {
      const connector = createLoginConnector();
      if (connector) {
        ethersAppContext.openModal(connector);
      }
    }
  }, [createLoginConnector, ethersAppContext]);

  const logout = useCallback(() => {
    if (ethersAppContext?.disconnectModal != null && ethersAppContext.active) {
      ethersAppContext.disconnectModal();
    }
  }, [ethersAppContext]);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (
      networks.length > 0 &&
      ethersAppContext.chainId &&
      networks.indexOf(ethersAppContext.chainId.toString()) === -1
    ) {
      enqueueSnackbar(
        'Please use one of following chains: ' + networks.join(','),
        { variant: 'error' }
      );
    }
  }, [ethersAppContext.chainId, networks]);

  useLoadAppContracts();
  useConnectAppContracts(asEthersAdaptor(ethersAppContext));

  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  useEffect(() => {
    console.log('force update');
    setTimeout(() => {
      forceUpdate();
    }, 1000);
  }, [ethersAppContext.provider, ethersAppContext.chainId]);

  return (
    <_AuthContext.Provider value={{ login, logout }}>
      {props.children}
    </_AuthContext.Provider>
  );
};
