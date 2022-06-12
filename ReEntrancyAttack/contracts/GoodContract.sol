// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract GoodContract {

    mapping(address => uint) public balances; // Mapping of address and their balances.

    function addBalance() public payable {
        balances[msg.sender] += msg.value; // Add msg.vbalue to the msg.sender's balance of the balances mapping.
    }


    // Something to note about the withdraw(), is that the ETH is sent before the balance is updated.
    function withdraw() public {
        require(balances[msg.sender] > 0); // Require that msg.sender's balance is more than zero.
        (bool sent,) = msg.sender.call{value:balances[msg.sender]}(""); // This attempts to send the value of the balance to the sender, and assign it to a boolean
        // value if it suceeds or not. 
        require(sent, "Failed to send Ether"); //Require that 'sent' is equal to true.
        balances[msg.sender] = 0; // Balance of msg.sender = 0;
    }

}