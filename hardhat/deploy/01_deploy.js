const hre = require('hardhat');

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const backendAddress = '0x1712C64a90164e03A2B61ee0f66712da3355a932';
  // aave
  const gatewayAddress = '0x2a58E9bbb5434FdA7FF78051a4B82cb0EF669C17';
  const assetAdress = '0x89a6AE840b3F8f489418933A220315eeA36d11fF';
  const poolAddress = '0x6C9fB0D5bD9429eb9Cd96B85B81d872281771E6B';

  const starship = await deploy('Starship', {
    from: deployer,
    gasLimit: 8000000,
    args: ['0x207Fa8Df3a17D96Ca7EA4f2893fcdCb78a304101'], // polygon
    log: true,
  });

  const world = await deploy('WorldMapCreator', {
    from: deployer,
    gasLimit: 4000000,
    args: [],
    log: true,
    proxy: {
      owner: deployer,
      proxyContract: 'OpenZeppelinTransparentProxy',
      execute: {
        init: {
          methodName: 'initialize',
          args: [],
        },
      },
    },
  });

  const players = await deploy('Players', {
    from: deployer,
    gasLimit: 4000000,
    args: [],
    log: true,
    proxy: {
      owner: deployer,
      proxyContract: 'OpenZeppelinTransparentProxy',
      execute: {
        init: {
          methodName: 'initialize',
          args: [],
        },
      },
    },
  });

  const vault = await deploy('AaveVault', {
    from: deployer,
    gasLimit: 4000000,
    args: [],
    log: true,
    proxy: {
      owner: deployer,
      proxyContract: 'OpenZeppelinTransparentProxy',
      execute: {
        init: {
          methodName: 'initialize',
          args: [gatewayAddress, assetAdress, poolAddress, players.address],
        },
      },
    },
  });

  let contracts = {};
  contracts['vault'] = {
    proxy: vault.address,
    implementation: vault.implementation,
  };
  contracts['players'] = {
    proxy: players.address,
    implementation: players.implementation,
  };
  contracts['world'] = {
    proxy: world.address,
    implementation: world.implementation,
  };
  console.log('ship', starship.address);
  console.table(contracts);

  // link contracts
  const contractPlayers = await hre.ethers.getContract('Players');
  const contractStartship = await hre.ethers.getContract('Starship');
  const txNft = await contractPlayers.setNftAddress(starship.address);
  const txBackend = await contractPlayers.setBackendAddress(backendAddress);
  const txWorld = await contractPlayers.setWorldAddress(world.address);
  const txVault = await contractPlayers.setAaveVault(vault.address);
  const txNftLink = await contractStartship.setPlayerContract(players.address);
  await Promise.all([
    txNft.wait(),
    txVault.wait(),
    txWorld.wait(),
    txNftLink.wait(),
    txBackend.wait(),
  ]);

  // verify
  if (hre.network.name !== 'hardhat' && hre.network.name !== 'localhost') {
    await tryCatch(() =>
      hre.run('verify:verify', {
        address: vault.implementation,
        constructorArguments: [],
      })
    );
    await tryCatch(() =>
      hre.run('verify:verify', {
        address: players.implementation,
        constructorArguments: [],
      })
    );
    await tryCatch(() =>
      hre.run('verify:verify', {
        address: world.implementation,
        constructorArguments: [],
      })
    );
  }
};
module.exports.tags = ['Starship'];

async function tryCatch(func) {
  try {
    await func();
  } catch (e) {
    console.log(e);
  }
}
