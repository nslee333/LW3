import {exchangeInstance, tokenInstance} from './utils';
import { EXCHANGE_CONTRACT_ADDRESS } from '../constants';



export const getAmountOfTokensReceivedFromSwap = async ( // This function is a read only function
_swapAmountWei,
provider,
ethSelected,
ethBalance,
reservedCd
) => {
    const exchangeContract = exchangeInstance(provider);

    let amountOfTokens;
     
    if (ethSelected) { // If ethSelected is true, the amount to be swapped and the reserve are the input reserves and amounts
        // and then it will return the amount of CD tokens received from the swap.
        amountOfTokens = await exchangeContract.getAmountOfTokens(
            _swapAmountWei,
            ethBalance,
            reservedCd,
        );
    } else { // This is the function but flipped, the amount to be swapped, with the CD tokens to be swapped and the CD reserve, and the eth balance, with the returned amount of 
        // Eth tokens to be recieved.
        amountOfTokens = await exchangeContract.getAmountOfTokens(
            _swapAmountWei,
            reservedCd,
            ethBalance,
        )
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
                value: swapAmountWei, // Why is this here?  Maybe this passes in the value? I'd have to see.
            } 
        );
    } else {
        
        tx = await tokenContract.approve( 
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