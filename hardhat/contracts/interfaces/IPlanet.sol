//SPDX-License-Identifier: Unlicense

pragma solidity >=0.8.0 <0.9.0;

interface IPlanet {
    /**
      gets the location of the ship
    */
    function getLocation(
        uint256 _tokenId
    ) external returns (uint x, uint y);

    /**
      sets the location of the ship
    */
    function setLocation(
        uint256 _tokenId,
        address _ownerAddress,
        uint x,
        uint y
    ) external;

    /**
      mints a new nft ship
     */
    function mint(address player, string memory _tokenURI) external returns (uint256);
}