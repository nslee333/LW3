// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Exchange is ERC20 {

    
    address public cryptoDevTokenAddress;
    

    constructor(address _cryptoDevToken) {
        require(_cryptoDevToken != address(0), "Token address passed is a null address");
        cryptoDevTokenAddress = _cryptoDevToken; 
    }
    // Constructor that takes in the address of the cryptoDevToken contract, checks and makes sure that it is not a null address, then assigns cryptoDevTokenAddress to the passed in
    // address.

    function getReserve() public view returns (uint) {
        return ERC20(cryptoDevTokenAddress).balanceOf(address(this));
    }
    // This function gets and returns the balance of the the crypto dev tokens contract.

    function addLiquidity(uint _amount) public payable returns (uint) {
        uint liquidity;
        uint ethBalance = address(this).balance;
        uint cryptoDevTokenReserve = getReserve();
        ERC20 cryptoDevToken = ERC20(cryptoDevTokenAddress);
        
        
        if(cryptoDevTokenReserve == 0) {

            cryptoDevToken.transferFrom(msg.sender, address(this), _amount);

            liquidity = ethBalance;
            _mint(msg.sender, liquidity);
        // If this is the initial adding of funds, then it transfer the funds, then it mints the amount of LP tokens that is the exact same as the amount of eth deposiited.
        } else {
            uint ethReserve = ethBalance - msg.value;

            uint cryptoDevTokenAmount = (msg.value * cryptoDevTokenReserve)/(ethReserve); // Come back to this later. 
            require(_amount >= cryptoDevTokenAmount, "Amount Of tokens sent is less than the minimum tokens required."); 
            cryptoDevToken.transferFrom(msg.sender, address(this), cryptoDevTokenAmount);
            liquidity = (totalSupply() * msg.value/ ethReserve)/ ethReserve;
            _mint(msg.sender, liquidity);
        } 
        // Else, Check that the amount of ether sent is correct, and then transfer the ether, then mint LP tokens according to the liquidity provided.
        return liquidity;
    }

    function removeLiquidity(uint _amount) public returns (uint, uint) {
        require(_amount > 0, "_amount should be greater than 0");
        uint ethReserve = address(this).balance;
        uint _totalSupply = totalSupply();

        uint ethAmount = (ethReserve * _amount)/ _totalSupply;

        uint cryptoDevTokenAmount = (getReserve() * _amount)/ _totalSupply;

        _burn(msg.sender, _amount);
        payable(msg.sender).transfer(ethAmount);
        ERC20(cryptoDevTokenAddress).transfer(msg.sender, cryptoDevTokenAmount);
        return (ethAmount, cryptoDevTokenAmount);
    }



}