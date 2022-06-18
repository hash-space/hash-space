//SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";
import "./structs/shared.sol";

contract PlanetFactory {

    // Define planet types
    struct PlanetCharacs {
        uint radius;
        string yield_source;
        string image_link;
    }
    PlanetCharacs[] public planetTypes;

    // Create mapping of of planets
    mapping(uint => SharedStructs.Planet) public existingPlanets;

    // constructor(address payable _tellorAddress) UsingTellor(_tellorAddress) public {}
    constructor() {

        // Add one planet type
        PlanetCharacs memory newPlanetType1;

        newPlanetType1 = PlanetCharacs({
            radius: 2,
            yield_source: "yearn",
            image_link: "https://TODO-add-IPFS-link"
        });

        planetTypes.push(newPlanetType1);

        // TODO: add other planet types in future
    }


    function createPlanet(uint _planetID, uint _worldMapIndex,
                uint _xCoord, uint _yCoord, uint _planetType) public {
        // TODO: add constraint for proximity to other planets
        // TODO: figure out how to generate the planet address? (if reqd)

       SharedStructs.Planet memory newPlanet;

        newPlanet = SharedStructs.Planet({
            planetID: _planetID,
            worldMapIndex: _worldMapIndex,
            xCoord: _xCoord,
            yCoord: _yCoord,
            planetType: _planetType,
            balance: 0
            // walletAddress: _planetAddress
        });

        existingPlanets[_planetID] = newPlanet;

    }

    function getPlanet(uint _planetId) public view returns (SharedStructs.Planet memory) {
        return existingPlanets[_planetId];
    }
}
