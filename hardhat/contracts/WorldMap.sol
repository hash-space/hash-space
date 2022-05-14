pragma solidity ^0.8.10;

import "../interface/IWorldMap.sol";
import "../interface/IPlayerProfile.sol";
import "usingtellor/contracts/UsingTellor.sol";
import "../utils/types.sol";

import "../"


contract WorldMap is UsingTellor {
    using Types for types;
    // just for mapping data structure (must be referred from the same storage )
    Types.PersonalProfile[] Players;

    Types.planets[] Planets;

    Types.WorldMap WorldMap;




    // game parameters

    modifier onlyPlayerProfile() {
        // require()
    }

    // initializing the game state with the planets.
    mapping(uint256 => mapping(uint256 => planets)) gameState;

    address[] playerRegistered;

    constructor(
        address payable _tellorAddress,
        uint256 length,
        uint256 breadth
    ) public UsingTellor(_tellorAddress) {
        WorldMap.Length = length;
        WorldMap.Breadth = breadth;
    }

    function addPlayers(address _newAddr) external onlyPlayerProfile {
        playerRegistered.push(_newAddr);
    }

    function getDimensions()
        external
        view
        returns (uint256 length, uint256 breadth)
    {
        length = WorldMap.Length;
        breadth = WorldMap.breadth;
    }




    function addPlanets(uint ) external onlyOwner {


    }





}
