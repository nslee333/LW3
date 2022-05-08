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
        return ERC20(cryptoDevTokenAddress).balanceOf(address(this)); // Goes to the mapping in the CryptoDevToken contract, and gets how much tokens this address owns.
    }

    function addLiquidity(uint _amount) public payable returns (uint) {
        uint liquidity; 
        uint ethBalance = address(this).balance;
        uint cryptoDevTokenReserve = getReserve();
        ERC20 cryptoDevToken = ERC20(cryptoDevTokenAddress); // ERC20 is a data type, and it's creating an instance of the address? not sure.
        
        
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

        // Summary, 
        return liquidity;
    }
    function removeLiquidity(uint _amount) public returns (uint, uint) { // _amount if LP tokens.
        require(_amount > 0, "_amount should be greater than 0");
        uint ethReserve = address(this).balance;
        uint _totalSupply = totalSupply();

        uint ethAmount = (ethReserve * _amount)/ _totalSupply; // Total supply of ether.

        uint cryptoDevTokenAmount = (getReserve() * _amount)/ _totalSupply; // What the amount is multiplied by dosen't matter, since the ratio is one to one.

        _burn(msg.sender, _amount); // burn LP tokens.
        payable(msg.sender).transfer(ethAmount); // Transfer the amount of ether to the user.
        ERC20(cryptoDevTokenAddress).transfer(msg.sender, cryptoDevTokenAmount); // Transfer the amount of CDTs to the user.
        return (ethAmount, cryptoDevTokenAmount); // Return the amount numbers (For display? WHY?)
    } 
    // This is withdrawing the liquidity from both sides - 

    function getAmountOfTokens(
        uint256 inputAmount, // Tokens that the user wants to buy, or already has bought
        uint256 inputReserve, // 
        uint256 outputReserve
    ) public pure returns (uint256) {
        require(inputReserve > 0 && outputReserve > 0, "Invalid Reserves");  // Check and make sure that there are reserves.

        uint256 inputAmountWithFee = inputAmount * 99; // Input * 99
        uint256 numerator = inputAmountWithFee * outputReserve; // numerator is the input with the fee times the output Reserve
        uint256 denominator = (inputReserve * 100) + inputAmountWithFee;
        return numerator / denominator;
    } // The basic math is that we multiply * 99 and then divide by 100 to get the amount with the 1% fee subtracted.
    // This is the formula Δy = (y*Δx)/(x + Δx); 
    // x = inputReserve, y = outputReserve.
    // The purpose of the function is to get the proper amount of tokens to be swapped, with the fee following the xy=k uniswap formula.
    // This function takes in the amount to be purchased, and both reserve amounts, checks to see if the reserves are more than zero, then 
    // Then subtracts the fee from the input amount, then 


    function ethToCryptoDevToken(uint _minTokens) public payable {
        uint256 tokenReserve = getReserve(); // Gets the amount of CDT tokens that this contract owns.
        uint256 tokensBought = getAmountOfTokens(
            msg.value,
            address(this).balance - msg.value,
            tokenReserve
        ); // Get the proper amount of tokens after the fee and following the xy=k formula. If 10 will return 9.80.

        require(tokensBought >= _minTokens, "Insufficient output amount"); // Make sure that the amount to be purcahsed is bigger than the minimum amount.
        ERC20(cryptoDevTokenAddress).transfer(msg.sender, tokensBought); 
    } // Swap function from eth to cdt.

    function CryptoDevTokenToEth(uint _tokensSold, uint _minEth) public {
        uint256 tokenReserve = getReserve();
        uint256 ethBought = getAmountOfTokens(
            _tokensSold,
            tokenReserve,
            address(this).balance
        );
        require(ethBought >= _minEth, "Insufficient output amount");
        ERC20(cryptoDevTokenAddress).transferFrom(
            msg.sender,
            address(this),
            _tokensSold
            ); 
    } // Swap function, from CDT to ETH.
}