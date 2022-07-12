//SPDX-License-Identifier: Unlicense

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "../interfaces/IAaveGateway.sol";
import "../interfaces/IHashVault.sol";

contract AaveVaultBase is Initializable {

}

contract AaveVault is OwnableUpgradeable, ReentrancyGuardUpgradeable, AaveVaultBase, IHashVault {

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
    address POOL;
    /**
        The address of the player contract
     */
    address PLAYER;

    /**
        The total amount we deposited into the pool
     */
    uint256 public amountDeposited;

   modifier onlyPlayerContract {
      require(msg.sender == PLAYER);
      _;
   }

    function initialize(
        address _gateway,
        address _asset,
        address _pool,
        address _player
    ) public initializer {
        GATEWAY = _gateway;
        ASSET = _asset;
        POOL = _pool;
        PLAYER = _player;
        amountDeposited = 0;
        IERC20(ASSET).approve(GATEWAY, type(uint256).max); // allow gateway to spend all our tokens to save gas on withdraw
        __Ownable_init_unchained();
    }

    /**
        Deposit $ into aave
        Everyone can deposit
     */
    function deposit() public payable override nonReentrant {
       IAaveGateway(GATEWAY).depositETH{value: msg.value}(POOL, address(this), 0);
       amountDeposited += msg.value;
    }

    /**
        Withdraw only the yield from aave
     */
    function withdraw(address _receiver) public override nonReentrant onlyPlayerContract {
        // TODO: withdraw coins to this contract first, then forward to receiver
        IAaveGateway(GATEWAY).withdrawETH(POOL, yield(), _receiver);
    }

    /**
        Emergency withdraw function
     */
    function withdrawEmergency() public onlyOwner {
        IAaveGateway(GATEWAY).withdrawETH(POOL, type(uint256).max, msg.sender);
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
    function yield() public override view returns(uint) {
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