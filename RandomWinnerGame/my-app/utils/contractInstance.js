import { Contract } from "ethers";
import {RANDOM_GAME_NFT_CONTRACT_ADDRESS, abi } from "../constants";

export const nftInstance = async (providerOrSigner) => {
    const _nftContract = new Contract(
        RANDOM_GAME_NFT_CONTRACT_ADDRESS,
        abi,
        providerOrSigner
    );
    return _nftContract;
};

module.export = { nftInstance };