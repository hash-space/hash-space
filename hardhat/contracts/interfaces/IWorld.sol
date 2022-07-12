//SPDX-License-Identifier: Unlicense

pragma solidity >=0.8.0 <0.9.0;

import "../structs/shared.sol";

interface IWorld {

    /**
      gets a planet
    */
    function getPlanet(uint _planetId) external view returns (SharedStructs.Planet memory);
}