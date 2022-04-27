// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract FakeNFTMarketplace {

    mapping(uint256 => address) public tokens;
    // Keeps track of the owner of the tokens.

    uint256 nftPrice = 0.01 ether;

    function purchase(uint256 _tokenId) external payable {
        require(msg.value == nftPrice, "This NFT costs 0.1 Ether");
        tokens[_tokenId] = msg.sender;
    }

    function getPrice() external view returns (uint256) {
        return nftPrice;
    }

    function available(uint256 _tokenId) external view returns (bool) {
        if (tokens[_tokenId] == address(0)) { // address(0) = 0x0000000000, This is the default value in solidity.
            return true;
        }
        return false;
    }
}