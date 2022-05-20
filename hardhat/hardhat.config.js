require('@nomiclabs/hardhat-waffle');
require('@typechain/hardhat');
require('@nomiclabs/hardhat-ethers');
require('hardhat-deploy');
require('hardhat-deploy-ethers');
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
    hardhat: {},
    localhost: {
      url: 'http://localhost:8545',
    },
    matic: {
      url: 'https://speedy-nodes-nyc.moralis.io/da30e5537ec1845bb7c5dd72/polygon/mumbai',
      accounts: [process.env.PRIVATE_KEY_MUMBAI],
    },
    arbitrum_rinkeby: {
      url: 'https://rinkeby.arbitrum.io/rpc',
      accounts: [process.env.PRIVATE_KEY_ARBITRUM],
    }
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
