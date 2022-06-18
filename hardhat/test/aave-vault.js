const { expect, use } = require('chai');
const { solidity } = require('ethereum-waffle');
const { ethers, upgrades } = require('hardhat');
const { smockit } = require('@eth-optimism/smock');

use(solidity);

const POOL = '0x6C9fB0D5bD9429eb9Cd96B85B81d872281771E6B';

describe('Aave Vault', function () {
  it('aave - can deposit', async () => {
    // arrange
    const { instance, _mockAaveGateway } = await setup();

    // act
    await instance.deposit({
      value: ethers.utils.parseEther('0.01'),
    });

    // assert
    const balance = await ethers.provider.getBalance(instance.address);
    expect(balance).to.equal(0);
    expect(_mockAaveGateway.smocked.depositETH.calls[0]._pool).to.eq(POOL);
    expect(_mockAaveGateway.smocked.depositETH.calls[0]._onBehalfOf).to.eq(
      instance.address
    );
    expect(_mockAaveGateway.smocked.depositETH.calls[0]._referralCode).to.eq(0);
    const amountDeposited = await instance.amountDeposited();
    expect(amountDeposited).to.eq(ethers.utils.parseEther('0.01'));
  });

  it('aave - should return balance', async () => {
    // arrange
    const { instance, _mockERC20 } = await setup();

    // act
    _mockERC20.smocked.balanceOf.will.return.with(10);
    const balance = await instance.balance();

    // assert
    expect(balance).to.equal(10);
  });

  it('aave - should return yield', async () => {
    // arrange
    const { instance, _mockERC20 } = await setup();

    // act
    await instance.deposit({
      value: ethers.utils.parseEther('1'),
    });
    _mockERC20.smocked.balanceOf.will.return.with(
      ethers.utils.parseEther('1.01')
    );
    const yield = await instance.yield();

    // assert
    expect(yield).to.equal(ethers.utils.parseEther('0.01'));
  });

  it('aave - should return yield 0 if no yield', async () => {
    // arrange
    const { instance, _mockERC20 } = await setup();

    // act
    await instance.deposit({
      value: ethers.utils.parseEther('1'),
    });
    _mockERC20.smocked.balanceOf.will.return.with(
      ethers.utils.parseEther('0.99')
    );
    const yield = await instance.yield();

    // assert
    expect(yield).to.equal(ethers.utils.parseEther('0'));
  });

  it('aave - can withdraw', async () => {
    // arrange
    const { instance, _mockERC20, _mockAaveGateway } = await setup();
    const [owner, bob, player] = await ethers.getSigners();

    // act
    await hre.network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [player.address],
    });
    _mockERC20.smocked.balanceOf.will.return.with(
      ethers.utils.parseEther('1.01')
    );
    await instance.connect(player).withdraw(bob.address);

    // assert
    expect(_mockAaveGateway.smocked.withdrawETH.calls[0]._pool).to.eq(POOL);
    expect(_mockAaveGateway.smocked.withdrawETH.calls[0]._amount).to.eq(
      ethers.utils.parseEther('1.01')
    );
    expect(_mockAaveGateway.smocked.withdrawETH.calls[0]._to).to.eq(
      bob.address
    );
  });

  it('aave - can not withdraw if not player contract', async () => {
    // arrange
    const { instance, _mockERC20 } = await setup();
    const [owner, bob, player, peter] = await ethers.getSigners();

    // act
    await hre.network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [peter.address],
    });
    _mockERC20.smocked.balanceOf.will.return.with(
      ethers.utils.parseEther('1.01')
    );
    await expect(instance.connect(peter).withdraw(bob.address)).to.be.reverted;
  });

  it('aave - can emergency withdraw', async () => {
    // arrange
    const { instance } = await setup();
    const [owner] = await ethers.getSigners();

    // act
    await instance.withdrawEmergency();
    const _owner = await instance.owner();

    // assert
    expect(_owner).to.eq(owner.address);
  });

  it('aave - can transfer ownership', async () => {
    // arrange
    const { instance } = await setup();
    const [owner, bob] = await ethers.getSigners();

    // act
    await instance.transferOwnership(bob.address);
    const _owner = await instance.owner();

    // assert
    expect(_owner).to.eq(bob.address);
  });

  it('aave - second initialize should revert', async () => {
    // arrange
    const { instance, _mockAaveGateway, _mockERC20 } = await setup();

    // act
    await expect(
      instance.initialize(
        _mockAaveGateway.address,
        _mockERC20.address,
        POOL,
        POOL
      )
    ).to.be.reverted;
  });
});

async function setup() {
  const [owner, bob, playerContract] = await ethers.getSigners();
  const MockERC20 = await ethers.getContractFactory('MockERC20');
  const mockERC20 = await MockERC20.deploy();
  await mockERC20.deployed();
  const _mockERC20 = await smockit(mockERC20);

  const MockAaveGateway = await ethers.getContractFactory('MockAaveGateway');
  const mockAaveGateway = await MockAaveGateway.deploy();
  await mockAaveGateway.deployed();
  const _mockAaveGateway = await smockit(mockAaveGateway);

  const Box = await ethers.getContractFactory('AaveVault');
  const instance = await upgrades.deployProxy(Box, [
    _mockAaveGateway.address,
    _mockERC20.address,
    POOL,
    playerContract.address,
  ]);
  await instance.deployed();
  return {
    instance,
    _mockAaveGateway,
    _mockERC20,
  };
}
