const hre = require("hardhat");

async function main() {

//run with this for testing: npx hardhat run scripts/deploy-nft.js --network rinkeby 
//run with this for mainnet: npx hardhat run scripts/deploy-nft.js --network mainnet

// We get the contract to deploy
  let baseTokenUri = "https://ipfs.io/ipfs/whateverCIDwegetfromIPFS/"
  const BasicNftContract = await hre.ethers.getContractFactory("BasicNft");
  const BasicNft = await BasicNftContract.deploy(baseTokenUri);

  await BasicNft.deployed();

  console.log("BasicNft deployed to:", BasicNft.address);
  console.log(`See collection in Rarible:  https://rinkeby.rarible.com/token/${BasicNft.address}`)
  console.log(`See collection in Opensea: https://testnets.opensea.io/${BasicNft.address}`)
}


const runMain = async () => {
  try {
      await main();
      process.exit(0);
  } catch (error) {
      console.log(error);
      process.exit(1);
  }
};


runMain();
