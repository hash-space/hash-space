const { ethers } = require('hardhat');
const { use, expect } = require('chai');
const { solidity } = require('ethereum-waffle');

use(solidity);

describe('Player', function () {
  let starShip;
  let player;
  let world;
  const worldId = 1;

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

  it('user can list ships', async function () {
    const [owner, addr1] = await ethers.getSigners();
    await hre.network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [addr1.address],
    });
    const signer = await ethers.getSigner(addr1.address);
    await player.connect(signer).registerProfile();

    // act
    const ships = await starShip.getShips();

    // assert
    expect(ships.length).to.eq(3);
    expect(ships[1].owner).to.eq(owner.address);
    expect(ships[1].x).to.eq(400);
    expect(ships[1].y).to.eq(450);
    expect(ships[2].owner).to.eq(addr1.address);
    expect(ships[2].x).to.eq(10);
    expect(ships[2].y).to.eq(10);
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
    expect(ships[1].x).to.eq(400);
    expect(ships[1].y).to.eq(450);
    expect(ships[2].owner).to.eq(addr1.address);
    expect(ships[2].x).to.eq(10);
    expect(ships[2].y).to.eq(10);
  });
});
