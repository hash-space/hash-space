import React, { useCallback, useEffect, useState, useContext } from 'react';
import { useEthersAppContext } from 'eth-hooks/context';
import { useAppContracts } from '../config/contract';
import { useContractReader } from 'eth-hooks';
import * as ethers from 'ethers';
import { planetCategoryIdToNameMapping } from '../api/mapping/planets';
import { uploadIPFS } from '../helper/uploadIPFS';

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

interface IShip {
  x: number;
  y: number;
  owner: string;
  id: number;
  isMine: boolean;
  category: string;
}

interface IPlanet {
  id: number;
  worldMapIndex: number;
  x: number;
  y: number;
  planetType: number;
  category: string;
  size: number;
}

interface IContextProps {
  playerContract: ReturnType<typeof usePlayerContract>;
  shipsContract: ReturnType<typeof useNftContract>;
  worldContract: ReturnType<typeof useWorldContract>;
}

export function useStateContext() {
  return useContext(_Context);
}

export const StateContext: React.FC<IProps> = (props) => {
  const playerContract = usePlayerContract();
  const shipsContract = useNftContract();
  const worldContract = useWorldContract();

  return (
    <_Context.Provider value={{ playerContract, shipsContract, worldContract }}>
      {props.children}
    </_Context.Provider>
  );
};

export function usePlayerContract() {
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
        lastQueried: parseNumber(playerObject[2]),
        playerId: parseNumber(playerObject[0]),
        stepsAvailable: parseNumber(playerObject[3]),
        isSignedUp: parseNumber(playerObject[0]) > 0,
      });
    }
  }, [playerObject]);

  const playerRegister = useCallback(async () => {
    
    const metadata = await uploadIPFS();

    // tokenURI = 
    playersContract.registerProfile();
  }, [playersContract]);

  const playerSyncSteps = useCallback(
    (steps: number) => {
      playersContract.syncSteps(steps);
    },
    [playersContract]
  );

  const playerMoveShip = useCallback(
    (
      x: number,
      y: number,
      planetId: number,
      shipId: number,
      worldId: number
    ) => {
      playersContract.moveShip(x, y, planetId, shipId, worldId);
    },
    [playersContract]
  );

  return {
    playerState,
    playerRegister,
    playerSyncSteps,
    playerMoveShip,
    connected: !!playersContract,
  };
}

export function useNftContract() {
  const ethersAppContext = useEthersAppContext();
  const [ships, setShips] = useState<IShip[]>([]);

  const contract = useAppContracts('Starship', ethersAppContext.chainId);

  const [shipList] = useContractReader(contract, contract?.getShips, []);

  useEffect(() => {
    if (shipList) {
      setShips(
        shipList
          .map((ship) => ({
            x: parseNumber(ship[0]),
            y: parseNumber(ship[1]),
            owner: ship[2],
            id: parseNumber(ship[3]),
            isMine: ship[2] == ethersAppContext.account,
            category: ship[2] == ethersAppContext.account ? 'Me' : 'NotMe',
          }))
          .filter((ship) => ship.id > 0)
      );
    }
  }, [shipList, ethersAppContext.account]);

  return {
    ships,
    connected: !!contract,
  };
}

export function useWorldContract() {
  const ethersAppContext = useEthersAppContext();
  const [planets, setPlanets] = useState<IPlanet[]>([]);

  const contract = useAppContracts('WorldMapCreator', ethersAppContext.chainId);

  const [list] = useContractReader(contract, contract?.getPlanets, [1]);

  useEffect(() => {
    if (list) {
      setPlanets(
        list
          .map((planet) => ({
            id: parseNumber(planet[0]),
            worldMapIndex: parseNumber(planet[1]),
            x: parseNumber(planet[2]),
            y: parseNumber(planet[3]),
            planetType: parseNumber(planet[4]),
            category:
              planetCategoryIdToNameMapping[parseNumber(planet[4])] || 'Pink',
            size: 0.5,
          }))
          .filter((planet) => planet.id > 0)
      );
    }
  }, [list, ethersAppContext.account]);

  return {
    planets,
    connected: !!contract,
  };
}

function parseNumber(value: ethers.ethers.BigNumberish) {
  return parseInt(ethers.utils.formatUnits(value, 0));
}
