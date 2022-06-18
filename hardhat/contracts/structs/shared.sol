//SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0 <0.9.0;

library SharedStructs {
        // Define planet information
    struct Planet {
        uint planetID; // an ID that is unique across all world maps
        uint worldMapIndex; // which world map does this planet belong to
        uint xCoord; // x-axis coordinate in respective world map
        uint yCoord; // y-axis coordinate in respective world map
        uint planetType;
        uint balance; // The total value of tokens inside the planet
    }
}