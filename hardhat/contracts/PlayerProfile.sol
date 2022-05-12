pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./interface/IPlayerProfile.sol";

import "./interface/IAutopay.sol";

import "@openzeppelin/contracts/utils/Counters.sol";

import "@openzeppelin/contracts/access/AccessControl.sol";

import "usingtellor/contracts/UsingTellor.sol";

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./utils/types.sol";

contract PlayerProfile is  Counters , UsingTellor, safeMath {
    using index for Counters.counter;
    using Types for types;

    address payable treasury; // this address will be paying for oracle fees.

    IAutopay  autopay; // address of tellor contract .
    IWorldMap  worldmap;

    uint256 public queryFees; // setting fees for the payment of fees.

    Types.PersonProfile User; //storing the details fo the structures  

    constructor( string memory name, string  memory symbol , address payable _tellor , address payable treasury , address _worldMap)  UsingTellor(_tellor) {
        autopay = IAutopay(_autopay);
        tellorToken = IERC20(_tellorToken);
        worldMap = IWorldMap(_worldMap);
        tipAmount = _tipAmount;
        
    }
    function _retrieveRandomNumber(uint256 _timestamp) internal  view returns(uint256) {
    bytes memory _queryData = abi.encode("TellorRNG", abi.encode(_timestamp));
    bytes32 _queryId = keccak256(_queryData);
    bytes memory _randomNumberBytes;
    (, _randomNumberBytes, ) = getDataBefore(_queryId, block.timestamp - 10 minutes);
    uint256 _randomNumber = abi.decode(_randomNumberBytes, (uint256));
    return _randomNumber;
  }
 
    /**
    profile creation and issuance of the NFT .
     */

    function registerProfile( uint256 
    ) public returns(uint256)
     {
        User.personID = _user._personID;
        User.timeJoined = block.timestamp;
        User.lastQueried = block.timestamp;
        User.personalAccount = _user.personalEOA;
        User.lastPx = _retrieveRandomNumber(block.timestamp)
       worldMap.totalPlayers(index.increment());
    }


    /**
    checks during the  movement of the user spaceship , does it pass the given planet in the vicinity ?
     */
    function _checkAnyPlanet() internal returns(bool) {




    }








    function 




}
