//SPDX-License-Identifier: Unlicense

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IPlanet.sol";
import "./ERC721Tradable.sol";

contract Starship is ERC721Tradable, IPlanet, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Location {
            uint x;
            uint y;
    }

    address public playerContract;


    mapping (uint256 => Location) shipLocation;

    modifier onlyPlayerContract(){
        require (msg.sender == playerContract);
        _;
    }

    constructor(_playerContract) ERC721("Startship", "SHIP") public {
        setPlayerContract(_playerContract);
    }

    function getLocation(
        uint256 _tokenId
    ) public override returns (uint x, uint y) {
         Location memory location = shipLocation[_tokenId];
         return (location.x, location.y);
    }

    /**
        secure, only allow calls from PlayerContract. DONE
     */
    function setLocation(
        uint256 _tokenId,
        address _ownerAddress,
        uint x,
        uint y
    ) public onlyPlayerContract override {
        require(ownerOf(_tokenId) == _ownerAddress, "not allowed to update");
        Location memory location;
        location.x = x;
        location.y = y;
        shipLocation[_tokenId] = location;
    }

    function setPlayerContract(address _newPlayerContract) public onlyOwner {
        playerContract = _newPlayerContract;
    }
    /**
        TOOD: secure, only allow calls from PlayerContract. DONE
     */
    function mint(address player) public onlyPlayerContract override returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(player, newItemId);

        return newItemId;
    }
}