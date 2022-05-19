pragma solidity >=0.8.0 <0.9.0;

interface IWorld {
    /**
      gets the location of a planet in a world
      
    */
    
    function getLocation(
        uint256 _worldId,
        uint256 _planetId
    ) external returns (uint x, uint y);

    /**
      sets the location of the ship
    // */
    // function setLocation(
    //     uint256 _tokenId,
    //     address _ownerAddress,
    //     uint x,
    //     uint y
    // ) external;

    // /** mints a new nft ship */
    // function mint(address player) external returns (uint256);
}