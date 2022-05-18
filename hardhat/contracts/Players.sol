//SPDX-License-Identifier: Unlicense

pragma solidity >=0.8.0 <0.9.0;
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/IPlanet.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract PlayerProfile is Ownable {
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

    mapping (address => PersonProfile) players;

    IPlanet nftContract;

    constructor () {
    }

    /**
        We set the Nft Contract, this can also be done in the constructor
     */
    function setNftAddress(address _nftContractAddress) public {
        nftContract = IPlanet(_nftContractAddress);
    }

    function registerProfile() public payable
     {
        PersonProfile storage player = players[msg.sender];
        require(player.playerId == 0, "you already signed up");
        indexPlayerIds.increment();
        player.playerId = indexPlayerIds.current();
        player.timeJoined = block.timestamp;
        player.lastQueried = block.timestamp;
        player.stepsAvailable = 0;
        player.totalStepsTaken = 0;

        // buying the nft TODO: send money to treasury. Implemented in withdraw function
        require(msg.value == NFTPRICE, "Not enought/too much ether sent");
        uint256 shipId = nftContract.mint(msg.sender);
        nftContract.setLocation(shipId, msg.sender, 10, 10); // TODO: place ship in landing zone
        // set the position of the ship
    }

    /**
        Sync the steps for the user
    */
    function syncSteps(uint steps) public {
        PersonProfile storage player = players[msg.sender];
        require(player.playerId != 0, "you need to be registered");
        player.totalStepsTaken += steps;
        player.stepsAvailable += steps;
    }

    /**
        Move the ship to a new position
        {planetId} the planet you want to reach
     */
    function moveShip(uint x, uint y, uint256 planetId, uint256 shipId) public {
        // check distance used + update steps of user


        // update ship position
        nftContract.setLocation(shipId, msg.sender, x, y);
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


}