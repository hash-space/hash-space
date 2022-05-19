pragma solidity ^0.8.9;

interface IPlayer {

function setNftAddress(address _nftContractAddress) public;

function registerProfile() public;

function syncSteps(uint steps) public ;

function moveShip(uint x, uint y, uint256 planetId, uint256 shipId) public;












}