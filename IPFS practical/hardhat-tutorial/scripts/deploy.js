const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env"});

async function main() {

  const metadataURL = "ipfs://Qmbygo38DWF1V8GttM1zy89KzyZTPU2FLUzQtiDvB7q6i5/";

  const lw3PunksContract = await ethers.getContractFactory("LW3Punks");

  const deployedLW3Punks = await lw3PunksContract.deploy(metadataURL);

  await deployedLW3Punks.deployed();

  console.log("LW3Punks Contract Address: " + deployedLW3Punks.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
