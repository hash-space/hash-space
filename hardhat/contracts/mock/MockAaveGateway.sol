//SPDX-License-Identifier: Unlicense

pragma solidity >=0.8.0 <0.9.0;

import "../interfaces/IAaveGateway.sol";

contract MockAaveGateway is IAaveGateway {

    function withdrawETH(
        address _pool,
        uint _amount,
        address _to
    ) external override {}

    function depositETH(
        address _pool,
        address _onBehalfOf,
        uint16 _referralCode
    ) external override payable {}
}