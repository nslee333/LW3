const { ethers } = require("hardhat");
require("dotenv").config({path: ".env"});
const {CRYPTO_DEVS_NFT_CONTRACT_ADDRESS } = require("../constants");


async function main() {
  const cryptoDevsNFTContract = CRYPTO_DEVS_NFT_CONTRACT_ADDRESS;


  const cryptoDevsContract = await ethers.getContractFactory("CryptoDevToken")

  const deployedCDTContract = await cryptoDevsContract.deploy(cryptoDevsNFTContract);


  console.log("Contract deployed to:", deployedCDTContract.address);
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
