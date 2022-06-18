// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract ReentrancyGuard {

    modifier nonReentrant() {
        require(!locked, "No re-Entrancy");
        locked = true;
        _;
        locked = false;
    }

}