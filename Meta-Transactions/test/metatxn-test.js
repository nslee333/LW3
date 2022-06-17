const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");
const { arrayify, parseEther } = require("ethers/lib/utils");

describe("MetaTokenTransfer", function () {
    it("Should let user transfer tokens through a receiver", async function () {

        const RandomTokenFactory = await ethers.getContractFactory("RandomToken"); // Deploy a random token contract.
        const randomTokenContract = await RandomTokenFactory.deploy();
        await randomTokenContract.deployed();

        const MetaTokenSenderFactory = await ethers.getContractFactory("TokenSender"); // Deploy a meta token sender contract.
        const tokenSenderContract = await MetaTokenSenderFactory.deploy();
        await tokenSenderContract.deployed();

        const [_, userAddress, relayerAddress, recipientAddress ] = await ethers.getSigners(); // Get some signers.
        await ethers.getSigners();

        console.log(userAddress.address, relayerAddress.address, recipientAddress.address);

        const tenThousandTokensWithDecimals = parseEther("10000"); // Get 10,000 ether for testing.
        const userTokenContractInstance = randomTokenContract.connect(userAddress); // This is creating an instance of random token contract that is connected to an address.
        const mintTxn = await userTokenContractInstance.freeMint( // call the freeMint function on the random token contract that is connected to an address, and 
        // Mint 10,000 ether.
            tenThousandTokensWithDecimals
        );

        await mintTxn.wait(); // Wait for the transaction to process.

        // This is giving userTokenContractInstance infinite approval for transferring the tokens.
        const approveTxn = await userTokenContractInstance.approve( 
            tokenSenderContract.address,
            BigNumber.from(
                "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
            )
        );
        await approveTxn.wait();


        const transferAmountOfTokens = parseEther("10"); // Getting 10 ether.
        const messageHash = await tokenSenderContract.getHash( // Getting the message hash for the transaction.
            userAddress.address,
            transferAmountOfTokens,
            recipientAddress.address,
            randomTokenContract.address
        );
        const signature = await userAddress.signMessage(arrayify(messageHash)); // This is prompting the user to sign the message to transfer the 10 tokens.



        const relayerSenderContractInstance = tokenSenderContract.connect(relayerAddress); // Getting a relayer contract instance.

        const metaTxn = await relayerSenderContractInstance.transfer( // This is the meta transaction being called on the relayerSenderContractInstance
            userAddress.address,
            transferAmountOfTokens,
            recipientAddress.address,
            randomTokenContract.address,
            signature
        );
        await metaTxn.wait();
        
        const userBalance = await randomTokenContract.balanceOf( // Getting the balance of the user.
            userAddress.address,
        );

        const recipientBalance = await randomTokenContract.balanceOf( // Getting the balance of the recipientAddress.
            recipientAddress.address
        );

        expect(userBalance.lt(tenThousandTokensWithDecimals)).to.be.true; // Expect asserts that the userBalance is less than 10,000 tokens to be true.
        expect(recipientBalance.gt(BigNumber.from(0))).to.be.true; // Expects that the recipient address's balance is greater than 0, to be true.


    })
})