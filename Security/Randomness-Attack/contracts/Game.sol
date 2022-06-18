//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

contract Game {
    constructor() payable {}

    function pickACard() private view returns(uint) { // 
        uint pickedCard = uint(keccak256(abi.encodePacked(blockhash(block.number), block.timestamp)));
        // This takes the current block number and block timestamp and then finds the hash value of those two, then encodes that value, then passes that value into
        // Then passes that encoded value into the keccak256 hash function, then assigns that value into _pickedCard variable.
        return pickedCard;
    }

    function guess(uint _guess) public { // If the user guesses the correct card, then the contract sends 0.1 ether to the user.
        uint _pickedCard = pickACard();
        if(_guess == _pickedCard) {
            (bool sent,) = msg.sender.call{value: 0.1 ether}("");
            require(sent, "Failed to send ether");
        }
    }

    function getBalance() view public returns(uint) { // Returns the balance of the contract.
        return address(this).balance;
    }
}