const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber, utils} = require("ethers");


describe("Attack", function () {
  it("Should be able to guess the exact number", async function () {
    
    const Game = await ethers.getContractFactory("Game"); // Deployed the Game contract.
    const _game = await Game.deploy({ value: utils.parseEther("0.1")});
    await _game.deployed();

    console.log("Game Contract Deployed to:", _game.address);

    const Attack = await ethers.getContractFactory("Attack"); // Deployed the Attack contract.
    const _attack = await Attack.deploy(_game.address);
    console.log("Attack contract address", _attack.address); 

    const tx = await _attack.attack(); // Calling the attack function.
    await tx.wait();

    
    const _balanceGame = await _game.getBalance();
    // const balanceGame = await _game.getBalance();
    expect(_balanceGame).to.equal(BigNumber.from("0")); // Expect the balance of the game to equal zero.
  });
});
