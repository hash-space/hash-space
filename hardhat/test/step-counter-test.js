const { expect, use } = require("chai");
const { ethers } = require("hardhat");
const { MockProvider } = require('ethereum-waffle');


describe("StepCounter", function () {
  const provider = new MockProvider()
  const [alice] = provider.getWallets();
  let num_steps = 1000;
  let time_queried = Date.now()

  it("Should return steps after player added", async function () {
    const StepCounter = await ethers.getContractFactory("StepCounter");
    const stepcounter = await StepCounter.deploy();
    await stepcounter.deployed();
    
    const addPlayerTx = await stepcounter.addPlayer(alice.address, num_steps, time_queried);
    await addPlayerTx.wait()
    expect(await stepcounter.getStepCount(alice.address)).to.equal(num_steps);
  
  });

  it("Adding player emits event", async function() {
    const StepCounter = await ethers.getContractFactory("StepCounter");
    const stepcounter = await StepCounter.deploy();
    await stepcounter.deployed();

    await expect(stepcounter.addPlayer(alice.address, num_steps, time_queried))
      .to.emit(stepcounter, 'NewPlayer')
      .withArgs(alice.address);
  });

  it("Should add steps to player", async function () {
    const StepCounter = await ethers.getContractFactory("StepCounter");
    const stepcounter = await StepCounter.deploy();
    await stepcounter.deployed();

    const addPlayerTx = await stepcounter.addPlayer(alice.address, num_steps, time_queried);
    await addPlayerTx.wait()

    const stepChange = 500;
    const setStepTx = await stepcounter.updateSteps(alice.address, stepChange, time_queried);
    await setStepTx.wait();

    expect(await stepcounter.getStepCount(alice.address)).to.equal(num_steps + stepChange);
  });

  it("Should take action and return updated step count", async function () {
    const StepCounter = await ethers.getContractFactory("StepCounter");
    const stepcounter = await StepCounter.deploy();
    await stepcounter.deployed();

    const addPlayerTx = await stepcounter.addPlayer(alice.address, num_steps, time_queried);
    await addPlayerTx.wait()

    const steps_required = 50
    const takeActionTx = await stepcounter.takeAction(alice.address, steps_required)
    await takeActionTx.wait()

    expect(await stepcounter.getStepCount(alice.address)).to.equal(num_steps - steps_required);
  });

  it("Should emit action event", async function() {
    const StepCounter = await ethers.getContractFactory("StepCounter");
    const stepcounter = await StepCounter.deploy();
    await stepcounter.deployed();

    const addPlayerTx = await stepcounter.addPlayer(alice.address, num_steps, time_queried);
    await addPlayerTx.wait()

    const steps_required = 50
    await expect(stepcounter.takeAction(alice.address, steps_required))
      .to.emit(stepcounter, 'ActionTaken')
      .withArgs(alice.address);
  });

  it("Should revert if not enough steps for action", async function() {
    const StepCounter = await ethers.getContractFactory("StepCounter");
    const stepcounter = await StepCounter.deploy();
    await stepcounter.deployed();

    const addPlayerTx = await stepcounter.addPlayer(alice.address, num_steps, time_queried);
    await addPlayerTx.wait()

    const steps_required = 1500
    await expect(stepcounter.takeAction(alice.address, steps_required)).to.be.reverted;
  });
// TODO: add test for when last queried
});
