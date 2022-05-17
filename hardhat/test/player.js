const { ethers } = require('hardhat');
const { use, expect } = require('chai');
const { solidity } = require('ethereum-waffle');

use(solidity);

describe('Player', function () {
  let sharShip;
  let player;
  let world;
  const worldId = 1;

  it('should deploy sharShip', async function () {
    const YourContract = await ethers.getContractFactory('Starship');

    sharShip = await YourContract.deploy();
  });
  it('should deploy Players', async function () {
    const YourContract = await ethers.getContractFactory('Players');

    player = await YourContract.deploy();
    await player.setNftAddress(sharShip.address);
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
    expect(await sharShip.balanceOf(owner.address)).be.equal(1);
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
    const shipId = await sharShip.tokenId();
    await player.moveShip(newX, newY, planetId, shipId, worldId);
    const newLocationOfShip = await sharShip.getLocation(shipId);

    // assert
    expect(newLocationOfShip.x).to.eq(newX);
    expect(newLocationOfShip.y).to.eq(newY);
  });
});
