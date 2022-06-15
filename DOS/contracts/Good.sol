// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Good {
    address public currentWinner;
    uint public currentAuctionPrice;

    constructor() {
        currentWinner = msg.sender;
    }

    function setCurrentAuctionPrice() public payable { // This checks that the value sent with the function call is more than the current value,
    // Then attempts to send the ether back to the previous winner, if sucessfull, then new owner and auction price is set.
        require(msg.value > currentAuctionPrice, "Need to pay more than the currentAuctionPrice");
        (bool sent,) = currentWinner.call{value: currentAuctionPrice}(""); // This sends the ether back to the previous winner.
        if(sent) {
            currentAuctionPrice = msg.value;
            currentWinner =  msg.sender;
        }
    }

    function withdraw() public { // This function allows for previous winners to withdraw their amounts.
        require(msg.sender != currentWinner, "Current winner cannot withdraw");
        uint amount = balances[msg.sender];
        balances[msg.sender] = 0;

        (bool sent,) = msg.sender.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }
}