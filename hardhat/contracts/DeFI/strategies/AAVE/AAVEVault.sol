// SPDX-License-Identifier: AGPL-3.0
// credits : @storm0x yearn team
pragma solidity ^0.8.12;
import {SafeERC20,    SafeMath,    IERC20,    Address}  from  "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import "../../interfaces/Uniswap/IUniswapRouter.sol";
import "../../interfaces/AAVE/IAave.sol";


/********************
 *
 *  POC for trading with simple lending and borrowing strategy on AAVE-V2. 
 * refered from https://github.com/AngleProtocol/angle-core/blob/main/contracts/genericLender/GenericAave.sol
 ********************* */
contract AAVEVault is Ownable {

    using SafeERC20 for IERC20;
    using Address for address;
    /*//////////////////////////////////////////////////////////////
                                 STRUCTURE
    //////////////////////////////////////////////////////////////*/
    // storing the balance of  the staked yield by the planets to be recovered by the users during withdraw.
    struct PlanetStakeBalance  {
        uint DelegationAToken;
        uint AToken;
    }
    // storing the tokens corresponding  to the base
    struct tokens {
        address AToken;
        address stableDebtToken;
    }
    // for storing reference interfaces
    struct AaveReferences {
    IAToken aToken;
    IProtocolDataProvider protocolDataProvider;
    IStakedAave stkAave;
    IStableDebtToken stableDebtToken;
    }
    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    event StartShare(
        address indexed receiver,
        address indexed donator,
        uint256 amount
    );

    event StopShare(address indexed donator, uint256 amountReturned);

    event Claimed(
        address indexed receiver,
        address indexed donator,
        uint256 claimed,
        uint256 newShareAmount
    );

    /*//////////////////////////////////////////////////////////////
                         METADATA STORAGE/LOGIC
    //////////////////////////////////////////////////////////////*/
    IPool public aavePool;
    IUniswapV3Router public immutable uniswapV3Router;
    // Used to get the `want` price of the AAVE token
    IUniswapV2Router public immutable uniswapV2Router;

    IAToken public immutable aToken;
    IProtocolDataProvider public immutable protocolDataProvider;
    IStakedAave public immutable stkAave;
    address public immutable aave;
    address public immutable UniV3Router;
    address public immutable UniV2Router;

    // aave specific strategy parameters.
    bytes public path;
    bool public isIncentivised;
    uint16 internal _customReferral;
    
    
    mapping(address => tokens) tokenAssetAddress; // indexes the storage of the ERC20 token and its corresponding shares address. 
    mapping(address => UserStake) userStake;
    //IERC20 public token;
    uint256 internal constant _SECONDS_IN_YEAR = 365 days;
    //  aave V3 poolAddress on polygon mainnet 
    address PoolAddress = '0x794a61358D6845594F94dc1DB02A252b5b4814aD';

    mapping(address => uint256) public shipsInvestments; // address of the players  shares receives  
    mapping(address => PlanetStakeBalance) public shareTokenBalances; // getting the player  their derivative tokens invested.
    mapping(address => address) public donatorToReceiver; // mapping to the ships to the Pool 
    mapping(address => mapping(address => bool)) public receiverToDonator; // bool for check whether yield has deposited  to the planet by the given strategy.
    uint256 public dust = 1e15;


    /****
    define the initial asset class  for ERC20 
     */
    constructor( address _token, address UniV3Router , address UniV2Router ) {
        
        Atoken = IERC20(_token);
        token.approve(address(PoolAddress), type(uint256).max);
        aavePool = IPool(PoolAddress);

    }

   
    // function for adding new addresses of shares for underlying tokens .
    function addAddresses(tokens calldata _tokens , address _erc20Address, address aToken , address stableDebtToken)  external onlyOwner {
        tokenAssetAddress[_erc20Address].ATokens = aToken;
        tokenAssetAddress[_erc20Address].stableDebtToken = stableDebtToken;
    }  


   
    /**
   @dev  deposits into the  aave pool to receive the aToken of the corresponding asset in order to receive yield;
     */
    function deposit(address receiver, uint256 amount , address asset)
        public
        returns (uint256 shares)
    {   
        require(receiver != address(0), "ADDRESS_NOT_ZERO");
        require(receiver != msg.sender, "SELF_SHARE");
        require(amount > 0, "AMT_NOT_ZERO");
        require(donatorToReceiver[msg.sender] == address(0), "DONATOR_NOT_SET");
     
        SafeERC20.safeTransferFrom(token, msg.sender, address(this), amount);

        aavePool.deposit(asset, amount, msg.sender, 0);

        shares = amount;

        // providing 1:1 generating for each deposited , accounting the aTokens received.
        shipsInvestments[msg.sender] += amount;

        aTokenBalances[msg.sender] += shares;

        // donator can only have one receiver for yield and can switch it here
        donatorToReceiver[msg.sender] = PoolAddress;
        receiverToDonator[PoolAddress][msg.sender] = true;


        emit StartShare(msg.sender, PoolAddress, amount);
    }


    /******
    getting more information about player reserve in AAVE.

     */
    function getUserInvestmentParameter(address _shipAddress) 
    external 
    returns(
      uint256 totalCollateralBase,
      uint256 totalDebtBase,
      uint256 availableBorrowsBase,
      uint256 currentLiquidationThreshold
     
    ) {
  (totalCollateralBase, totalDebtBase, availableBorrowsBase, currentLiquidationThreshold) = aavePool.getUserAccountData(_shipAddress);
   
    }
   
    function stopSharingYield() public returns (uint256 amount) {
        uint256 _shares = aTokenBalances[msg.sender];
        uint256 _tokenBalance = shipsInvestments[msg.sender];
        require(_shares > 0, "NO_SHARES");
        require(_tokenBalance > 0, "NO_TOKEN");
        // TODO: add emergency exit to withdraw and realize loss in case it happens
        require(amount >= _tokenBalance, "LOSS");
        uint totalYield  = aavePool.withdraw(msg.sender, _tokenBalance,msg.sender);

        aTokenBalances[msg.sender] = 0;
        shipsInvestments[msg.sender] = 0;
        address _receiver = donatorToReceiver[msg.sender];
        donatorToReceiver[msg.sender] = address(0);
        receiverToDonator[_receiver][msg.sender] = false;

        emit StopShare(msg.sender, totalYield);       
    }


    function claimYield(address _donator) public returns (uint256 claimed) {
        require(donatorToReceiver[_donator] == msg.sender, "NOT_RECEIVER");
        // NOTE: checks in startSharingYield ensure these values are not zero
        uint256 _shares = aTokenBalances[_donator];
        uint256 _tokenBalance = shipsInvestments[_donator];

        // NOTE: we add dust thresold to assure precision
        require(
            vault.convertToAssets(_shares) > _tokenBalance + dust,
            "NO_YIELD"
        );

        uint256 _remainingShares = vault.convertToShares(_tokenBalance + dust);
        require(_shares > _remainingShares, "LOSS");

        uint256 _sharesToClaim = _shares - _remainingShares;

        aTokenBalances[_donator] = _remainingShares;
        claimed = aavePool.withdraw(PoolAddress, amount, to);
    //    claimed = vault.redeem(_sharesToClaim, msg.sender, address(this));
        // NOTE: ensure donator still has deposited capital after side effect
        require(
            vault.convertToAssets(_remainingShares) >= _tokenBalance,
            "CLAIM_EXCEED"
        );

        emit Claimed(msg.sender, _donator, claimed, _remainingShares);
    }

    function claimable(address _donator, address _receiver)
        external
        view
        returns (uint256 amount)
    {
        if (donatorToReceiver[_donator] != _receiver) return 0;

        // NOTE: checks in startSharingYield ensure these values are not zero
        uint256 _shares = aTokenBalances[_donator];
        uint256 _tokenBalance = shipsInvestments[_donator];
        if (_shares == 0 || _tokenBalance == 0) return 0;

        // NOTE: we add dust thresold to assure precision
        if (vault.convertToAssets(_shares) < _tokenBalance + dust) return 0;

        uint256 _remainingShares = vault.convertToShares(_tokenBalance + dust);
        if (_shares <= _remainingShares) return 0;

        uint256 _sharesToClaim = _shares - _remainingShares;

        amount = vault.previewRedeem(_sharesToClaim);
    }
}