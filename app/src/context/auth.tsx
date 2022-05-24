import React, {
  useCallback,
  useEffect,
  useState,
  useContext,
  useReducer,
  useRef,
} from 'react';
import { useEthersAppContext, EthersModalConnector } from 'eth-hooks/context';
import { ICoreOptions } from 'web3modal';
import { useSnackbar } from 'notistack';
import { useLoadAppContracts } from '../config/contract';
import { asEthersAdaptor } from 'eth-hooks/functions';
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
  addTx: (input: any) => any;
  isLoading: boolean;
}

export function useAuthContext() {
  return useContext(_AuthContext);
}

export const AuthContext: React.FC<IProps> = (props) => {
  const [web3Config, setConfig] = useState<Partial<ICoreOptions>>();
  const [networks, setNetworks] = useState<string[]>([]);
  const txAdded = useRef(0);
  const txDone = useRef(0);
  const [isLoading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const addTx = useCallback((promise: any) => {
    txAdded.current += 1;
    return promise
      .then((result) => {
        if (result.wait) {
          return result
            .wait(1)
            .then(() => {
              txDone.current += 1;
            })
            .catch(() => {
              txDone.current += 1;
              enqueueSnackbar('Tx errored', { variant: 'error' });
            });
        } else {
          txDone.current += 1;
        }
      })
      .catch(() => {
        txDone.current += 1;
        enqueueSnackbar('Tx errored', { variant: 'error' });
      });
  }, []);

  useEffect(() => {
    function timer() {
      if (txAdded.current !== txDone.current) {
        setLoading(true);
      } else {
        setLoading(false);
      }
    }
    const timerId = setInterval(timer, 100);
    return () => {
      clearInterval(timerId);
    };
  }, []);

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

  // throw error if connected to the wrong chain
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

  // auto connect to provider if cached to avoid relogin
  useEffect(() => {
    if (
      !ethersAppContext.active &&
      createLoginConnector &&
      localStorage.getItem('WEB3_CONNECT_CACHED_PROVIDER')
    ) {
      let connector = createLoginConnector(undefined);
      if (connector) {
        ethersAppContext.activate(connector);
      }
    }
  }, [web3Config]);

  // load contract
  useLoadAppContracts();
  useConnectAppContracts(asEthersAdaptor(ethersAppContext));

  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  useEffect(() => {
    setTimeout(() => {
      forceUpdate();
    }, 500);
  }, [ethersAppContext.provider, ethersAppContext.chainId]);

  return (
    <_AuthContext.Provider value={{ login, logout, isLoading, addTx }}>
      {props.children}
    </_AuthContext.Provider>
  );
};
