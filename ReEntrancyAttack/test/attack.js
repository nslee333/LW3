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

    let tx = await _goodContract.connect(innocentAddress).addBalance({
      value: parseEther("10"),
    })
    
    await tx.wait();

    console.log(_goodContract.address, _badContract.address);
    
    let balanceETH = await ethers.provider.getBalance(goodContract.address);

    expect(balanceETH).to.equal(parseEther('10'));

    tx = await _badContract.connect(attackerAddress).attack({
      value: parseEther("1"),
    });

    await tx.wait();

    balanceETH = await ethers.provider.getBalance(goodContract.address);
    expect(balanceETH).to.equal(BigNumberFrom("0"));

    balanceETH = await ethers.provider.getBalance(goodContract.address);
    expect(balanceETH).to.equal(parseEther("11"));



  })
})