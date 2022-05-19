pragma solidity ^0.8.9;


interface IPlanetFactory {

enum PlanetTypes {
    AAVEPlanet,YearnPlanet
}

function setVaultWrapper(address newVaultWrapper) external ;

function createPlanet(uint _planetID, uint _worldMapIndex,
                uint _xCoord, uint _yCoord, uint _planetType) external ;

function getPlanet(uint _planetId) public view returns (uint,uint,uint,uint,uint);









}