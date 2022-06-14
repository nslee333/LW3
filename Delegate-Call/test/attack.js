const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");

describe("Attack", function () {
    it("Should change the owner of the Good Contract.", async function () {
        const helperContract = await ethers.getContractFactory("Helper");
        const _helperContract = await helperContract.deploy();
        await _helperContract.deployed();
        console.log("Helper contract's address:", _helperContract.address);

        // Deploy the Good Contract.
        const goodContract = await ethers.getContractFactory("Good");
        const _goodContract = await goodContract.deploy(_helperContract.address);
        await _goodContract.deployed();
        console.log("Good contract's address:", _goodContract.address);

        // Deploy the attack contract.
        const attackContract = await ethers.getContractFactory("Attack");
        const _attackContract = await attackContract.deploy(_goodContract.address);
        await _attackContract.deployed();
        console.log("Attack Contract's address", _attackContract.address);

        let tx = await _attackContract.attack();
        await tx.wait();
        
        expect(await _goodContract.owner()).to.equal(_attackContract.address);
        
    })
})