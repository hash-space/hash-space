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
};
module.exports.tags = ['Starship'];
