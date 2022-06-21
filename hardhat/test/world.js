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
    const res = await world.getPlanet(planetId);
    expect(res.xCoord).to.eq(xCoord);
    expect(res.yCoord).to.eq(yCoord);
  });

  it('can get list of planets', async function () {
    // arrange
    const planetIdRes1 = await world.manualCreatePlanet(1, 100, 101, 22);
    await planetIdRes1.wait();
    const planetIdRes2 = await world.manualCreatePlanet(1, 200, 201, 23);
    await planetIdRes2.wait();

    // act
    const res = await world.getPlanets(worldId);

    // assert
    expect(res[0].planetID).to.eq(BigNumber.from(0));
    expect(res[1].planetID).to.eq(BigNumber.from(1));
    expect(res[2].planetID).to.eq(BigNumber.from(2));

    // check last planet throughout
    expect(res[3].planetID).to.eq(BigNumber.from(3));
    expect(res[3].xCoord).to.eq(BigNumber.from(200));
    expect(res[3].yCoord).to.eq(BigNumber.from(201));
    expect(res[3].planetType).to.eq(BigNumber.from(23));
    expect(res.length).to.eq(4);
  });
});
