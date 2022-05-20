const hre = require('hardhat');

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const starship = await deploy('Starship', {
    from: deployer,
    gasLimit: 4000000,
    args: [],
    log: true,
  });

  const world = await deploy('WorldMapCreator', {
    from: deployer,
    gasLimit: 4000000,
    args: [],
    log: true,
  });

  await deploy('Players', {
    from: deployer,
    gasLimit: 4000000,
    args: [],
    log: true,
  });

  // link contracts
  const contractPlayers = await hre.ethers.getContract('Players');
  const txNft = await contractPlayers.setNftAddress(starship.address);
  const txWorld = await contractPlayers.setWorldAddress(world.address);
  await Promise.all([txNft.wait(), txWorld.wait()]);

  // define worldmap
  const contractWorld = await hre.ethers.getContract('WorldMapCreator');
  const txCreateWorld = await contractWorld.defineWorldMap(1, 5000, 5000, 0);
  await txCreateWorld.wait();
  const txPlanet1 = await contractWorld.manualCreatePlanet(1, 100, 100, 1);
  const txPlanet2 = await contractWorld.manualCreatePlanet(1, 200, 200, 2);
  const txPlanet3 = await contractWorld.manualCreatePlanet(1, 300, 300, 2);
  await Promise.all([txPlanet1.wait(), txPlanet2.wait(), txPlanet3.wait()]);



};
module.exports.tags = ['Starship'];
