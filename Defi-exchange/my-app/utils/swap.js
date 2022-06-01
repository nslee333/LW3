import {exchangeInstance, tokenInstance} from './utils';
import { EXCHANGE_CONTRACT_ADDRESS } from '../constants';



export const getAmountOfTokensReceivedFromSwap = async ( // This function is a read only function
_swapAmountWei,
provider,
ethSelected,
ethBalance,
reservedCD
) => {
    const exchangeContract = await exchangeInstance(provider);

    let amountOfTokens;
     
    if (ethSelected) { // If ethSelected is true, the amount to be swapped and the reserve are the input reserves and amounts
        // and then it will return the amount of CD tokens received from the swap.
        amountOfTokens = await exchangeContract.getAmountOfTokens( // If ETHSelected is true, then ETH is the _swapAmountWei, and the returned value will be the amount of CDTs.
            _swapAmountWei,
            ethBalance,
            reservedCD
        );
    } else { // This is the function but flipped, the amount to be swapped, with the CD tokens to be swapped and the CD reserve, and the eth balance, with the returned amount of 
        // Eth tokens to be recieved.
        amountOfTokens = await exchangeContract.getAmountOfTokens(
            _swapAmountWei,
            reservedCD,
            ethBalance
        );
    }

    return amountOfTokens; // Returns the correct amount of tokens according to what is selected.

}

export const swapTokens = async ( // This function will take in a signer, the amount to be swapped in Wei 
    signer, 
    swapAmountWei,
    tokensToBeReceivedAfterSwap,
    ethSelected
) => {
    const exchangeContract = await exchangeInstance(signer);
    const tokenContract = await tokenInstance(signer);
    let tx;

    if (ethSelected) { // If ethSelected is true, call the contract's ethToCryptoDevToken function, with 
        tx = await exchangeContract.ethToCryptoDevToken(
            tokensToBeReceivedAfterSwap,
            {
                value: swapAmountWei, // This is the 
            } 
        );
    } else {
        
        tx = await tokenContract.approve(  // This is the MetaMask prompt that asks for approval before sending the transaction?
            EXCHANGE_CONTRACT_ADDRESS,
            swapAmountWei.toString()
        );
        
        
        
        
        tx = await exchangeContract.cryptoDevTokenToEth(
            swapAmountWei,
            tokensToBeReceivedAfterSwap
        );
    }
    await tx.wait();
};