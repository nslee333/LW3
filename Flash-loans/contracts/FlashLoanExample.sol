//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.10;


import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FlashLoanExample is FlashLoanSimpleReceiverBase {

    using SafeMath for uint;

    event Log(address asset, uint val);

    constructor(IPoolAddressesProvider provider)
    public
    FlashLoanSimpleReceiverBase(provider)
    {}

    function createFlashLoan(address asset, uint amount) external {

        address receiver = address(this);

        bytes memory params = ""; // Blank memory

        uint16 referralCode = 0;

        // We initialized the POOL = iPOOL(address of the pool) in the FlashLoanSimpleReceiverBase.sol contract.
        // Then we can then call a POOL function flashLoanSimple for our use.
        POOL.flashLoanSimple( 
            receiver, // The account that receives the borrowed amount.
            asset, // The contract address of the asset we wish to borrow from,
            amount, // The amount to be borrowed.
            params, // Variadic packed params to pass to the receiver as extra information.
            referralCode // Referal code is used to register the integrator that originating the operation, (i.e. A middle man.) for potential rewards
            // Enter the code '0' if the action is directly executed by the user, and there is no middle man.
        );
    }

    function executeOperation( // This function is finishing up the flashLoan - it's telling the contract that it can take the loan back with a premium.
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external returns (bool){
        uint amountOwing = amount.add(premium);
        IERC20(asset).approve(address(POOL), amountOwing); // At this ERC20 Token Contract, allow spender (address(pool)) to spend the owner's tokens
        // msg.sender, of this amount. 
        emit Log (asset, amountOwing);
        return true;
    }
}
