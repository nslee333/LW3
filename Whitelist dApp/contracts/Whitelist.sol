// SPDX-license-Idenitifer: MIT

pragma solidity ^0.8.0;

contract Whitelist {

    // Maximum number of addresses that can be whitelisted.
    uint8 public maxWhitelistedAddresses;


    // Current number of addresses whitelisted.
    uint8 public numAddressesWhitelisted;

    // Mappping of addresses, and if they've been whitelisted.

    mapping(address => bool) public whitelistedAddresses;


    constructor(uint8 _maxWhitelistedAddresses) {
        maxWhitelistedAddresses = _maxWhitelistedAddresses;
    }
}