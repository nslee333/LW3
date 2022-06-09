import { Contract } from "ethers";
import {RANDOM_GAME_NFT_CONTRACT_ADDRESS, abi } from "../constants";

export const nftInstance = async (providerOrSigner) => {
    const nftContract = new Contract(
        RANDOM_GAME_NFT_CONTRACT_ADDRESS,
        abi,
        providerOrSigner
    );
    return nftContract;
};

module.exports = {nftInstance};