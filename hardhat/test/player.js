const { ethers } = require('hardhat');
const { use, expect } = require('chai');
const { solidity } = require('ethereum-waffle');

use(solidity);

describe('Player', function () {
  let sharShip;
  let player;

  // quick fix to let gas reporter fetch data from gas station & coinmarketcap
  before((done) => {
    setTimeout(done, 2000);
  });

  describe('deploy', function () {
    it('Should deploy sharShip', async function () {
      const YourContract = await ethers.getContractFactory('Starship');

      sharShip = await YourContract.deploy();
    });
    it('Should deploy Players', async function () {
      const YourContract = await ethers.getContractFactory('Players');

      player = await YourContract.deploy();
      await player.setNftAddress(sharShip.address);
    });
  });

  describe('register', function () {
    it('User should be able to register', async function () {
      await player.registerProfile();
      const [owner] = await ethers.getSigners();
      expect(await sharShip.balanceOf(owner.address)).be.equal(1);
    });
  });
});
