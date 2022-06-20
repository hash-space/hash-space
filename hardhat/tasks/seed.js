const { task, types } = require('hardhat/config');

task('seed', 'seeds worlds')
  .addParam('address', 'The address of the contract', '', types.string)
  .setAction(async ({ address }, hre) => {
    if (!address) throw new Error('needs address');

    const factory = await hre.ethers.getContractFactory('WorldMapCreator');
    const contractWorld = factory.attach(address);

    // define worldmap
    const txCreateWorld = await contractWorld.defineWorldMap(1, 5000, 5000);
    await txCreateWorld.wait();

    const txPlanet1 = await contractWorld.manualCreatePlanet(1, 100, 100, 1);
    const txPlanet2 = await contractWorld.manualCreatePlanet(1, 140, 400, 2);
    const txPlanet3 = await contractWorld.manualCreatePlanet(1, 2400, 800, 3);
    const txPlanet4 = await contractWorld.manualCreatePlanet(1, 340, 1200, 4);
    const txPlanet5 = await contractWorld.manualCreatePlanet(1, 440, 1600, 2);
    const txPlanet6 = await contractWorld.manualCreatePlanet(1, 540, 2090, 3);
    const txPlanet7 = await contractWorld.manualCreatePlanet(1, 640, 20, 1);
    const txPlanet8 = await contractWorld.manualCreatePlanet(1, 740, 160, 2);
    const txPlanet9 = await contractWorld.manualCreatePlanet(1, 840, 320, 3);
    const txPlanet10 = await contractWorld.manualCreatePlanet(1, 900, 1200, 4);
    const txPlanet11 = await contractWorld.manualCreatePlanet(1, 1050, 1600, 1);
    const txPlanet12 = await contractWorld.manualCreatePlanet(1, 1200, 2099, 2);
    const txPlanet13 = await contractWorld.manualCreatePlanet(1, 1280, 20, 3);
    const txPlanet14 = await contractWorld.manualCreatePlanet(1, 1400, 400, 4);
    const txPlanet15 = await contractWorld.manualCreatePlanet(1, 1550, 1200, 1);
    const txPlanet16 = await contractWorld.manualCreatePlanet(1, 1640, 1400, 2);
    const txPlanet17 = await contractWorld.manualCreatePlanet(1, 1700, 1600, 2);
    const txPlanet18 = await contractWorld.manualCreatePlanet(1, 1800, 2000, 4);
    const txPlanet19 = await contractWorld.manualCreatePlanet(1, 1880, 6, 3);
    const txPlanet20 = await contractWorld.manualCreatePlanet(1, 2000, 600, 3);
    const txPlanet21 = await contractWorld.manualCreatePlanet(1, 4000, 4000, 1);

    await Promise.all([
      txPlanet1.wait(),
      txPlanet2.wait(),
      txPlanet3.wait(),
      txPlanet4.wait(),
      txPlanet5.wait(),
      txPlanet6.wait(),
      txPlanet7.wait(),
      txPlanet8.wait(),
      txPlanet9.wait(),
      txPlanet10.wait(),
      txPlanet11.wait(),
      txPlanet12.wait(),
      txPlanet13.wait(),
      txPlanet14.wait(),
      txPlanet15.wait(),
      txPlanet16.wait(),
      txPlanet17.wait(),
      txPlanet18.wait(),
      txPlanet19.wait(),
      txPlanet20.wait(),
      txPlanet21.wait(),
    ]);
    console.log('done');
  });
