import { Contract, CONTRACT } from "ethers";
import {
    EXCHANGE_CONTRACT_ADDRESS,
    EXCHANGE_CONTRACT_ABI,
    TOKEN_CONTRACT_ADDRESS,
    TOKEN_CONTRACT_ABI
} from "../constants";

export const getEtherBalance = async (
    provider,
    address,
    contract = false
) => {
    try {
        if(contract) {
            const balance = await provider.getBalance(EXCHANGE_CONTRACT_ADDRESS);
            return balance;
        } else {
            const balance = await provider.getBalance(address);
            return balance;
        }
    } catch (error) {
        console.error(err);
        return 0;
    } // try catch, pass in provider, address, contract (default to false) if contract is true, return the balance of the contract, else, return the value of the address balance.

}

export const getCDTokensBalance = async (provider, address) => {
    try {
        
        const tokenContract = new Contract(
            TOKEN_CONTRACT_ADDRESS,
            TOKEN_CONTRACT_ABI,
            provider
        );
        const balanceOfCryptoDevTokens = await tokenContract.balanceOf(address);
        return balanceOfCryptoDevTokens;

    } catch (error) {
        console.error(err);
    }
} // Get an instance of the token contract, get and return the value of the balance of the address passed in.

export const getLPTokensBalance = async (provider, address) => {
    try {
        const exchangeContract = new Contract(
            EXCHANGE_CONTRACT_ADDRESS,
            EXCHANGE_CONTRACT_ABI,
            provider
        );

        const balanceOfLPTokens = await exchangeContract.getBalance(address);
        return balanceOfLPTokens;

    } catch (error) {
        console.error(err);
    }
} // Get an instance of the exchange contract, get and return the value of the balance of the address passed in.

export const getReserveOfCDTokens = async (provider) => {
    try {
        
        const exchangeContract = new Contract(
            EXCHANGE_CONTRACT_ADDRESS,
            EXCHANGE_CONTRACT_ABI,
            provider
        );

        




    } catch (error) {
        console.error(err);
    }
}