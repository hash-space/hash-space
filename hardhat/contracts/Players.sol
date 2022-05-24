//SPDX-License-Identifier: Unlicense

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/IPlanet.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IWorld.sol";

// for generating the tellor RNG 
// credits https://github.com/nkrishang/Tellor_RNG.
import "./oracle/contracts/UsingTellor.sol"; 
import "./interfaces/IAutopay.sol";


contract Players is UsingTellor ,Ownable {
    using Counters for Counters.Counter;

    uint256 constant public NFTPRICE = 0.01 ether;

    struct PersonProfile {
            uint256 playerId;
            uint256 timeJoined;
            uint256 lastQueried;
            uint256 stepsAvailable;
            uint256 totalStepsTaken;
    }

    Counters.Counter indexPlayerIds;
    Counters.Counter public indexStartingPosition;

    mapping (address => PersonProfile) public players;

    IPlanet nftContract;
    IWorld worldContract;
    IAutopay public autopay;
    IERC20 public tellorToken;
    // amount for paying oracle per query ( but before need to insure the  tokens are minted).
    uint256 public tipAmount;

    address payable _Tellor;

      /**
    address needed for the tellor contract on polygon , check out here: https://docs.tellor.io/tellor/integration/reference  .
    address payable _tellor //oracle address
    address _autopay ,  
    address _tellorToken
    ,uint256 _tipAmount
    
    tellorToken address are : 
    polygon mainnet: 0xE3322702BEdaaEd36CdDAb233360B939775ae5f1
mumbai: 0x45cAF1aae42BA5565EC92362896cc8e0d55a2126
     */


    constructor ( address payable _tellor, address _autopay , address _tellorToken ,uint256 _tipAmount) UsingTellor(_Tellor)    {
    autopay = IAutopay(_autopay);
    tellorToken = IERC20(_tellorToken);
    tipAmount = _tipAmount;
    _Tellor = _tellor ; 
    }

    /**
        We set the Nft Contract, this can also be done in the constructor
     */
    function setNftAddress(address _nftContractAddress) public {
        nftContract = IPlanet(_nftContractAddress);
    }

    /**
        We set the Worldcontract Contract, this can also be done in the constructor
     */
    function setWorldAddress(address _worldAddress) public {
        worldContract = IWorld(_worldAddress);
    }

    /**
        Creates the user profile of the user and mints a starship nft
        and forwards $$ to the treasury
     */
    function registerProfile(string memory _tokenURI) public payable
     {
        PersonProfile storage player = players[msg.sender];
        require(player.playerId == 0, "you already signed up");
        indexPlayerIds.increment();
        player.playerId = indexPlayerIds.current();
        player.timeJoined = block.timestamp;
        player.lastQueried = block.timestamp - (60*60*12); // give the user 12 hour window, so that he does not sign up with zero steps
        player.stepsAvailable = 0;
        player.totalStepsTaken = 0;

        // buying the nft TODO: send money to treasury. Implemented in withdraw function
        require(msg.value == NFTPRICE, "Not enought/too much ether sent");
        uint256 shipId = nftContract.mint(msg.sender, _tokenURI);
        (uint startingX, uint startingY) = determineStartingPosition();
        nftContract.setLocation(shipId, msg.sender, startingX, startingY);
    }

    /**
        Sync the steps for the user
    */
    function syncSteps(uint steps) public {
        PersonProfile storage player = players[msg.sender];
        require(player.playerId != 0, "you need to be registered");
        player.totalStepsTaken += steps;
        player.stepsAvailable += steps;
        player.lastQueried = block.timestamp;
    }

    /**
        Move the ship to a new position
        {_planetId} the planet you want to reach
        {_shipId} the ship you are moving
     */
    function moveShip(uint x, uint y, uint _planetId, uint _shipId, uint _worldId) public {

        // current location of the ship
        (uint xCoordShip, uint yCoordShip) = nftContract.getLocation(_shipId);

        // calculate distance moved
        uint travelX = get_abs_diff(xCoordShip, x);
        uint travelY = get_abs_diff(yCoordShip, y);
        uint travelDistance = uint(sqrt((travelX * travelX) + (travelY * travelY)));

        // check enough steps available
        require(players[msg.sender].stepsAvailable > travelDistance * 10, "Not enough steps available to move there");

        // update steps of user
        players[msg.sender].stepsAvailable -= travelDistance * 10;

        // update ship position
        nftContract.setLocation(_shipId, msg.sender, x, y);

        // check if we hit the jackpot
        (uint xCoordPlanet, uint yCoordPlanet) = worldContract.getLocation(_worldId, _planetId);
        if (xCoordShip == xCoordPlanet && yCoordShip == yCoordPlanet) {
            // you hit the planet
            // TODO: forward to vault contract
        }
    }

    function get_abs_diff(uint val1, uint val2) private pure returns (uint) {
        return val1 > val2 ? val1 - val2 : val2 - val1;
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

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ether left to withdraw");

        (bool success, ) = payable(owner()).call{value: balance}("");

        require(success, "Transfer failed.");
    }

    function determineStartingPosition() public returns(uint x, uint y) {

        indexStartingPosition.increment();
        uint positionIndex = indexStartingPosition.current();

        uint startingX = positionIndex * 42;
        uint startingY = 16;

        if (positionIndex == 46) {
            indexStartingPosition.reset();
        }

        return (startingX, startingY);
    }
    /**
    rnadom number generation for determining the rpositions 
    @dev here we determining the further randomness for all other players by using player address as input salt to the timestamp 
     */

    function _retrieveRandomNumber(uint256 _timestamp )  internal view returns(uint256) {

        bytes32  random = bytes32(uint256(uint160(msg.sender)) << 96);
        bytes memory _queryData = abi.encode("TellorRNG", abi.encode(_timestamp), random);
        bytes32 _queryId = keccak256(_queryData);
        bytes memory _randomNumberBytes;
      //  (, _randomNumberBytes, ) = getDataBefore(_queryId, block.timestamp - 5 minutes);
        uint256 _randomNumber = abi.decode(_randomNumberBytes, (uint256));
        return _randomNumber;
    }


    /** TODO:  currently can be used as setting the initial positions also
    sets the spaceShips position randomly into other planet if passed through an wormwhole ;)  
     */

    function Teleport(uint shipId) public  returns(uint256 newX,uint256 newY) {
        newX = _retrieveRandomNumber(block.timestamp);
        newY = _retrieveRandomNumber(block.timestamp);
         nftContract.setLocation(shipId, msg.sender, newX, newY);
    } 


}
