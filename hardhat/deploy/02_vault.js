async function main() {
  // We get the contract to deploy
  const vaultF = await ethers.getContractFactory('AaveVault');
  const vault = await vaultF.deploy();

  await vault.deployed();

  const gatewayAddress = '0x2a58E9bbb5434FdA7FF78051a4B82cb0EF669C17';
  const assetAdress = '0x89a6AE840b3F8f489418933A220315eeA36d11fF';
  const poolAddress = '0x6C9fB0D5bD9429eb9Cd96B85B81d872281771E6B';
  const tx = await vault.initialize(gatewayAddress, assetAdress, poolAddress);
  await tx.wait();

  console.log('vault deployed to:', vault.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
