//SPDX-License-Identifier: Unlicense

pragma solidity >=0.8.0 <0.9.0;

interface IWorld {
    /**
      gets the location of a planet in a world
    */
    function getLocation(
        uint256 _worldId,
        uint256 _planetId
    ) external returns (uint x, uint y);
}