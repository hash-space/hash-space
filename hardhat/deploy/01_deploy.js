const hre = require('hardhat');

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  // const starship = await deploy('Starship', {
  //   from: deployer,
  //   gasLimit: 8000000,
  //   args: ['0x207Fa8Df3a17D96Ca7EA4f2893fcdCb78a304101'], // polygon
  //   log: true,
  // });
  // await deploy('StarToken', {
  //   from: deployer,
  //   gasLimit: 8000000,
  //   args: [],
  //   log: true,
  // });

  const world = await deploy('WorldMapCreator', {
    from: deployer,
    gasLimit: 8000000,
    args: [
      '0x41b66dd93b03e89D29114a7613A6f9f0d4F40178',
      '0xD789488E5ee48Ef8b0719843672Bc04c213b648c',
      '0x45cAF1aae42BA5565EC92362896cc8e0d55a2126',
      10000
    ],
    log: true,
  });

  // const players = await deploy('Players', {
  //   from: deployer,
  //   gasLimit: 4000000,
  //   args: [],
  //   log: true,
  // });

  // link contracts
  // const contractPlayers = await hre.ethers.getContract('Players');
  // const contractStartship = await hre.ethers.getContract('Starship');
  // const txNft = await contractPlayers.setNftAddress(starship.address);
  // const txWorld = await contractPlayers.setWorldAddress(world.address);
  // const txNftLink = await contractStartship.setPlayerContract(players.address);
  // await Promise.all([txNft.wait(), txWorld.wait(), txNftLink.wait()]);

  // define worldmap
  const contractWorld = await hre.ethers.getContract('WorldMapCreator');
  // const txCreateWorld = await contractWorld.defineWorldMap(1, 5000, 5000);
  const txCreateWorld = await contractWorld.defineWorldMap(5000, 5000);


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
};
// module.exports.tags = ['Starship'];
