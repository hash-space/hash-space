import React, { useCallback, useEffect, useState, useContext } from 'react';
import { useEthersAppContext } from 'eth-hooks/context';
import { useAppContracts } from '../config/contract';
import * as ethers from 'ethers';
import history from '../helper/history';

const _Context = React.createContext<IContextProps>(
  undefined as unknown as IContextProps
);

interface IProps {
  children: React.ReactNode;
}

interface IPlayerState {
  lastQueried: number;
  playerId: number;
  stepsAvailable: number;
  isSignedUp: boolean;
}

interface IContextProps {
  playerContract: ReturnType<typeof usePlayerContract>;
}

export function useStateContext() {
  return useContext(_Context);
}

export const StateContext: React.FC<IProps> = (props) => {
  const playerContract = usePlayerContract();

  // for url query params for step sync
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => {
    history.listen(() => {
      forceUpdate();
    });
  }, []);

  return (
    <_Context.Provider value={{ playerContract }}>
      {props.children}
    </_Context.Provider>
  );
};

function usePlayerContract() {
  const ethersAppContext = useEthersAppContext();
  const [playerState, setPlayerState] = useState<IPlayerState>({
    playerId: 0,
    isSignedUp: false,
    lastQueried: 0,
    stepsAvailable: 0,
  });

  const playersContract = useAppContracts('Players', ethersAppContext.chainId);
  console.log(playersContract, ethersAppContext.chainId);

  useEffect(() => {
    if (playersContract && ethersAppContext.account) {
      playersContract.players(ethersAppContext.account).then((res) => {
        console.log(res.stepsAvailable);
        setPlayerState({
          lastQueried: parseInt(ethers.utils.formatUnits(res.lastQueried, 0)),
          playerId: parseInt(ethers.utils.formatUnits(res.playerId, 0)),
          stepsAvailable: parseInt(
            ethers.utils.formatUnits(res.stepsAvailable, 0)
          ),
          isSignedUp: parseInt(ethers.utils.formatUnits(res.playerId, 0)) > 0,
        });
      });
    }
  }, [playersContract, ethersAppContext.account]);

  const playerRegister = useCallback(() => {
    playersContract.registerProfile();
  }, [playersContract, ethersAppContext.account]);

  const playerSyncSteps = useCallback(
    (steps: number) => {
      playersContract.syncSteps(steps);
    },
    [playersContract, ethersAppContext.account]
  );

  return {
    playerState,
    playerRegister,
    playerSyncSteps,
    connected: !!playersContract,
  };
}
