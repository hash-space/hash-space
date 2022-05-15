import React, { useCallback, useEffect, useState, useContext } from 'react';
import { useEthersAppContext, EthersModalConnector } from 'eth-hooks/context';
import { ICoreOptions } from 'web3modal';

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
    });
  }, []);

  const login = useCallback(() => {
    if (createLoginConnector != null && ethersAppContext?.openModal != null) {
      const connector = createLoginConnector();
      if (connector) {
        ethersAppContext.openModal(connector, () => {
          alert('error');
        });
      }
    }
  }, [createLoginConnector, ethersAppContext]);

  const logout = useCallback(() => {
    if (ethersAppContext?.disconnectModal != null) {
      ethersAppContext.disconnectModal();
    }
  }, [ethersAppContext]);

  return (
    <_AuthContext.Provider value={{ login, logout }}>
      {props.children}
    </_AuthContext.Provider>
  );
};
