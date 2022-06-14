//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

contract Good {

    address public helper; // The address of the helper contract.

    address public owner; // The contract owner's address.

    uint public num;

    constructor(address _helper) { // Constructor sets the helper contract to the address passed in.
        helper = _helper;
        owner = msg.sender;
    }

    function setNum(uint _num) public {
        helper.delegatecall(abi.encodeWithSignature("setNum(uint256)", _num));
    }   
}



