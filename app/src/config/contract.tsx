import {
  contractsContextFactory,
  createConnectorForHardhatContract,
} from 'eth-hooks/context';
import { TTypedContract } from 'eth-hooks/models';
import * as hardhatContracts from '../generated/contract-types/index';
import hardhatContractsJson from '../generated/hardhat_contracts.json';

export const contractConnectorConfig = () => {
  try {
    console.log(hardhatContractsJson);
    const result = {
      Players: createConnectorForHardhatContract(
        'Players',
        hardhatContracts.Players__factory,
        hardhatContractsJson
      ),
      Starship: createConnectorForHardhatContract(
        'Starship',
        hardhatContracts.Starship__factory,
        hardhatContractsJson
      ),
    } as const;

    return result;
  } catch (e) {
    console.error(
      '❌ contractConnectorConfig: ERROR with loading contracts please run `yarn contracts:build or yarn contracts:rebuild`.  Then run `yarn deploy`!',
      e
    );
  }

  return undefined;
};

// create a type from the return value of the function above
export type TAppConnectorList = NonNullable<
  ReturnType<typeof contractConnectorConfig>
>;

export const {
  ContractsAppContext,
  useAppContractsActions,
  useAppContracts,
  useLoadAppContracts,
  useConnectAppContracts,
} = contractsContextFactory<
  /* the contractNames (keys) in config output */
  keyof TAppConnectorList,
  /* the type of the config output  */
  TAppConnectorList,
  /* A type that infers the value of each contractName: contract pair*/
  TTypedContract<keyof TAppConnectorList, TAppConnectorList>
>(contractConnectorConfig);
