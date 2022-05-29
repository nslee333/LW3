import { Contract } from "ethers";
import { EXCHANGE_CONTRACT_ABI, EXCHANGE_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI, TOKEN_CONTRACT_ADDRESS } from "../constants";
import { exchangeInstance, tokenInstance } from "./utils";

export const getEtherBalance = async (
    provider,
    address,
    contract = false
) => {
    try {
        if (contract) {
            const balance = await provider.getBalance(EXCHANGE_CONTRACT_ADDRESS);
            return balance;
        } else {
            const balance = await provider.getBalance(address);
            return balance;
        }
    } catch (error) {
        console.error(error);
        return 0; // Why do we put a return zero value here?
    } // try catch, pass in provider, address, contract (default to false) if contract is true, return the balance of the contract, else, return the value of the address balance.

}

export const getCDTokensBalance = async (provider, address) => {
    try {
        const tokenContract = await tokenInstance(provider);
        



        const balanceOfCryptoDevTokens = await tokenContract.balanceOf(address);
        return balanceOfCryptoDevTokens;

    } catch (error) {
        console.error(error);
    }
} // Get an instance of the token contract, get and return the value of the balance of the address passed in.

export const getLPTokensBalance = async (provider, address) => {
    try {
        
        const exchangeContract = await exchangeInstance(provider);
        const balanceOfLPTokens = exchangeContract.balanceOf(address);
        return balanceOfLPTokens;

    } catch (error) {
        console.error(error);
    }
} // Get an instance of the exchange contract, get and return the value of the balance of the address passed in.

export const getReserveOfCDTokens = async (provider) => {
    try {
        const exchangeContract = await exchangeInstance(provider);
        
        // const exchangeContract = exchangeInstance(provider);
        const reserve = await exchangeContract.getReserve();
        return reserve;

    } catch (error) { // Get an instance of the exchange contract, get and return the value of the amount of CD tokens in the reserve.
        console.error(error);
    }
}