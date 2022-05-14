pragma solidity ^0.8.9;
interface IPlayerProfile {



function registerPerson(uint256 _personID, address _userAddress) external ;

/// @dev updates the user position based on the frontend integration with the 
/// @param  playerID the identifier of the player 

function updateUserPosition(uint256 playerID, uint _stepChange , uint _timeQueried) external;




function getUserPosition() external returns(uint[2] memory);



function settleOnPlanet(uint playerID , uint planetId) external; 















}