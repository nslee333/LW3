const { expect, assert } = require("chai");
const { ethers, waffle, artifacts } = require("hardhat");
const { BigNumber } = require("ethers");
const hre = require("hardhat");
const {DAI, DAI_WHALE, POOL_ADDRESS_PROVIDER } = require("../config");

describe("Deploy a Flash Loan", function () { // The overall function declaration.
  it("Should take a flash loan and be able to return it", async function () {

    const flashLoanExample = await ethers.getContractFactory("FlashLoanExample");
    
    const _flashLoanExample = await flashLoanExample.deploy(POOL_ADDRESS_PROVIDER);

    await _flashLoanExample.deployed();
    
    const token = await ethers.getContractAt("IERC20", DAI); // This is creating an instance of the DAI contract with the 'getContractAt' hardhat-ethers helper function.

    const BALANCE_AMOUNT_DAI = ethers.utils.parseEther("2000"); 


    // So since we're forking the polygon mainnet in our local testing environment, Hardhat doesn't know the private key for the DAI_WHALE address, but it will act like we do have access to the 
    // addresses funds and sign transactions.
    // It will also have the same amount of tokens as the DAI_WHALE address on mainnet.

    await hre.network.provider.request({ 
      method: "hardhat_impersonateAccount",
      params: [DAI_WHALE],
    });

    const signer = await ethers.getSigner(DAI_WHALE); // Get the signer object of the dai_whale address.

    // .connect - Returns a new instance of the CF with the same interface and Bytecode, but with a different signer.
    // .transfer - // Allow the spender (FlashLoanExample contract) to spend x Amount (BALANCE_AMOUNT_DAI) from the owner's wallet (msg.sender)
    // This is called on the token Contract that we just instantiated. 
    // We do this because we need funds to execute the flash loan with a premium (since, In a real world example, we would be doing an arbitrage trade)

    console.log(DAI_WHALE);

    const test = async () => {
      try {

        await token
      .connect(signer) 
      .transfer(_flashLoanExample.address, BALANCE_AMOUNT_DAI); 

      } catch (error) {
        console.error(error)
      }

    };
      await test();







      // This is called on the token Contract that we just instantiated. 

    const tx = await _flashLoanExample.createFlashLoan(DAI, 1000); // Wait for this contract function call to be confirmed.

    await tx.wait(); // wait.

    const remainingBalance = await token.balanceOf(_flashLoanExample.address); // The remaining balance of the flash loan contract.

    expect(remainingBalance.lt(BALANCE_AMOUNT_DAI)).to.be.true; // Expect the remaining balance to be less than the BALANCE_AMOUNT_DAI. Because we expect the premium to be taken out.
    
  });
});
