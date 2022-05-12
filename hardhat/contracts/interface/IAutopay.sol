// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IAutopay {
    /**
     * @dev Function to pay for querying single amount of data
     * @param _queryId ID of tipped data
     * @param _amount amount to tip
     * @param _queryData the data used by reporters to fulfill the query
     */
    function tip(
        bytes32 _queryId,
        uint256 _amount,
        bytes calldata _queryData
    ) external;
}