import {  } from "hardhat";
import {AAVEVaultInstance, MakerdaoVaultInstance, NFTInstance} from  "../contracts/types/contracts/types";

const AAVEVault = artifacts.require("AAVEVault");
const MakerdaoVault = artifacts.require("MakerdaoVault");
const NFT = artifacts.require("NFT");
const [deployer , userPlanet, treasury] = accounts;

contract("AAVEVAult", async() => { })