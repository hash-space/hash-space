pragma solidity ^0.8.0;





interface IBasicMarketplaceRoyalties {
    
function royaltyInfo(uint256, uint256 value) external view  returns (address receiver, uint256 royaltyAmount);

function setNFTContract(address _nft) external ;

function supportsInterface(bytes4 interfaceId) external view  returns (bool);

function listNft(uint256 tokenId, uint256 price) external ;

function buyExactMatchNative(uint256 tokenId) external payable;

function getListing(uint256 tokenId) external view returns (bool exists);

}


