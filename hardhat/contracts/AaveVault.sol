//SPDX-License-Identifier: Unlicense

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./interfaces/IAaveGateway.sol";

contract AaveVault is Ownable, ReentrancyGuard {

    /**
        A-Pol token in aave Aave Polygon (aPolWM...)
    */
    address ASSET;
    /**
        Aave deposit gateway converts native ETH, MATIC to wrapped tokens
        it also forwards calls to the pool contract
     */
    address GATEWAY;
    /**
        The Aave lending pool we deposit the assets to
     */
    address POOL = 0x6C9fB0D5bD9429eb9Cd96B85B81d872281771E6B;
    uint256 MAX_INT = 2**256 - 1;

    /**
        The total amount we deposited into the pool
     */
    uint256 public amountDeposited = 0;

    function initialize(address _gateway, address _asset, address _pool) public onlyOwner {
        GATEWAY = _gateway;
        ASSET = _asset;
        POOL = _pool;
        IERC20(ASSET).approve(GATEWAY, MAX_INT); // allow gateway to spend all our tokens to save gas on withdraw
    }

    /**
        Deposit $ into aave
     */
    function deposit() public payable nonReentrant {
       IAaveGateway(GATEWAY).depositETH{value: msg.value}(POOL, address(this), 0);
       amountDeposited += msg.value;
    }

    /**
        Withdraw only the yield from aave
     */
    function withdraw(address _receiver) public nonReentrant {
        IAaveGateway gatewayContract = IAaveGateway(GATEWAY);
        gatewayContract.withdrawETH(POOL, this.yield(), _receiver);
    }

    /**
        Emergency withdraw function
     */
    function withdrawEmergency() public onlyOwner {
        IAaveGateway gatewayContract = IAaveGateway(GATEWAY);
        gatewayContract.withdrawETH(POOL, MAX_INT, msg.sender);
        amountDeposited = 0;
    }

    /**
        Returns the total amount deposited in aave (inclusive yield)
     */
    function balance() public view returns(uint) {
        return IERC20(ASSET).balanceOf(address(this));
    }

    /**
        Returns how much yield we generated with aave
     */
    function yield() public view returns(uint) {
        // prevent overflow
        if (this.balance() <= amountDeposited) {
            return 0;
        }
        return this.balance() - amountDeposited;
    }

    /**
        Mark the contract as payment receiver for aave
     */
    fallback() external payable {}
    receive() external payable { }
}