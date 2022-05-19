const hre = require('hardhat');

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const starship = await deploy('Starship', {
    from: deployer,
    args: [],
    log: true,
  });

  const world = await deploy('WorldMapCreator', {
    from: deployer,
    args: [],
    log: true,
  });

  await deploy('Players', {
    from: deployer,
    args: [],
    log: true,
  });

  // link contracts
  const contract = await hre.ethers.getContract('Players');
  await contract.setNftAddress(starship.address);
  await contract.setWorldAddress(world.address);

  // define worlmap
  const contract1 = await hre.ethers.getContract('WorldMapCreator');
  await contract1.defineWorldMap(1, 5000, 5000);
  await contract1.manualCreatePlanet(1, 100, 100, 1);
  await contract1.manualCreatePlanet(1, 200, 200, 2);
  await contract1.manualCreatePlanet(1, 300, 300, 2);
};
module.exports.tags = ['Starship'];
