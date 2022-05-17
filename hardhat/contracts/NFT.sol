pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/IPlanet.sol";

contract Starship is ERC721, IPlanet {
    using Counters for Counters.Counter;
    Counters.Counter public tokenId;

    struct Location {
            uint x;
            uint y;
    }


    mapping (uint256 => Location) shipLocation;

    constructor() ERC721("Startship", "SHIP") public {
    }

    function getLocation(
        uint256 _tokenId
    ) public override view returns (uint x, uint y) {
         Location memory location = shipLocation[_tokenId];
         return (location.x, location.y);
    }

    /**
        TOOD: secure, only allow calls from PlayerContract
     */
    function setLocation(
        uint256 _tokenId,
        address _ownerAddress,
        uint x,
        uint y
    ) public override {
        require(ownerOf(_tokenId) == _ownerAddress, "not allowed to update");
        Location memory location;
        location.x = x;
        location.y = y;
        shipLocation[_tokenId] = location;
    }

    /**
        TOOD: secure, only allow calls from PlayerContract
     */
    function mint(address player) public override returns (uint256) {
        tokenId.increment();

        uint256 newItemId = tokenId.current();
        _mint(player, newItemId);

        return newItemId;
    }
}