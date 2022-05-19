//SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0 <0.9.0;

// import "usingtellor/contracts/UsingTellor.sol";
import "./DeFI/interfaces/IVault.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


//import "UsingTellor"
// contract PlanetFactory is UsingTellor {
contract PlanetFactory {

    // Define planet types
    struct PlanetCharacs {
        uint radius;
        string yield_source;
        string image_link;
    }
    PlanetCharacs[] public planetTypes;

    address vaultWrapper;

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


    function setVaultWrapper(address newVaultWrapper) external onlyOwner  {
        vaultWrapper = newVaultWrapper;
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

    function getPlanet(uint _planetId) public view returns (uint _planetId, uint _worldMapIndex, uint _xCoord, uint _yCoord, uint ) {
        return existingPlanets[_planetId];
    }

    function retrieveTokens(uint _id) public {
        // TODO: add require statement that ship location is at planet
        // then, send all tokens to msg.sender

    }

    // function _retrieveRandomNumber() public view returns (uint256) {
    //     return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, "TellorRNG")));
    //    //
    // }

   // TODO: figure out how to deploy with Tellor, then use this as random number function
    function _retrieveRandomNumber(uint256 _timestamp) internal view returns(uint256) {
  
    }

}
