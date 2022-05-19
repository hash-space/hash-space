import React, { useCallback, useEffect, useState, useContext } from 'react';
import { useEthersAppContext } from 'eth-hooks/context';
import { useAppContracts } from '../config/contract';
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
  playerState: IPlayerState;
  playerRegister: () => void;
}

export function useStateContext() {
  return useContext(_Context);
}

export const StateContext: React.FC<IProps> = (props) => {
  const { playerState, playerRegister } = usePlayerContract();

  return (
    <_Context.Provider value={{ playerState, playerRegister }}>
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

  return { playerState, playerRegister };
}
