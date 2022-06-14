const { expect } = require("chai");
const { ethers } = require("hardhat");




describe("Attack", function () {
  it("Should be able to read the private variables password and username", async function () { 
    const loginFactory = await ethers.getContractFactory("Login");

    const usernameBytes = ethers.utils.formatBytes32String("test"); // This is initializing what the test, password would equal to in a hex string, for comparison purposes.
    const passwordBytes = ethers.utils.formatBytes32String("password"); // Same as above.

    const loginContract = await loginFactory.deploy( // Passing in the values initialized above.
      usernameBytes, 
      passwordBytes
    );
    
    await loginContract.deployed(); // Contract deployment.

    const slot0Bytes = await ethers.provider.getStorageAt( // getStorageAt returns the Bytes32 value of the address we pass in and the position of the value.
    // It reads the storage slot values at x address.
      loginContract.address,
      0
    );

    const slot1Bytes = await ethers.provider.getStorageAt( // Same as above.
      loginContract.address,
      1
    );

    expect(ethers.utils.parseBytes32String(slot0Bytes)).to.equal("test"); // Comparing the value at the position, with our value that we initialized.
    expect(ethers.utils.parseBytes32String(slot1Bytes)).to.equal("password");

    });
});
