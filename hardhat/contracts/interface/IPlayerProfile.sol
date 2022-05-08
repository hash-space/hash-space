

interface IPlayerProfile {

/*

struct PersonProfile {
uint256 personID; // user integrating 
uint256 walkingStats; // generally logs the operation amount which generates the tokens .
uint256 utilisationStats; // this logs the operations for tjose that consume tokens 
uint256  timeJoined;
}

*/


/// @dev will be called by the wallet of the user having the sensor 
/// @param personID  the id of the user 
/// _



function registerPerson(uint256 personID) external ;

/// @dev for fetching the parameters from the given playerID  (which then fetches via querying the oracle). 
/// @param  playerID the identifier of the player 

function registerValues(uint256 playerID) external;





















}