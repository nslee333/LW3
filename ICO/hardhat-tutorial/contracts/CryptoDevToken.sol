// SPDX-license-Idenitifier: MIT

pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ICryptoDevs.sol";


contract CryptoDevTokenis ERC20, Ownable {

    ICryptoDevs CryptoDevsNFT; 
    uint256 public constant tokenPerNFT = 10 * 10**10;
    // _mint function from the OZ Erc20 contract takes a big number.
    
    mapping(uint256 => bool) public tokenIdsClaimed;

    constructor(address _cryptoDevsContract) ERC20("Crypto Dev Token", "CD") { // We're inputing the cryptoDevs contract for interface.
        CryptoDevsNFT = ICryptoDevs(_cryptoDevsContract);        
    }


    function claim() public {
        address sender = msg.sender;
        uint256 balance = CryptoDevsNFT.balanceOf(sender); 
        require(balance > 0; "You don't own any Crypto Dev NFT's);
        uint256 amount = 0;

        for(uint256 i = 0; i < balance; i++) {
            uint256 tokenId = CryptoDevsNFT.tokenOfOwnerByIndex(sender, i);
            if(!tokenIdsClaimed[tokenId]) {
                amount += 1;
                tokenIdsClaimed[tokenId] = true;

            }
        }
        require(amount > 0, "You have already claimed all of your tokens");

        _mint(msg.sender, amount * )

    }
}



