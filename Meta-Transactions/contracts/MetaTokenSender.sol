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

    function transfer(address sender, uint amount, address recipient, address tokenContract, bytes memory signature) public {
        bytes32 messageHash = getHash(sender, amount, recipient, tokenContract); // calling the GetHash function defined below.
        bytes32 signedMessageHash = messageHash.toEthSignedMessageHash(); // This converts to an Ethereum signed hash, this is used for interoperability with EIP191.

        address signer = signedMessageHash.recover(signature); // This is the signed message hash

        require(signer == sender, "Signature does not come from sender");

        bool sent = ERC20(tokenContract).transferFrom(sender, recipient, amount);
        require(sent, "Transfer Failed");
    }

    // This function takes in the below arguments, and ABI encodePacks them and then hashes those values, this is called by the transfer function.
    function getHash(address sender, uint amount, address recipient, address tokenContract) public pure returns (bytes32) { 
        return keccak256(abi.encodePacked(sender, amount, recipient, tokenContract));
    }
}