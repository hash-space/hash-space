pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./interface/IPlayerProfile.sol";

import "./interface/IAutopay.sol";

import "@openzeppelin/contracts/utils/Counters.sol";

import "@openzeppelin/contracts/access/AccessControl.sol";

import "usingtellor/contracts/UsingTellor.sol";

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "solidity-trigonometry/src/Trigonometry.sol";

import "./utils/types.sol";


import "./interface/IBasicMarketplaceRoyalties.sol";

contract PlayerProfile is  Counters , UsingTellor, safeMath {
    using index for Counters.counter;
    using Types for types;

    using Trigonometry for uint;

    address payable treasury; // this address will be paying for oracle fees.

    IAutopay  autopay; // address of tellor contract .
    IWorldMap  worldmap;
    IBasicMarketplaceRoyalties marketplace;


    uint256 public queryFees; 

    Types.PersonProfile User; //storing the details fo the structures  

    constructor( string memory name, string  memory symbol , address payable _tellor , address payable treasury , address _worldMap, address _marketplace)  UsingTellor(_tellor) {
        autopay = IAutopay(_autopay);
        tellorToken = IERC20(_tellorToken);
        worldMap = IWorldMap(_worldMap);
        marketplace = IBasicMarketplaceRoyalties(marketplace);
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

    function registerProfile( uint256 _personID, address _userAddress , address _nftAddress
    ) public returns(uint256)
     {
        User.personID = _user._personID;
        User.timeJoined = block.timestamp;
        User.lastQueried = block.timestamp;
        User.personalAccount = _userAddress;
        User.lastPx = mod(_retrieveRandomNumber(block.timestamp),worldMap.getDimensions[0]);
        User.lastPy = mod(_retrieveRandomNumber(block.timestamp),worldMap.getDimensions[1]);
        User.stepsTaken = 0;
        worldMap.addPlayers(_userAddress);
        // now buying the NFT contract. 
         marketplace.buyExactMatchNative(index);      
        index.increment();
    }


    
    /**
    checks during the  movement of the user spaceship , does it pass the given planet in the vicinity ?
     */
    function _checkAnyPlanet(uint planetId) internal returns(bool) {
            uint256 diffX = 0;
            uint256 diffY = 0;
            diffX = User.lastPx  -  getUserPosition()[0]; 
            diffY = User.lastPy - getUserPosition()[1];
            diffX > 0 ? diffX :  - diffX ;
            diffY > 0 ? diffY : - diffY;

            if(sqrt(pow(diffY,2) + pow(diffX,2)) <= )
            {

            }





                }


    /**
    sets the user position based on the movements (steps) taken and also in the direction (from horizontal) via the angle
    @notice currently for demo purpose we are taking the reference parameters.
     */
    function updateUserPosition(uint stepsTaken, uint angle  ) external  returns(uint[2]) {
      //require(_checkAnyPlanet(), "Passing already the planet ") (for now taking edge case of any planet passing in between the range)
      
     User.lastPx +=  sin(angle) * stepsTaken;
     User.lastPy += cos(angle) * stepsTaken;

    return(User.lastPx, User.lastPy);


    }

    function  getUserPosition() external returns(uint[2] memory ) {
        return(User.lastPx,User.lastPy);
    }




    function settleOnPlanet(uint playerID , uint planetId) external  {
    // check whether there is planet already occupied .   
    require(_checkAnyPlanet(planetId, playerID));

    // check whether the planet has already being esthablied by another player 







    }


function sqrt(uint y) internal pure returns (uint z) {
    if (y > 3) {
        z = y;
        uint x = y / 2 + 1;
        while (x < z) {
            z = x;
            x = (y / x + x) / 2;
        }
    } else if (y != 0) {
        z = 1;
    }
}







}
