const { ethers } = require('hardhat');
const { use, expect } = require('chai');
const { solidity, MockProvider } = require('ethereum-waffle');

use(solidity);

describe('Player', function () {
  let starShip;
  let player;
  let world;
  let privateKeyBackend =
    '0x0123456789012345678901234567890123456789012345678901234567890123';
  let addressBackend = '0x14791697260E4c9A71f18484C9f997B308e59325';
  const worldId = 1;
  const argsStarship = '0x207Fa8Df3a17D96Ca7EA4f2893fcdCb78a304101';
  const [alice, bob, charlie, david] = new MockProvider().getWallets();

  it('should deploy starShip', async function () {
    const ShipContract = await ethers.getContractFactory('Starship');
    const PlayerContract = await ethers.getContractFactory('Players');

    player = await PlayerContract.deploy();

    starShip = await ShipContract.deploy(argsStarship);
    await player.setNftAddress(starShip.address);
    await starShip.setPlayerContract(player.address);
    await player.setBackendAddress(addressBackend);
  });
  it('should deploy World', async function () {
    const YourContract = await ethers.getContractFactory('WorldMapCreator');

    world = await YourContract.deploy();
    await world.defineWorldMap(worldId, 2000, 2000);
    await player.setWorldAddress(world.address);
  });

  it('user should be able to register', async function () {
    await player.registerProfile('', {
      value: ethers.utils.parseEther('0.01'),
    });
    const [owner] = await ethers.getSigners();
    expect(await starShip.balanceOf(owner.address)).be.equal(1);
  });

  it('user should be able to sync steps', async function () {
    const [owner] = await ethers.getSigners();
    const playerState = await player.players(owner.address);
    const stepString = await signSteps(
      90,
      playerState.lastQueried.toNumber(),
      privateKeyBackend
    );
    const res = await player.syncSteps(...stepString.split('-'));
    await res.wait();
    const stepsResult = await player.players(owner.address);

    // assert
    expect(stepsResult.totalStepsTaken).to.eq(90);
    expect(stepsResult.stepsAvailable).to.eq(90);
  });

  it('syncing steps should emit event', async function () {
    const [owner] = await ethers.getSigners();
    await expect(player.syncSteps(10))
      .to.emit(player, 'StepsAdded')
      .withArgs(10, owner.address);
    });
   
  it('user should be able to accumulate steps', async function () {
    const [owner] = await ethers.getSigners();
    const playerState = await player.players(owner.address);
    const stepString = await signSteps(
      19000,
      playerState.lastQueried.toNumber(),
      privateKeyBackend
    );
    const res = await player.syncSteps(...stepString.split('-'));
    await res.wait();
    const stepsResult = await player.players(owner.address);

    // assert
    expect(stepsResult.totalStepsTaken).to.eq(19100);
    expect(stepsResult.stepsAvailable).to.eq(19100);
  });

  it('possible to fund the treasury', async function () {
    // Should be 0.01 ether in treasury already from player registration
    expect(await player.checkContractBalance()).be.equal(
      ethers.utils.parseEther('0.01')
    );
    await player.fundTreasury({ value: ethers.utils.parseEther('0.1') });

    // assert
    expect(await player.checkContractBalance()).be.equal(
      ethers.utils.parseEther('0.11')
    );
  });

  it('funding the treasury emits an event', async function () {
    await expect(player.fundTreasury({ value: ethers.utils.parseEther('0.1') }))
      .to.emit(player, 'TreasuryFunded')
      .withArgs(ethers.utils.parseEther('0.1'));
  });

  it('user can move ship', async function () {
    // arrange
    const newX = 400;
    const newY = 450;

    // act
    await world.manualCreatePlanet(worldId, 100, 100, 22);
    const planetId = await world.planetIndex();
    const shipId = await starShip.tokenId();
    await player.moveShip(newX, newY, planetId, shipId, worldId);
    const newLocationOfShip = await starShip.getLocation(shipId);

    // assert
    expect(newLocationOfShip.x).to.eq(newX);
    expect(newLocationOfShip.y).to.eq(newY);
  });

  it('moving ship substracts correct number of steps', async function () {
    // movement during previous test is from (1,1) => (400, 450)
    // this is 600.6 steps, so testing appropriate subtraction here
    const [owner] = await ethers.getSigners();
    const stepsResult = await player.players(owner.address);
    expect(stepsResult.totalStepsTaken).to.eq(19100);
    expect(stepsResult.stepsAvailable).to.eq(13480);
    // TODO: consider amending to account for rounding error
  });

  it('moving ship to planet gets reward', async function () {
    // arrange
    const newX = 410;
    const newY = 460;
    const [owner] = await ethers.getSigners();
    await world.manualCreatePlanet(worldId, newX, newY, 2);
    const planetId = await world.planetIndex();
    const shipId = await starShip.tokenId();
    const initBalance = await owner.getBalance();

    // act
    await player.moveShip(newX, newY, planetId, shipId, worldId);

    const newBalance = await owner.getBalance();
    const stepsResult = await player.players(owner.address);
    const diff =
      ethers.utils.formatUnits(newBalance) -
      ethers.utils.formatUnits(initBalance);

    // assert
    expect(diff).to.be.greaterThan(0.004);
    expect(
      ethers.utils.formatEther(ethers.BigNumber.from(stepsResult.amountEarned))
    ).to.eq('0.005');
  });

  it('if planet has no funds, user gets no reward', async function () {
    // TODO: either drain planet funds or initiate new world/planet with no funds
  });

  it('user can list ships', async function () {
    const [owner, addr1] = await ethers.getSigners();
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
    expect(ships[1].x).to.eq(410);
    expect(ships[1].y).to.eq(460);
    expect(ships[2].owner).to.eq(addr1.address);
    expect(ships[2].x).to.eq(84);
    expect(ships[2].y).to.eq(16);
  });

  it('user can transfer ownership of ship', async function () {
    const [owner, addr1] = await ethers.getSigners();
    await hre.network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [addr1.address],
    });

    // act (transfer ownership from owner to addr1)
    let ships = await starShip.getShips();
    await starShip.transferFrom(owner.address, addr1.address, ships[1].id);
    ships = await starShip.getShips();

    // assert
    expect(ships.length).to.eq(3);
    expect(ships[1].owner).to.eq(addr1.address);
    expect(ships[1].x).to.eq(410);
    expect(ships[1].y).to.eq(460);
    expect(ships[2].owner).to.eq(addr1.address);
    expect(ships[2].x).to.eq(84);
    expect(ships[2].y).to.eq(16);
  });

  it.skip('multiple starships should start in the correct locations', async function () {
    let starShip2;
    let player2;
    let starShip3;
    let player3;
    let starShip4;
    let player4;

    // create new player and starthip
    const PlayerContract = await ethers.getContractFactory('Players');
    PlayerContract.connect(alice);
    player2 = await PlayerContract.deploy();

    StarshipContract = await ethers.getContractFactory('Starship');
    StarshipContract.connect(alice);
    starShip2 = await StarshipContract.deploy(argsStarship);

    await player2.setNftAddress(starShip2.address);
    await player2.setWorldAddress(world.address);
    await player2.registerProfile();

    // get location
    const shipId2 = await starShip2.tokenId();
    const startingLocation = await starShip2.getLocation(shipId2);

    // assert first ship
    expect(startingLocation.x).to.eq(1);
    expect(startingLocation.y).to.eq(1);

    // create second starship
    PlayerContract.connect(bob);
    player3 = await PlayerContract.deploy();
    StarshipContract.connect(bob);
    starShip3 = await StarshipContract.deploy();
    await player3.setNftAddress(starShip3.address);
    await player3.setWorldAddress(world.address);

    // increment counter to 6
    i = 0;
    while (i < 6) {
      await player3.determineStartingPosition();
      i += 1;
    }

    const counter = await player3.indexStartingPosition();
    expect(counter).to.eq(6);

    await player3.registerProfile();

    // get location
    const shipId3 = await starShip3.tokenId();
    const startingLocation3 = await starShip3.getLocation(shipId3);

    // assert second ship
    expect(startingLocation3.x).to.eq(7);
    expect(startingLocation3.y).to.eq(1);

    // create third starship
    PlayerContract.connect(charlie);
    player4 = await PlayerContract.deploy();
    StarshipContract.connect(charlie);
    starShip4 = await StarshipContract.deploy();
    await player4.setNftAddress(starShip4.address);
    await player4.setWorldAddress(world.address);

    // increment counter to 27
    i = 0;
    while (i < 27) {
      await player4.determineStartingPosition();
      i += 1;
    }

    const counter2 = await player4.indexStartingPosition();
    expect(counter2).to.eq(27);

    await player4.registerProfile();

    // get location
    const shipId4 = await starShip4.tokenId();
    const startingLocation4 = await starShip4.getLocation(shipId4);

    // assert third ship
    expect(startingLocation4.x).to.eq(8);
    expect(startingLocation4.y).to.eq(3);
  });

  it.skip('position index counter should reset at 100', async function () {
    let player5;
    let starShip5;

    // create player and starship
    const PlayerContract = await ethers.getContractFactory('Players');
    const StarshipContract = await ethers.getContractFactory('Starship');
    PlayerContract.connect(david);
    player5 = await PlayerContract.deploy();
    StarshipContract.connect(david);
    starShip5 = await StarshipContract.deploy(argsStarship);
    await player5.setNftAddress(starShip5.address);
    await player5.setWorldAddress(world.address);

    // increment counter to 105
    i = 0;
    while (i < 105) {
      await player5.determineStartingPosition();
      i += 1;
    }

    const counter = await player5.indexStartingPosition();
    expect(counter).to.eq(5);
  });
});

// this needs to match the implementation in '../../app/src/api/shared'
async function signSteps(steps, lastTimeSync, privateKey) {
  let wallet = new ethers.Wallet(privateKey);

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
