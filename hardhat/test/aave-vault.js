const { expect } = require('chai');
const { BigNumber } = require('ethers');
const { ethers, upgrades } = require('hardhat');

describe('Aave Vault', function () {
  it('can deploy', async function () {
    const Box = await ethers.getContractFactory('AaveVault');

    const instance = await upgrades.deployProxy(Box, [
      '0x2a58E9bbb5434FdA7FF78051a4B82cb0EF669C17',
      '0x89a6AE840b3F8f489418933A220315eeA36d11fF',
      '0x6C9fB0D5bD9429eb9Cd96B85B81d872281771E6B',
      '0x6C9fB0D5bD9429eb9Cd96B85B81d872281771E6B',
    ]);
    await instance.deployed();
  });
});
