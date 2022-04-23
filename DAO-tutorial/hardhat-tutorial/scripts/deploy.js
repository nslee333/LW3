const { ethers } = require("hardhat");
const { CRYPTO_DEVS_NFT_CONTRACT_ADDRESS } = require("../constants");

async function main() {
  
  const FakeNFTMarketplace = await ethers.getContractFactory("FakeNFTMarketplace");
  const fakeNFTMarketplace = await FakeNFTMarketplace.deploy();
  await fakeNFTMarketplace.deployed();

  console.log("FakeNFTMarketplace deployed to ", fakeNFTMarketplace.address);

  const CryptoDevsDAO = await ethers.getContractFactory("CryptoDevsDao");
  const cryptoDevsDAO = await CryptoDevsDAO.deploy(
    fakeNFTMarketplace.address, 
    CRYPTO_DEVS_NFT_CONTRACT_ADDRESS,
    {
      value: ethers.utils.parseEther("0.01"), // Since the constructor is payable, and a dao needs a treasury, we need to give it some
      // ether.
    }
    
  
  );
  await cryptoDevsDAO.deployed();
  console.log("CryptoDevsDao deployed to ", cryptoDevsDAO.address);

}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

