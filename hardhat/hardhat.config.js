require('@nomiclabs/hardhat-waffle');
require('@typechain/hardhat');
require('@nomiclabs/hardhat-ethers');
require('hardhat-deploy');

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: 'localhost',
  networks: {
    hardhat: {},
    localhost: {
      url: 'http://localhost:8545',
    },
  },
  namedAccounts: {
    deployer: 0,
  },
  paths: {
    sources: 'contracts',
  },
  solidity: '0.8.4',
  paths: {
    cache: './generated/cache',
    artifacts: './generated/artifacts',
    deployments: './generated/deployments',
  },
  typechain: {
    outDir: './generated/contract-types',
    target: 'ethers-v5',
  },
};
