pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/IPlanet.sol";

contract Starship is ERC721, IPlanet {
    using Counters for Counters.Counter;
    Counters.Counter public tokenId;

    struct ShipData {
            uint x;
            uint y;
            address owner;
    }

    // mapping tokenId to shipData
    mapping (uint256 => ShipData) shipData;

    constructor() ERC721("Startship", "SHIP") public {
    }

    function getLocation(
        uint256 _tokenId
    ) public override view returns (uint x, uint y) {
         ShipData memory location = shipData[_tokenId];
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
        ShipData memory location;
        location.x = x;
        location.y = y;
        location.owner = address(0);
        shipData[_tokenId] = location;
    }

    /**
        TODO: secure, only allow calls from PlayerContract
     */
    function mint(address player) public override returns (uint256) {
        tokenId.increment();

        uint256 newItemId = tokenId.current();
        _mint(player, newItemId);

        return newItemId;
    }

    /**
        Returns all ships in the game
     */
    function getShips() public view returns(ShipData[] memory) {
        ShipData[] memory ships = new ShipData[](tokenId.current());
        for (uint j = 1; j < tokenId.current(); j++) {
            ShipData memory ship = shipData[j];
            ships[j] = ship;
        }
        return ships;
    }

    /**
        To allow transfer of ships
     */
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        shipData[tokenId].owner = to;
    }
}