//SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0 <0.9.0;

import "usingtellor/contracts/UsingTellor.sol";

// contract PlanetFactor is UsingTellor {
contract PlanetFactory {

    // Define planet types
    struct PlanetCharacs {
        uint radius;
        string yield_source;
        string image_link;
    }
    PlanetCharacs[] public planetTypes;

    // Define planet information
    struct Planet {
        uint planetID; // an ID that is unique across all world maps
        uint worldMapIndex; // which world map does this planet belong to
        uint xCoord; // x-axis coordinate in respective world map
        uint yCoord; // y-axis coordinate in respective world map
        uint planetType; 
        uint balance; // The total value of tokens inside the planet
        // address walletAddress; // TODO: consider keeping the money elsewhere
        // (e.g. in a WorldMap wallet address), and just tracking the amounts here
    }

    // Create mapping of of planets
    mapping(uint => Planet) public existingPlanets;
    
    // constructor(address payable _tellorAddress) UsingTellor(_tellorAddress) public {}
    constructor(address payable _tellorAddress) UsingTellor(_tellorAddress) public {

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

        Planet memory newPlanet;

        newPlanet = Planet({
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

    function getPlanet(uint _planetId) public view returns (Planet memory) {
        return existingPlanets[_planetId];
    }

    function retrieveTokens(uint _id) public {
        // TODO: add require statement that ship location is at planet
        // then, send all tokens to msg.sender
    }

    function _retrieveRandomNumber() public view returns (uint256) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, "TellorRNG")));
        // TODO: modify to enable multiple modificaitons during the same time stamp
    }

    // TODO: figure out how to deploy with Tellor, then use this as random number function
    // function _retrieveRandomNumber(uint256 _timestamp) internal view returns(uint256) {
    //     bytes memory _queryData = abi.encode("TellorRNG", abi.encode(_timestamp));
    //     bytes32 _queryId = keccak256(_queryData);
    //     bytes memory _randomNumberBytes;
    //     (, _randomNumberBytes, ) = getDataBefore(_queryId, block.timestamp - 10 minutes);
    //     uint256 _randomNumber = abi.decode(_randomNumberBytes, (uint256));
    //     return _randomNumber;
    // }

}



