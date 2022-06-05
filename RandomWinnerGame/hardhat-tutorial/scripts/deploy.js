const { hexStripZeros } = require("ethers/lib/utils");
const { ethers } = require("hardhat");
require("dotenv").config({path: ".env"});
require("@nomiclabs/hardhat-etherscan");
const { FEE, VRF_COORDINATOR, LINK_TOKEN, KEY_HASH} = require("../constants");

async function main() {

    const randomWinnerGame = await ethers.getContractFactory("RandomWinnerGame");

    const deployedRandomWinnerGame = await randomWinnerGame.deploy
    (
        VRF_COORDINATOR,
        LINK_TOKEN,
        KEY_HASH,
        FEE
    );

    await deployedRandomWinnerGame.deployed();

    console.log("Verify Contract Address:" + deployedRandomWinnerGame.address);

    console.log("Sleeping...");
    await sleep(30000);

    await hre.run("verify:verify", {
        address: deployedRandomWinnerGame.address,
        constructorArguments: [VRF_COORDINATOR, LINK_TOKEN, KEY_HASH, FEE],
    });
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });