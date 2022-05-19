require('@nomiclabs/hardhat-waffle');
require('@typechain/hardhat');
require('@nomiclabs/hardhat-ethers');
require('hardhat-deploy');
require('dotenv').config();

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
    hardhat: {
      forking: {
        url:'https://eth-mainnet.alchemyapi.io/v2/${PRIVATE_KEY}',
        blockNumber:10000000
      }

    },
    localhost: {
      url: 'http://localhost:8545',
    },
    matic: {
      url: 'https://polygon-mumbai.g.alchemy.com/v2/${PRIVATE_KEY}',
      
    },
    mainnet: {
      url: 'https://eth-mainnet.alchemyapi.io/v2/${PRIVATE_KEY}'
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
    outDir: '../app/src/generated/contract-types',
    target: 'ethers-v5',
  },
};
