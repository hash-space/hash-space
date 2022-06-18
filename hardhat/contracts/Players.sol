//SPDX-License-Identifier: Unlicense

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IPlanet.sol";
import "./interfaces/IWorld.sol";
import "./interfaces/IHashVault.sol";

contract Players is Ownable {
    using Counters for Counters.Counter;

    uint256 constant public NFTPRICE = 0.01 ether;

    struct PersonProfile {
            uint256 playerId;
            uint256 timeJoined;
            uint256 lastQueried;
            uint256 stepsAvailable;
            uint256 totalStepsTaken;
            uint256 amountEarned;
    }

    Counters.Counter indexPlayerIds;
    Counters.Counter public indexStartingPosition;
    address backendAddress;

    mapping (address => PersonProfile) public players;

    IPlanet nftContract;
    IWorld worldContract;
    IHashVault aaveVaultContract;

    event TreasuryFunded(uint amountFunded);

    event StepsAdded(uint stepsTaken, address player, uint timestamp);

    event PlanetConquer(address player, uint amount, uint planetType);


    constructor () {
    }

    /**
        The address of our web2 backend.
        Messages from the backend which are verified in this contract
     */
    function setBackendAddress(address _address) public onlyOwner {
        backendAddress = _address;
    }

    /**
        We set the Nft Contract, this can also be done in the constructor
     */
    function setNftAddress(address _nftContractAddress) public onlyOwner {
        nftContract = IPlanet(_nftContractAddress);
    }

    /**
        We set the Worldcontract Contract, this can also be done in the constructor
     */
    function setWorldAddress(address _worldAddress) public onlyOwner {
        worldContract = IWorld(_worldAddress);
    }

    /**
        We set the Worldcontract Contract, this can also be done in the constructor
     */
    function setAaveVault(address _address) public onlyOwner {
        aaveVaultContract = IHashVault(_address);
    }

    /**
        Creates the user profile of the user and mints a starship nft
        and forwards $$ to the treasury
     */
    function registerProfile(string memory _tokenURI) public payable
     {
        _createProfile();

        require(msg.value == NFTPRICE, "Not enought/too much ether sent");

        // put coins to work in vault
        aaveVaultContract.deposit{value: msg.value}();

        // mint ship
        uint256 shipId = nftContract.mint(msg.sender, _tokenURI);
        (uint startingX, uint startingY) = determineStartingPosition();
        nftContract.setLocation(shipId, msg.sender, startingX, startingY);
    }

    function _createProfile() private {
        PersonProfile storage player = players[msg.sender];
        require(player.playerId == 0, "you already signed up");
        indexPlayerIds.increment();
        player.playerId = indexPlayerIds.current();
        player.timeJoined = block.timestamp;
        player.lastQueried = block.timestamp - (60*60*12); // give the user 12 hour window, so that he does not sign up with zero steps
        player.stepsAvailable = 0;
        player.totalStepsTaken = 0;
        player.amountEarned = 0;
    }

    /**
        Sync the steps for the user
    */
    function syncSteps(bytes32 _hashedMessageBackend, uint256 _steps, uint256 _lastQueried, uint8 _v, bytes32 _r, bytes32 _s) public {
        // verify
        PersonProfile storage player = players[msg.sender];
        require(player.playerId != 0, "you need to be registered");

        require(_lastQueried == player.lastQueried, "last queried does not match");
        verifySteps(_hashedMessageBackend, _steps, _lastQueried, _v, _r, _s);

        // write
        player.totalStepsTaken += _steps;
        player.stepsAvailable += _steps;
        player.lastQueried = block.timestamp;
        emit StepsAdded(_steps, msg.sender, block.timestamp);
    }

    function verifySteps(bytes32 _hashedMessageBackend, uint256 _message, uint256 _lastQueried, uint8 _v, bytes32 _r, bytes32 _s) public view {

        bytes32 hashedMessageSol = keccak256(abi.encode(_message, _lastQueried));
        require(hashedMessageSol == _hashedMessageBackend, "payload was modified");

        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 prefixedHashMessage = keccak256(abi.encodePacked(prefix, _hashedMessageBackend));
        address signer = ecrecover(prefixedHashMessage, _v, _r, _s);

        require(signer == address(backendAddress), "wrong signer");
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
        SharedStructs.Planet memory planet = worldContract.getPlanet(_planetId);

        if (x == planet.xCoord && y == planet.yCoord) {
            _payout(planet.planetType);
        }
    }

    function _payout(uint planetType) internal {
        // route to vaults
        if (planetType == 1) {
            uint yield = aaveVaultContract.yield();

            if (yield > 0) {
                aaveVaultContract.withdraw(msg.sender);
                players[msg.sender].amountEarned += yield;
                emit PlanetConquer(msg.sender, yield, planetType);
            }
        }
        emit PlanetConquer(msg.sender, 0, planetType);
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
}