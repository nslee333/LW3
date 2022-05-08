const { ethers } = require("Hardhat");
require("dotenv").config({ path: ".env"});
const { CRYPT0_TOKEN_ADDRESS } = require("../constants");

const tokenAddress = CRYPT0_TOKEN_ADDRESS;


async function main() {
 
  const exchangeContract = await ethers.getContractFactory("Exchange");
  const deployedExchange = await exchangeContract.deploy(
    tokenAddress
  );
  await deployedExchange.deployed();


  console.log("Exchange Contract deployed to:", deployedExchange.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
