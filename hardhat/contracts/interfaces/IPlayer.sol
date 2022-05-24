pragma solidity ^0.8.9;

interface IPlayer {

function setNftAddress(address _nftContractAddress) external;

function registerProfile() external;

function syncSteps(uint steps) external ;

function moveShip(uint x, uint y, uint256 planetId, uint256 shipId) external;












}