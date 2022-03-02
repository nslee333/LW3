
const { ethers } = require("hardhat");

// This is using Hardhat as a library, 

async function main() {
    const nftContract = await ethers.getContractFactory("NateNFT");

    // Assigning variable name to contract factory (ethers) for 'NateNFT'

    const deployedNFTContract = await nftContract.deploy();

    // Variable name assigned to await deployed contract.

    console.log("NFT Contract Address:", deployedNFTContract.address);

    // Log contract address.
    
}

main()
    .then(() => process.exit(0))
    // If issue then exit?
    .catch((error) => {
        // If catch issue, log issue then exit.
        console.error(error);
        // Log error report.
        process.exit(1);
        // Exit process.
    });

    // This is how to handle async errors.