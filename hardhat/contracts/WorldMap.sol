//SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0 <0.9.0;

import "./PlanetFactory.sol";
import "./interfaces/IWorld.sol";
import "./structs/shared.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

contract WorldMapCreator is IWorld, Ownable {

    struct WorldMap {
        uint256 worldIndex; // The ID for the world that was created
        uint256 Length; // The vertical length of the world map
        uint256 Breadth; // The breadth of the world map
    }

    mapping(uint256 => WorldMap) public existingWorlds;
    mapping(uint => uint[]) public planetsInWorld;

    uint public planetIndex;

    PlanetFactory _planetFactory;

    constructor() {
        planetIndex = 0;
        _planetFactory = new PlanetFactory();
    }

    function defineWorldMap(uint256 _worldIndex, uint256 _length, uint256 _breadth) public onlyOwner {
        // TODO: consider having the world index randomly generated
        require(existingWorlds[_worldIndex].Length == 0, "World already created with that index" );

        WorldMap memory newWorldMap;

        newWorldMap = WorldMap({
            worldIndex: _worldIndex,
            Length: _length,
            Breadth: _breadth
            // PlanetsInWorld:
        });

        existingWorlds[_worldIndex] = newWorldMap;
    }

    function manualCreatePlanet(uint _worldMapIndex,
                uint _xCoord, uint _yCoord, uint _planetType) public onlyOwner returns (uint) {
        require(existingWorlds[_worldMapIndex].Length > 0, "world does not exist");

        planetIndex += 1;

        _planetFactory.createPlanet(planetIndex, _worldMapIndex,
                _xCoord, _yCoord, _planetType);
        planetsInWorld[_worldMapIndex].push(planetIndex);

        return planetIndex;
    }

    function getPlanet(uint _planetId) public override view returns (SharedStructs.Planet memory) {
        return _planetFactory.getPlanet(_planetId);
    }

    function getPlanets(uint256 _worldId) public view returns(SharedStructs.Planet[] memory) {
        uint count = planetIndex + 1;
        SharedStructs.Planet[] memory planets = new SharedStructs.Planet[](count);
        for (uint j = 0; j < count; j++) {
            SharedStructs.Planet memory planet = _planetFactory.getPlanet(j);
            planets[j] = planet;
        }
        return planets;
    }

    function getWorldMap(uint256 _selectedWorldIndex) public view returns(WorldMap memory) {
        return existingWorlds[_selectedWorldIndex];
    }

    function deleteWorld(uint256 _selectedWorldIndex) public onlyOwner {
        delete(existingWorlds[_selectedWorldIndex]);
    }


}
