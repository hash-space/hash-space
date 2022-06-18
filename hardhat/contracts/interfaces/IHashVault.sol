//SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0 <0.9.0;

interface IHashVault {
    function deposit() external payable;
    function withdraw(address _receiver) external;
    function yield() external view returns(uint);
}