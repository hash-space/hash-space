import React, {
  useCallback,
  useEffect,
  useState,
  useContext,
  useRef,
} from 'react';
import { useEthersAppContext } from 'eth-hooks/context';
import { useAppContracts } from '../config/contract';
import { useBlockNumber, useContractReader } from 'eth-hooks';
import * as ethers from 'ethers';
import { planetCategoryIdToNameMapping } from '../api/mapping/planets';
import { uploadIPFS } from '../helper/uploadIPFS';
import { useAuthContext } from '../context/auth';

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
  amountEarned: string;
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
  const ethersAppContext = useEthersAppContext();
  const playerContract = usePlayerContract();
  const shipsContract = useNftContract();
  const worldContract = useWorldContract();
  const isLoggedInRef = useRef(false);

  useEffect(() => {
    if (
      isLoggedInRef.current !== ethersAppContext.active &&
      !ethersAppContext.active
    ) {
      playerContract.reset();
      shipsContract.reset();
      worldContract.reset();
    } else {
      isLoggedInRef.current = ethersAppContext.active;
    }
  }, [ethersAppContext.active]);

  return (
    <_Context.Provider value={{ playerContract, shipsContract, worldContract }}>
      {props.children}
    </_Context.Provider>
  );
};

const PLAYER_DEFAULT = {
  playerId: 0,
  isSignedUp: false,
  lastQueried: 0,
  stepsAvailable: 0,
  amountEarned: '0.00',
};

export function useConquerEvent() {
  const [amount, setAmount] = useState<null | ethers.BigNumber>();
  const [planetType, setPlanet] = useState<null | ethers.BigNumber>();
  const ethersAppContext = useEthersAppContext();
  const playersContract = useAppContracts('Players', ethersAppContext.chainId);

  useBlockNumber(ethersAppContext.provider, async (blockNumber) => {
    const filter = playersContract?.filters[
      'PlanetConquer(address,uint256,uint256,uint256)'
    ](ethersAppContext.account);
    const result = await playersContract?.queryFilter(
      filter,
      blockNumber,
      blockNumber
    );
    if (result && result[0]) {
      setAmount(result[0].args.amount);
      setPlanet(result[0].args.planetType);
    }
  });

  const reset = useCallback(() => {
    setAmount(null);
    setPlanet(null);
  }, [setAmount, setPlanet]);

  return {
    reset,
    isSet: !!amount,
    amount,
    planetType,
  };
}

export function usePlayerContract() {
  const authContext = useAuthContext();
  const ethersAppContext = useEthersAppContext();
  const [playerState, setPlayerState] = useState<IPlayerState>(PLAYER_DEFAULT);

  const reset = useCallback(() => {
    setPlayerState(PLAYER_DEFAULT);
  }, [setPlayerState]);

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
        amountEarned: ethers.utils.formatEther(playerObject[5]),
      });
    }
  }, [playerObject]);

  const playerRegister = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    authContext.addTx(
      uploadIPFS().then((metadata) => {
        return playersContract.registerProfile(metadata.url, {
          value: ethers.utils.parseEther('0.01'),
        });
      })
    );
  }, [playersContract, authContext]);

  const playerSyncSteps = useCallback(
    (stepString: string) => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      const splitString = stepString.split('-') as any[];
      authContext.addTx(
        playersContract.syncSteps(
          splitString[0],
          splitString[1],
          splitString[2],
          splitString[3],
          splitString[4],
          splitString[5]
        )
      );
    },
    [playersContract, authContext]
  );

  const playerMoveShip = useCallback(
    (
      x: number,
      y: number,
      planetId: number,
      shipId: number,
      worldId: number
    ) => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      authContext.addTx(
        playersContract.moveShip(x, y, planetId, shipId, worldId)
      );
    },
    [playersContract]
  );

  return {
    reset,
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

  const reset = useCallback(() => {
    setShips([]);
  }, [setShips]);

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
    reset,
    ships,
    connected: !!contract,
  };
}

export function useWorldContract() {
  const ethersAppContext = useEthersAppContext();
  const [planets, setPlanets] = useState<IPlanet[]>([]);

  const contract = useAppContracts('WorldMapCreator', ethersAppContext.chainId);

  const reset = useCallback(() => {
    setPlanets([]);
  }, [setPlanets]);

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
    reset,
    planets,
    connected: !!contract,
  };
}

function parseNumber(value: ethers.ethers.BigNumberish) {
  return parseInt(ethers.utils.formatUnits(value, 0));
}
