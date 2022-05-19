pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/IPlanet.sol";
import "./interfaces/IWorld.sol";


contract Players {
    using Counters for Counters.Counter;

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
    function registerProfile() public
     {
        PersonProfile storage player = players[msg.sender];
        require(player.playerId == 0, "you already signed up");
        indexPlayerIds.increment();
        player.playerId = indexPlayerIds.current();
        player.timeJoined = block.timestamp;
        player.lastQueried = block.timestamp - (60*60*12); // give the user 12 hour window, so that he does not sign up with zero steps
        player.stepsAvailable = 0;
        player.totalStepsTaken = 0;

        // buying the nft TODO: send money to treasury
        uint256 shipId = nftContract.mint(msg.sender);
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

    function determineStartingPosition() public returns(uint x, uint y) {

        indexStartingPosition.increment();
        uint positionIndex = indexStartingPosition.current();

        uint startingX = positionIndex % 10;
        uint startingY = (positionIndex / 10) + 1;

        if (positionIndex == 100) {
            indexStartingPosition.reset();
        }

        return (startingX, startingY);
    }

    function incrementPositionCounter() public {
        indexStartingPosition.increment();
    }
}
