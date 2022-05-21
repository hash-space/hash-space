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
      gas: 4000000,
    },
    arbitrum_nitro: {
      chainId: 421612,
      url: 'https://nitro-devnet.arbitrum.io/rpc',
      accounts: [process.env.PRIVATE_KEY_ARBITRUM_NITRO],
      gas: 4000000,
    },
    emerald_mainnet: {
      chainId: 42262,
      url: 'https://emerald.oasis.dev',
      accounts:
        process.env.PRIVATE_KEY_OASIS !== undefined
          ? [process.env.PRIVATE_KEY_OASIS]
          : [],
    },
    emerald_testnet: {
      url: 'https://testnet.emerald.oasis.dev',
      chainId: 42261,
      accounts:
        process.env.PRIVATE_KEY_OASIS !== undefined
          ? [process.env.PRIVATE_KEY_OASIS]
          : [],
    },
  },
  namedAccounts: {
    deployer: 0,
  },
  paths: {
    sources: 'contracts',
  },
  mocha: {
    timeout: 60000,
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
