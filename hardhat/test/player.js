const { ethers } = require('hardhat');
const { use, expect } = require('chai');
const { solidity, MockProvider } = require('ethereum-waffle');

use(solidity);

describe('Player', function () {
  let starShip;
  let player;
  let world;
  const worldId = 1;
  const [alice, bob, charlie, david] = new MockProvider().getWallets();

  it('should deploy starShip', async function () {
    const YourContract = await ethers.getContractFactory('Starship');

    starShip = await YourContract.deploy();
  });
  it('should deploy Players', async function () {
    const YourContract = await ethers.getContractFactory('Players');

    player = await YourContract.deploy();
    await player.setNftAddress(starShip.address);
  });
  it('should deploy World', async function () {
    const YourContract = await ethers.getContractFactory('WorldMapCreator');

    world = await YourContract.deploy();
    await world.defineWorldMap(worldId, 2000, 2000);
    await player.setWorldAddress(world.address);
  });

  it('user should be able to register', async function () {
    await player.registerProfile();
    const [owner] = await ethers.getSigners();
    expect(await starShip.balanceOf(owner.address)).be.equal(1);
    
  });

  it('user should be able to sync steps', async function () {
    const res = await player.syncSteps(100);
    await res.wait();
    const [owner] = await ethers.getSigners();
    const stepsResult = await player.players(owner.address);

    // assert
    expect(stepsResult.totalStepsTaken).to.eq(100);
    expect(stepsResult.stepsAvailable).to.eq(100);
  });

  it('user should be able to accumulate steps', async function () {
    const res = await player.syncSteps(200);
    await res.wait();
    const [owner] = await ethers.getSigners();
    const stepsResult = await player.players(owner.address);

    // assert
    expect(stepsResult.totalStepsTaken).to.eq(300);
    expect(stepsResult.stepsAvailable).to.eq(300);
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

  it('multiple starships should start in the correct locations', async function () {
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
    starShip2 = await StarshipContract.deploy();

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
      await player3.incrementPositionCounter();
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

  it('position index counter should reset at 100', async function () {
    let player5;
    let starShip5;

    // create player and starship
    const PlayerContract = await ethers.getContractFactory('Players');
    const StarshipContract = await ethers.getContractFactory('Starship');
    PlayerContract.connect(david);
    player5 = await PlayerContract.deploy();
    StarshipContract.connect(david);
    starShip5 = await StarshipContract.deploy();
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
