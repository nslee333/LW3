// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;


// This is just a helper contract that has a function tha sets argument value as the state variable.
contract Helper {

    uint public num;

    function setNum(uint _num) public { 
        num = _num;
    }
}