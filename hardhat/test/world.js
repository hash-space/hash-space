const { expect } = require('chai');
const { BigNumber } = require('ethers');
const { ethers } = require('hardhat');

describe('World', function () {
  let world;
  const worldId = 1;
  it('can deploy', async function () {
    const WorldMapCreator = await ethers.getContractFactory('WorldMapCreator');
    world = await WorldMapCreator.deploy();
    await world.deployed();
    await world.defineWorldMap(worldId, 2000, 2000);
  });

  it('can get location of planet', async function () {
    const xCoord = 1000;
    const yCoord = 1000;
    const planetIdRes = await world.manualCreatePlanet(1, xCoord, yCoord, 22);
    await planetIdRes.wait();
    const planetId = await world.planetIndex();
    const res = await world.getLocation(worldId, planetId);
    expect(res[0]).to.eq(BigNumber.from(xCoord));
    expect(res[1]).to.eq(BigNumber.from(yCoord));
  });

  it('can get list of planets', async function () {
    const planetIdRes1 = await world.manualCreatePlanet(1, 100, 100, 22);
    await planetIdRes1.wait();
    const planetIdRes2 = await world.manualCreatePlanet(1, 200, 200, 23);
    await planetIdRes2.wait();
    const res = await world.getPlanets(worldId);
    expect(res[1].planetID).to.eq(BigNumber.from(1));
    expect(res[2].planetID).to.eq(BigNumber.from(2));
    expect(res.length).to.eq(3);
  });
});
