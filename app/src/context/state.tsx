import React, { useCallback, useEffect, useState, useContext } from 'react';
import { useEthersAppContext } from 'eth-hooks/context';
import { useAppContracts } from '../config/contract';
import { useContractReader } from 'eth-hooks';
import * as ethers from 'ethers';

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

  const [playerObject] = useContractReader(
    playersContract,
    playersContract?.players,
    [ethersAppContext.account ?? '']
  );

  useEffect(() => {
    if (playerObject) {
      setPlayerState({
        lastQueried: parseInt(ethers.utils.formatUnits(playerObject[2], 0)),
        playerId: parseInt(ethers.utils.formatUnits(playerObject[0], 0)),
        stepsAvailable: parseInt(ethers.utils.formatUnits(playerObject[3], 0)),
        isSignedUp: parseInt(ethers.utils.formatUnits(playerObject[0], 0)) > 0,
      });
    }
  }, [playerObject]);

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
