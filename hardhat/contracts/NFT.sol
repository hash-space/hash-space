//SPDX-License-Identifier: Unlicense

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./interfaces/IPlanet.sol";
import "./ERC721TradableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";


contract Starship is  OwnableUpgradeable, ERC721TradableUpgradeable, 
ERC721URIStorageUpgradeable, IPlanet{
    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter public tokenId;

    struct ShipData {
            uint x;
            uint y;
            address owner;
            uint id;
    }

    address public playerContract;

    // mapping tokenId to shipData
    mapping (uint256 => ShipData) shipData;

    modifier onlyPlayerContract() {
        require (msg.sender == playerContract);
        _;
    }
    

    function initialize(address _proxyRegistryAddress) public initializer {
        __Context_init_unchained();
        __ERC165_init_unchained();
        ERC721TradableUpgradeable.initialize("StarShip", "SHIP", _proxyRegistryAddress); 
    }
    

    function getLocation(
        uint256 _tokenId
    ) public override view returns (uint x, uint y) {
         ShipData memory location = shipData[_tokenId];
         return (location.x, location.y);
    }

    function _msgSender() internal override(ContextUpgradeable, ERC721TradableUpgradeable) view returns (address sender)
    {
        return super.msgSender();
    }


    function isApprovedForAll(address owner, address operator) override(ERC721Upgradeable, ERC721TradableUpgradeable) public view returns (bool){
        return super.isApprovedForAll(owner, operator);
    }

    function baseTokenURI() override(ERC721TradableUpgradeable) public pure returns (string memory){
        return "ipfs://";
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
        shipData[_tokenId].x = x;
        shipData[_tokenId].y = y;
    }

    function setPlayerContract(address _newPlayerContract) public onlyOwner {
        playerContract = _newPlayerContract;
    }

    function mint(address player, string memory _tokenURI) public onlyPlayerContract override returns (uint256) {
        tokenId.increment();

        uint256 newItemId = tokenId.current();
        _mint(player, newItemId);
        _setTokenURI(newItemId, _tokenURI);

        return newItemId;
    }

    /**
        Returns all ships in the game
     */
    function getShips() public view returns(ShipData[] memory) {
        uint tokenCount = tokenId.current() + 1;
        ShipData[] memory ships = new ShipData[](tokenCount);
        for (uint j = 0; j < tokenCount; j++) {
            ShipData memory ship = shipData[j];
            ships[j] = ship;
        }
        return ships;
    }

    /**
        To allow transfer of ships
     */
    function _afterTokenTransfer(address from,address to,uint256 tokenId) internal override {
        shipData[tokenId].owner = to;
        shipData[tokenId].id = tokenId;
    }

            function _burn(uint256 tokenId) internal override(ERC721URIStorageUpgradeable, ERC721Upgradeable)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721TradableUpgradeable, ERC721URIStorageUpgradeable) returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}