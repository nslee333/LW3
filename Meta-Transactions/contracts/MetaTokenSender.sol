//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract RandomToken is ERC20 {
    constructor() ERC20("","") {}
    
    function freeMint(uint amount) public {
        _mint(msg.sender, amount);
    }
}

contract TokenSender {
    using ECDSA for bytes32;

    mapping(bytes32 => bool) executed; // This is used to make sure that the transaction only happens once, and that it isn't vulnerable to a replay signature attack.

    // We add the nonce to help keep every transaction unique, since our hasing algorithms are deterministic, we have to introduce an element of randomness to
    // make sure every transaction is unique.
    function transfer(address sender, uint amount, address recipient, address tokenContract, uint nonce, bytes memory signature) public {
        bytes32 messageHash = getHash(sender, amount, recipient, nonce, tokenContract); // calling the GetHash function defined below.
        bytes32 signedMessageHash = messageHash.toEthSignedMessageHash(); // This converts to an Ethereum signed hash, this is used for interoperability with EIP191.

        require(!executed[signedMessageHash], "Already Executed"); // Make sure that this signature hasn't already been executed.

        address signer = signedMessageHash.recover(signature); // This is the signed message hash

        require(signer == sender, "Signature does not come from sender");


        executed[signedMessageHash] = true; // Mark it as executed.
        bool sent = ERC20(tokenContract).transferFrom(sender, recipient, amount);
        require(sent, "Transfer Failed");
    }

    // This function takes in the below arguments, and ABI encodePacks them and then hashes those values, this is called by the transfer function.
    function getHash(address sender, uint amount, address recipient, unit nonce, address tokenContract) public pure returns (bytes32) { 
        return keccak256(abi.encodePacked(sender, amount, recipient, tokenContract));
    }
}