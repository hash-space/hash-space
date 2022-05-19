//SPDX-License-Identifier: Unlicense

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StarToken is ERC20, Ownable {

    constructor() ERC20("Star Token", "STR"){
        issueToken();
    }

        function issueToken() public onlyOwner{
        _mint(msg.sender, 1000*10**18);
    }
}