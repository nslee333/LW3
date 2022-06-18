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

        let nonce = 1; // Increasing the nonce 


        const transferAmountOfTokens = parseEther("10"); // Getting 10 ether.
        const messageHash = await tokenSenderContract.getHash( // Getting the message hash for the transaction.
            userAddress.address,
            transferAmountOfTokens,
            recipientAddress.address,
            randomTokenContract.address,
            nonce
        );
        const signature = await userAddress.signMessage(arrayify(messageHash)); // This is prompting the user to sign the message to transfer the 10 tokens.



        const relayerSenderContractInstance = tokenSenderContract.connect(relayerAddress); // Getting a relayer contract instance.

        const metaTxn = await relayerSenderContractInstance.transfer( // This is the meta transaction being called on the relayerSenderContractInstance
            userAddress.address,
            transferAmountOfTokens,
            recipientAddress.address,
            randomTokenContract.address,
            nonce,
            signature
        );
        await metaTxn.wait();
        
        let userBalance = await randomTokenContract.balanceOf( // Getting the balance of the user.
            userAddress.address,
        );

        let recipientBalance = await randomTokenContract.balanceOf( // Getting the balance of the recipientAddress.
            recipientAddress.address
        );

        expect(userBalance.eq(parseEther("9990"))).to.be.true; // Expect asserts that the userBalance is equal to 9990.
        expect(recipientBalance.eq(parseEther("10"))).to.be.true; // Expects that the recipient address's balance is equal to 10. 
                
        nonce++; 

        const messageHash2 = await tokenSenderContract.getHash( // Getting the hash of these values - for our signature, which will sign the hash
            userAddress.address,
            transferAmountOfTokens,
            recipientAddress.address,
            randomTokenContract.address,
            nonce
        );

        const signature2 = await userAddress.signMessage(arrayify(messageHash2)); // arrayify is used to convert from a string to an array, which must be done.

        const metaTxn2 = await relayerSenderContractInstance.transfer( // This takes all of it and transfers the tokens.
            userAddress.address,
            transferAmountOfTokens,
            recipientAddress.address,
            randomTokenContract.address,
            nonce,
            signature2
        );
        await metaTxn2.wait();

        // Get the balances and then check the values of the balances.

        userBalance = await randomTokenContract.balanceOf(userAddress.address);

        recipientBalance = await randomTokenContract.balanceOf(
            recipientAddress.address,
        );

        expect(userBalance.eq(parseEther("9980"))).to.be.true;
        expect(recipientBalance.eq(parseEther("20"))).to.be.true;
    });


    // This test should fail since we attempt to make 2 transactions on the same signature at the end.



    
    it("Should not let signature replay happen", async function () {
        const RandomToken = await ethers.getContractFactory("RandomToken"); // Deploy a random token contract.
        const randomTokenContract = await RandomToken.deploy();
        await randomTokenContract.deployed();

        const MetaTokenSenderFactory = await ethers.getContractFactory( // Deploy the metaTokenSenderContract.
            "TokenSender"
        );
        const tokenSenderContract = await MetaTokenSenderFactory.deploy();
        await tokenSenderContract.deployed();

        const [_, userAddress, relayerAddress, recipientAddress] = await ethers.getSigners(); // Get signers.

        const tenThousandTokensWithDecimals = parseEther("10000"); // Get 10,000 ether for testing.

        const userTokenContractInstance = randomTokenContract.connect(userAddress); // Connect an address with the random token contract instance.
        const mintTxn = await userTokenContractInstance.freeMint( // Call the freeMint function on the contract instance we just initialized.
            tenThousandTokensWithDecimals
        );
        await mintTxn.wait(); // Wait for the transaction to process.

        const approveTxn = await userTokenContractInstance.approve( // Have the connected contract (owner), grant infinite approval to the tokenSenderContract (sender) to
        // Approve an infinite amount of tokens to be transferred.
            tokenSenderContract.address,
            BigNumber.from(
                "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
            )
        );
        await approveTxn.wait(); // Wait for the transaction to get mined. 

        let nonce = 1; // Increase the nonce for randomness, that way the user can keep sending tokens without getting locked up.

        const transferAmountOfTokens = parseEther("10");
        const messageHash = await tokenSenderContract.getHash(
            userAddress.address,
            transferAmountOfTokens,
            recipientAddress.address,
            randomTokenContract.address,
            nonce
        );
        const signature = await userAddress.signMessage(arrayify(messageHash));


        // Getting a relayer sender contract instance for use.
        const relayerSenderContractInstance = tokenSenderContract.connect(relayerAddress); 

        // Calling the relayer contract to transfer these tokens - 
        const metaTxn = await relayerSenderContractInstance.transfer( 
            userAddress.address,
            transferAmountOfTokens,
            recipientAddress.address,
            randomTokenContract.address,
            nonce,
            signature
        );
        await metaTxn.wait();
        

        // Attempt to transfer the tokens with the same signature, it should fail.
        const metaTxn2 = await relayerSenderContractInstance.transfer( 
            userAddress.address,
            transferAmountOfTokens,
            recipientAddress.address,
            randomTokenContract.address,
            nonce,
            signature
        );
        await metaTxn2.wait();
    });
});