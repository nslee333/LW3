const { FlashbotsBundleProvider, } = require("@flashbots/ethers-provider-bundle");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env"});

async function main() {
    const fakeNFT = await ethers.getContractFactory("FakeNFT");
    const fakeNFTContract = await fakeNFT.deploy();
    await fakeNFTContract.deployed();

    console.log("Address of the Fake NFT Contract:", fakeNFT.address);

    // This is creating an alchemy websocket provider.

    // The websocket provider will help us open a channel / connection to the goerli testnet, and it will help us listen to the new blocks that are mined.
    const provider = new ethers.providers.WebSocketProvider(
        process.env.ALCHEMY_WEBSOCKET_URL,
        "goerli"
    );
    // Wrap your private key in the ethers Wallet class.
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);



    // Create a flashbots provider which will forward the request to the relayer, which will then send it to the miner.
    const flashBotsProvider = await FlashbotsBundleProvider.create(
        provider,
        signer,
        "https://relay-goerli.flashbots.net",
        "goerli"
    );

    provider.on("block", async (blockNumber) => {
        console.log("Block Number:", blockNumber);
        
        const bundleResponse = await flashBotsProvider.sendBundle(
            [
                {
                    trasnaction: {
                        chainId: 5,
                        type: 2,
                        value: ethers.utils.parseEther("0.01"),
                        to: fakeNFT.address,
                        data: fakeNFT.interface.getSighash("mint()"),
                        maxFeePerGas: BigNumber.from(10).pow(9).mul(3),
                        maxPriorityFeePerGas: BigNumber.from(10).pow(9).mul(3),
                    },
                    signer: signer,
                },
            ],
            blockNumber + 1
        );
        if("Error" in bundleResponse) {
            console.log(bundleResponse.error.message);
        }
    });
}

main();