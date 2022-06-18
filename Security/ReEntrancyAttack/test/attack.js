const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { parseEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

describe("Attack", function () {
  it("Should empty the balance of the good contract", async () => {

    const goodContract = await ethers.getContractFactory("GoodContract"); // Deploying the goodContract.
    const _goodContract = await goodContract.deploy();
    await _goodContract.deployed();

    const badContract = await ethers.getContractFactory("BadContract"); // Deploying the badContract.
    const _badContract = await badContract.deploy(_goodContract.address);
    await _badContract.deployed();

    const [_, innocentAddress, attackerAddress ] = await ethers.getSigners(); 

    let tx = await _goodContract.connect(innocentAddress).addBalance({ // Add balance to the good contract, from the innocentAddress user.
      value: parseEther("10"),
    })
    
    await tx.wait(); // wait for the transaction to complete.

    let balanceETH = await ethers.provider.getBalance(_goodContract.address);
    expect(balanceETH).to.equal(parseEther('10')); // Expect the balance of the good contract to be equal to 10.

    tx = await _badContract.connect(attackerAddress).attack({ // Call the attack function, 
      value: parseEther("1"),
    });

    await tx.wait(); // Wait for the attack.

    balanceETH = await ethers.provider.getBalance(_goodContract.address);
    expect(balanceETH).to.equal(BigNumber.from("0")); // Expect the goodContract balance to equal zero.

    balanceETH = await ethers.provider.getBalance(_badContract.address);
    expect(balanceETH).to.equal(parseEther("11")); // Expect the badContract to equal to 11 ether.



  })
})