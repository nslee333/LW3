import { Contract } from "ethers";
import { EXCHANGE_CONTRACT_ABI, EXCHANGE_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI, TOKEN_CONTRACT_ADDRESS } from "../constants";


export const exchangeInstance = async (providerOrSigner) => {
    const _contractInstance = new Contract(
        EXCHANGE_CONTRACT_ADDRESS,
        EXCHANGE_CONTRACT_ABI,
        providerOrSigner
    );
    
    return _contractInstance;
}

export const tokenInstance = async (providerOrSigner) => {
    const _tokenInstance = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        providerOrSigner
    );

    return _tokenInstance;
}

module.export = { exchangeInstance, tokenInstance };