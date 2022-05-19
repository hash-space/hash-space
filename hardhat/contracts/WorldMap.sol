//SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0 <0.9.0;

import "./PlanetFactory.sol";
import "./interfaces/IWorld.sol";

import "./interfaces/IPlanetFactory.sol";

contract WorldMapCreator is IWorld {

    struct WorldMap {
        uint256 worldIndex; // The ID for the world that was created
        uint256 Length; // The vertical length of the world map
        uint256 Breadth; // The breadth of the world map
       // uint planetsInWorld;
    }

    mapping(uint256 => WorldMap) public existingWorlds;
    mapping(uint => uint[]) public planetsInWorld;

    uint planetIndex;

    PlanetFactory _planetFactory;
    constructor() {
        planetIndex = 0;
        _planetFactory = new PlanetFactory();
    }

    // function initialiseWorld () {
        // TODO: consider using this function to call both
        // _defineWorldMap and _addPlanets functions
    // }

    function defineWorldMap(uint256 _worldIndex, uint256 _length, uint256 _breadth) public {
        // TODO: consider having the world index randomly generated
        require(existingWorlds[_worldIndex].Length == 0, "World already created with that index" );
        
        WorldMap memory newWorldMap;
        
        newWorldMap = WorldMap({
            worldIndex: _worldIndex,
            Length: _length,
            Breadth: _breadth, 
           //  PlanetsInWorld: 5
        });

        existingWorlds[_worldIndex] = newWorldMap;
    }

    function manualCreatePlanet(uint _planetID, uint _worldMapIndex,
                uint _xCoord, uint _yCoord, uint _planetType) public {

        _planetFactory.createPlanet(_planetID, _worldMapIndex,
                _xCoord, _yCoord, _planetType);
        planetsInWorld[_worldMapIndex].push(planetIndex);
        planetIndex += 1;
    }

    function addPlanets(uint _numPlanets, uint256 _worldIndex) public {
        // TODO: consider modifying to be based on hash of the locations


        
        // TODO: consider renaming to add all planets

        // TODO: consider defining numPlanets based on specified density or alternative function

        for (uint i = 0; i < _numPlanets; i++) {
            uint xCoord = _planetFactory._retrieveRandomNumber() % getWorldMap(_worldIndex).Breadth;
            uint yCoord = _planetFactory._retrieveRandomNumber() % getWorldMap(_worldIndex).Length;
            uint planetType = 0; // temporarily only using one planet type
            _planetFactory.createPlanet(planetIndex, _worldIndex, xCoord, yCoord, planetType);
            // TODO: add error handling for if planet already exists -> to re-generate random numbers and make another one
            planetsInWorld[_worldIndex].push(planetIndex);
            planetIndex += 1;
        }        
    }


    function getLocation(uint256 _worldId, uint256 _planetId) public pure override returns(uint x, uint y) {
        
        
        return (1,2);
    }


    function getWorldMap(uint256 _selectedWorldIndex) public view returns(WorldMap memory) {
        return existingWorlds[_selectedWorldIndex];
    }

    function deleteWorld(uint256 _selectedWorldIndex) public { // TODO: make only owner /restricted
        delete(existingWorlds[_selectedWorldIndex]);
    }


}
