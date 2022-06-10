const { expect } = require("chai");
const { ethers } = require("hardhat");
const keccak256 = require("keccak256");
const { MerkleTree } = require("merkletreejs");



function encodeLeaf(address, spots) {
  // Same as the 'abi.encodePacked' in solidity.js
  return ethers.utils.defaultAbiCoder.encode(
    ["address", "uint64"],
    [address, spots]
  );
}


describe("Check if Merkle Root is working", function () {

  it("Should be able to verify if a given address is in whitelist or not", async function () {

  // Get a bunch of test addresses.
  const [owner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();

  // Create an array of elements you wish to encode in the merkle tree.
  const list = [
    encodeLeaf(owner.address, 2),
    encodeLeaf(addr1.address, 2),
    encodeLeaf(addr2.address, 2),
    encodeLeaf(addr3.address, 2),
    encodeLeaf(addr4.address, 2),
    encodeLeaf(addr5.address, 2),
  ]

  const merkleTree = new MerkleTree(list, keccak256, { // Creating a new Merkle Tree - passing in the list of ABI encoded leafs (addresses) and the hash algorithm to use.
    // Hash leaves and sort pairs are configurations for the merkle tree?
    hashLeaves: true,
    sortPairs: true,
  });

  const root = merkleTree.getHexRoot(); // A method to get the root of the merkle tree that we just created above.

  const whitelist = await ethers.getContractFactory("Whitelist"); // Deploying the contract - 
  const Whitelist = await whitelist.deploy(root);
  await Whitelist.deployed();

  const leaf = keccak256(list[0]); // Grabbing a specific leaf for our testing purposes.

  const proof = merkleTree.getHexProof(leaf); // Get the Hex proof of the leaf that we just grabbed.

  let verified = await Whitelist.checkInWhitelist(proof, 2);
  expect(verified).to.equal(true);


  verified = await Whitelist.checkInWhitelist([], 2);
  expect(verified).to.equal(false);


  });
  
});

