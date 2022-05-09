//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract StepCounter {
    struct Player {
        uint stepCount;
        uint lastQueried;
        }
    mapping (address => Player) playerSteps;
    event NewPlayer(address userAddr);
    event ActionTaken(address userAddr);
    
    constructor() {

    }

    function addPlayer(address _userAddr, uint _startingSteps, uint _timeQueried) public {
        Player memory newPlayer;
        newPlayer = Player(_startingSteps, _timeQueried);
        playerSteps[_userAddr] = newPlayer;
        emit NewPlayer(_userAddr);
    }

    function updateSteps(address _userAddr, uint _stepChange, uint _timeQueried) public {
        playerSteps[_userAddr].stepCount += _stepChange;
        playerSteps[_userAddr].lastQueried = _timeQueried;
    }

    function takeAction(address _userAddr, uint _stepsRqd) public {
        require(playerSteps[_userAddr].stepCount >= _stepsRqd);
        playerSteps[_userAddr].stepCount = playerSteps[_userAddr].stepCount - _stepsRqd;
        emit ActionTaken(_userAddr);
    }

    function getStepCount(address _userAddr) public view returns(uint) {
        return playerSteps[_userAddr].stepCount;
    }

    function checkLastQuery(address _userAddr) public view returns(uint) {
        return playerSteps[_userAddr].lastQueried;
    }
}
