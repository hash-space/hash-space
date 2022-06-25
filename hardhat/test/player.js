const { ethers, upgrades } = require('hardhat');
const { use, expect } = require('chai');
const { solidity } = require('ethereum-waffle');
const { smockit } = require('@eth-optimism/smock');

use(solidity);

let addressBackend = '0x14791697260E4c9A71f18484C9f997B308e59325';
let privateKeyBackend =
  '0x0123456789012345678901234567890123456789012345678901234567890123';
const proxyRegistryAddress = '0x207Fa8Df3a17D96Ca7EA4f2893fcdCb78a304101'; // Opensea
const worldId = 1;

describe('Player', function () {
  it('player - user should be able to register', async function () {
    // arrange
    const { player, starShip } = await setup();

    // act
    await register(player);

    // assert
    const [owner] = await ethers.getSigners();
    expect(await starShip.balanceOf(owner.address)).be.equal(1);
    // TODO: assert deposit
  });

  it('player - register should revert if not payed fully', async function () {
    // arrange
    const { player } = await setup();

    // act
    await expect(
      player.registerProfile('', {
        value: ethers.utils.parseEther('0.001'),
      })
    ).to.be.reverted;

    // assert
  });

  it('player - register should revert signed up a second time', async function () {
    // arrange
    const { player } = await setup();

    // act
    await register(player);

    // assert
    await expect(register(player)).to.be.reverted;
  });

  it('player - user should be able to sync steps', async function () {
    // arrange
    const { player } = await setup();
    const [owner] = await ethers.getSigners();
    const steps = 90;

    // act
    await register(player);
    const res = await addSteps(player, steps, owner);

    // assert
    const stepsResult = await player.players(owner.address);
    expect(stepsResult.totalStepsTaken).to.eq(steps);
    expect(stepsResult.stepsAvailable).to.eq(steps);
    await expect(res).to.emit(player, 'StepsAdded');
  });

  it('player - user should be able to accumulate steps', async function () {
    // arrange
    const { player } = await setup();
    const [owner] = await ethers.getSigners();

    // act
    await register(player);
    await addSteps(player, 90, owner);
    await addSteps(player, 120, owner);

    // assert
    const stepsResult = await player.players(owner.address);
    expect(stepsResult.totalStepsTaken).to.eq(90 + 120);
    expect(stepsResult.stepsAvailable).to.eq(90 + 120);
  });

  it('player - user can move ship', async function () {
    // arrange
    const [owner] = await ethers.getSigners();
    const { world, starShip, player } = await setup();
    const newX = 400;
    const newY = 450;

    // act
    await register(player);
    await addSteps(player, 19100, owner);
    await world.manualCreatePlanet(worldId, 100, 100, 22);
    const planetId = await world.planetIndex();
    const shipId = await starShip.tokenId();
    await player.moveShip(newX, newY, planetId, shipId, worldId);
    const newLocationOfShip = await starShip.getLocation(shipId);

    // assert
    const stepsResult = await player.players(owner.address);
    expect(newLocationOfShip.x).to.eq(newX);
    expect(newLocationOfShip.y).to.eq(newY);
    expect(stepsResult.totalStepsTaken).to.eq(19100);
    expect(stepsResult.stepsAvailable).to.eq(13480);
  });

  it('player - moving ship to planet gets reward (aave)', async function () {
    // arrange
    const [owner] = await ethers.getSigners();
    const { world, starShip, player, _mockAaveVault } = await setup();
    const newX = 400;
    const newY = 450;

    // act
    await register(player);
    await addSteps(player, 19100, owner);
    await world.manualCreatePlanet(worldId, 400, 450, 1);
    const planetId = await world.planetIndex();
    const shipId = await starShip.tokenId();
    _mockAaveVault.smocked.yield.will.return.with(
      ethers.utils.parseEther('0.02')
    );
    const res = await player.moveShip(newX, newY, planetId, shipId, worldId);

    // assert
    await expect(res).to.emit(player, 'PlanetConquer');
    expect(_mockAaveVault.smocked.withdraw.calls[0]._receiver).to.eq(
      owner.address
    );
  });

  it('player - if planet has no funds, user gets no reward (aave)', async function () {
    // arrange
    const [owner] = await ethers.getSigners();
    const { world, starShip, player, _mockAaveVault } = await setup();
    const newX = 400;
    const newY = 450;

    // act
    await register(player);
    await addSteps(player, 19100, owner);
    await world.manualCreatePlanet(worldId, 400, 450, 1);
    const planetId = await world.planetIndex();
    const shipId = await starShip.tokenId();
    _mockAaveVault.smocked.yield.will.return.with(
      ethers.utils.parseEther('0.00')
    );
    const res = await player.moveShip(newX, newY, planetId, shipId, worldId);

    // assert
    await expect(res).to.emit(player, 'PlanetConquer');
    expect(_mockAaveVault.smocked.withdraw.calls[0]).to.eq(undefined);
  });

  it('player - user can list ships', async function () {
    const { player, starShip } = await setup();
    const [owner, addr1] = await ethers.getSigners();
    await register(player);
    await hre.network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [addr1.address],
    });
    const signer = await ethers.getSigner(addr1.address);
    await player
      .connect(signer)
      .registerProfile('', { value: ethers.utils.parseEther('0.01') });

    // act
    const ships = await starShip.getShips();

    // assert
    expect(ships.length).to.eq(3);
    expect(ships[1].owner).to.eq(owner.address);
    expect(ships[1].x).to.eq(42);
    expect(ships[1].y).to.eq(16);
    expect(ships[2].owner).to.eq(addr1.address);
    expect(ships[2].x).to.eq(84);
    expect(ships[2].y).to.eq(16);
  });

  it('player - user can transfer ownership of ship', async function () {
    const { player, starShip } = await setup();
    const [owner, addr1] = await ethers.getSigners();
    await register(player);
    await hre.network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [addr1.address],
    });

    // act (transfer ownership from owner to addr1)
    let ships = await starShip.getShips();
    await starShip.transferFrom(owner.address, addr1.address, ships[1].id);
    ships = await starShip.getShips();

    // assert
    expect(ships.length).to.eq(2);
    expect(ships[1].owner).to.eq(addr1.address);
  });
});

// this needs to match the implementation in '../../app/src/api/shared'
async function signSteps(steps, lastTimeSync) {
  let wallet = new ethers.Wallet(privateKeyBackend);

  // hash payload
  let payload = ethers.utils.defaultAbiCoder.encode(
    ['uint256', 'uint256'],
    [steps, lastTimeSync]
  );
  let payloadHash = ethers.utils.keccak256(payload);

  // sign the binary data
  let flatSig = await wallet.signMessage(ethers.utils.arrayify(payloadHash));

  let sig = ethers.utils.splitSignature(flatSig);

  // serialize in one long string
  return [payloadHash, steps, lastTimeSync, sig.v, sig.r, sig.s].join('-');
}

async function setup() {
  const ShipContract = await ethers.getContractFactory('Starship');
  const PlayerContract = await ethers.getContractFactory('Players');
  const WorldContract = await ethers.getContractFactory('WorldMapCreator');
  const MockAaveVault = await ethers.getContractFactory('AaveVault');

  // deploy
  const world = await upgrades.deployProxy(WorldContract, []);
  const player = await upgrades.deployProxy(PlayerContract, []);
  const starShip = await ShipContract.deploy(proxyRegistryAddress);
  const mockAaveVault = await MockAaveVault.deploy();
  await world.deployed();
  await player.deployed();
  await starShip.deployed();
  await mockAaveVault.deployed();
  const _mockAaveVault = await smockit(mockAaveVault);

  // init
  await player.setNftAddress(starShip.address);
  await player.setBackendAddress(addressBackend);
  await player.setWorldAddress(world.address);
  await player.setAaveVault(_mockAaveVault.address);

  await world.defineWorldMap(worldId, 2000, 2000);
  await starShip.setPlayerContract(player.address);

  return {
    world,
    player,
    starShip,
    _mockAaveVault,
  };
}

async function addSteps(player, steps, owner) {
  const playerState = await player.players(owner.address);
  const stepString = await signSteps(steps, playerState.lastQueried.toNumber());
  const res = await player.syncSteps(...stepString.split('-'));
  await res.wait();
  return res;
}

function register(player) {
  return player.registerProfile('', {
    value: ethers.utils.parseEther('0.01'),
  });
}
