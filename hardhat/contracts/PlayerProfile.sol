pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interface/IPlayerProfile.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract PlayerProfile is IPlayerProfile , Counters{

    using index for Counters.counter;

        /**
interfaces with the underlying tokens 
defining the objects for interacting with the underlying token , token0 is generally gamefi token and underlyingToken ia token1.
i think eventually this will go to the treasury with the mapping of the rewards and strategies being invested by the users.
 */

    IERC20 token0;
    IERC20 token1;

    // these are the actions possible for the user to be tracked by the oracle from the sensor . 
    enum Actions {
        Running,
        Staying,
        Sleeping
    }
    struct PersonProfile {
        uint256 personID; // user integrating
        uint256 timeJoined;
        address payable personalAccount;
        incurredInterest _amount; // for determining the total interest incurred 
        mapping(uint256 => ActionsperDay) _actions;
    }

    struct ActionsPerDay {
        uint256 sourceTokens; // generally logs the operation amount which generates the tokens .
        uint256 SinkAmount; // this logs the operations for tjose that consume tokens
        Actions _actions; // determines the operations that user has done , and based on that we will be adding  the notion 
    }

    // its the amount staked / gained by the user from the vault.
    struct incurredInterest {
        uint256 amountStaked;
        uint256 stakingTimeperiod;
        uint apy; // not sure we will be needing here.
    }
    // information about the profiles.
    mapping(uint256 => PersonProfile) profiles;


    function registerProfile(
        uint256 _personID,
        address personalEOA
    ) public {
        require(msg.sender ==  personalEOA);
        profile[index].personID = _personID;
        profile[index].timeJoined = block.timestamp;
        profile[index].personalAccount = personalEOA;
        index.increment();
    }
    function registerInformation(uint256 index) public onlyOwner {



    }






}
