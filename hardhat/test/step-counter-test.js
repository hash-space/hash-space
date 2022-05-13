const { expect, use } = require("chai");
const { ethers } = require("hardhat");
const { MockProvider } = require('ethereum-waffle');


describe("StepCounter",  () => {
  let alice
  let stepCounterFactory
  let stepcounter

  let num_steps = 1000;
  let time_queried = Date.now()

  beforeEach(async () => {
    let signers = await ethers.getSigners()
    alice = signers[0]
    
    stepCounterFactory = await ethers.getContractFactory("StepCounter");
    stepcounter = await stepCounterFactory.deploy();
    //await stepcounter.deployed();
  })

  it("Should return steps after player added", async function () {
    const addPlayerTx = await stepcounter.addPlayer(alice.address, num_steps, time_queried);
    await addPlayerTx.wait()
    expect(await stepcounter.getStepCount(alice.address)).to.equal(num_steps);
  
  });

  it("Adding player emits event", async function() {
    await expect(stepcounter.addPlayer(alice.address, num_steps, time_queried))
      .to.emit(stepcounter, 'NewPlayer')
      .withArgs(alice.address);
  });

  describe("StepCounter excluding adding player", () => {

    beforeEach(async() => {
      const addPlayerTx = await stepcounter.addPlayer(alice.address, num_steps, time_queried);
      await addPlayerTx.wait()

    })
    it("Should add steps to player", async function () {
  
      const stepChange = 500;
      const setStepTx = await stepcounter.updateSteps(alice.address, stepChange, time_queried);
      await setStepTx.wait();
  
      expect(await stepcounter.getStepCount(alice.address)).to.equal(num_steps + stepChange);
    });
  
    it("Should take action and return updated step count", async function () {

      const steps_required = 50
      const takeActionTx = await stepcounter.takeAction(alice.address, steps_required)
      await takeActionTx.wait()
  
      expect(await stepcounter.getStepCount(alice.address)).to.equal(num_steps - steps_required);
    });
  
    it("Should emit action event", async function() {
  
      const steps_required = 50
      await expect(stepcounter.takeAction(alice.address, steps_required))
        .to.emit(stepcounter, 'ActionTaken')
        .withArgs(alice.address);
    });
  
    it("Should revert if not enough steps for action", async function() {
  
      const steps_required = 1500
      await expect(stepcounter.takeAction(alice.address, steps_required)).to.be.reverted;
    });
  // TODO: add test for when last queried
  });


  })
 
