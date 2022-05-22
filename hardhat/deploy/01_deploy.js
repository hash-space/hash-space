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
      '0x86c428b9a0c43d78bee4b6bea1e7d149b116e09c',
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
  const txCreateWorld = await contractWorld.defineWorldMap(1, 5000, 5000);
  await txCreateWorld.wait();
  const txPlanet1 = await contractWorld.manualCreatePlanet(1, 100, 100, 1);
  const txPlanet2 = await contractWorld.manualCreatePlanet(1, 200, 200, 2);
  const txPlanet3 = await contractWorld.manualCreatePlanet(1, 300, 300, 2);
  await Promise.all([txPlanet1.wait(), txPlanet2.wait(), txPlanet3.wait()]);
};
// module.exports.tags = ['Starship'];
