module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  console.log(deployer);
  await deploy('Greeter', {
    from: deployer,
    args: ['test'],
    log: true,
  });
};
module.exports.tags = ['Greeter'];
