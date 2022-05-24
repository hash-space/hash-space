//SPDX-License-Identifier: Unlicense

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/IPlanet.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IWorld.sol";
import "hardhat/console.sol";

contract Players is Ownable {
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

    event TreasuryFunded(uint amountFunded);

    constructor () {
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
    function moveShip(uint x, uint y, uint _planetId, uint _shipId, uint _worldId) public payable {

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

        // check if we landed on a planet
        (uint xCoordPlanet, uint yCoordPlanet) = worldContract.getLocation(_worldId, _planetId);

        // TODO: review conditional function, as doesn't appear to execute properly
        // if (xCoordShip == xCoordPlanet && yCoordShip == yCoordPlanet) {

        console.log("Starship has landed on a planet");

        // Check whether any yield available
        uint balance = address(this).balance;
        uint reward = 0.01 ether;
        // TODO: consider moving reward specification into move ship function call

        // TODO: add randomness to whether somebody gets the reward

        require(balance > reward, "There's no remaining token to withdraw.");

        // User withdraws tokens
        (bool sent,) = msg.sender.call{value: reward}("");
        require(sent, "Failed to withdraw token");

        // TODO: update amount for withdrawal away from hard-coded amount
        // }
    }

    function fundTreasury() public payable {
        emit TreasuryFunded(msg.value);
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

    function checkContractBalance() public view returns (uint) {
        uint contractBalance = address(this).balance;
        return contractBalance;
    }

}