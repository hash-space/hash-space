import info from '../generated/hardhat_contracts.json';

export function getAddress(
  chainId: string,
  contractName: string
): string | undefined {
  return info[chainId]?.[0]?.contracts?.[contractName]?.address;
}
