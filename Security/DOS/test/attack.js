const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("Hardhat");

describe("Attack", function () {
  it("After being declared the winner, Attack.sol should not allow anyone else to become the winner", async function () {
    const goodContract = await ethers.getContractFactory("Good");
    const _goodContract = await goodContract.deploy();
    await _goodContract.deployed();
    console.log("Good Contract's address", _goodContract.address);

    const attackContract = await ethers.getContractFactory("Attack");
    const _attackContract = await attackContract.deploy(_goodContract.address);
    await _attackContract.deployed();
    console.log("Attack Contract's address", _attackContract.address);

    const [_, addr1, addr2] = await ethers.getSigners();

    let tx = await _goodContract.connect(addr1).setCurrentAuctionPrice({
      value: ethers.utils.parseEther("1"),
    })
    await tx.wait();

    tx = await _attackContract.attack({
      value: ethers.utils.parseEther("3.0"),
    });
    await tx.wait();

    tx = await _goodContract.connect(addr2).setCurrentAuctionPrice({ 
      value: ethers.utils.parseEther("4"),
    });
    await tx.wait();

    expect(await _goodContract.currentWinner()).to.equal(
      _attackContract.address
    );
  });
});