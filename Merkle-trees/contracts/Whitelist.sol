//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract Whitelist {

    bytes32 public merkleRoot; // State variable.

    constructor(bytes32 _merkleRoot) { // During deployment, we pass in an argument for the merkle root, then the constructor assigns the value passed in to the
    // Start variable for merkleRoot.
        merkleRoot = _merkleRoot;
    }

    // This function checks if the user is in the whitelist. 
    // It takes in two arguments, one is the proof which is written to calldata?? and the maximum allowance to mint(probably set by the owner.)
    // It returns a boolean indicating if the user is in the whitelist.
    function checkIfInWhitelist(bytes32[] calldata proof, uint64 maxAllowanceToMint) view public returns (bool) {
        

        bytes32 leaf = keccak256(abi.encode(msg.sender, maxAllowanceToMint)); 
        // First we abi.encode the two arguments, (user, and how much they can mint.) 
        // Then we run that value through the keccak256 hash function, then we assign a variable to that hash value.

        bool verified = MerkleProof.verify(proof, merkleRoot, leaf); 
        // Then we pass in the proof (function argument), merkleRoot (state variable initialized at deployment), and the hash value of the leaf,
        // To the MerkleProof function, and we assign it to a variable to be returned to the website.

        return verified; // Return the boolean value.


    }



}




