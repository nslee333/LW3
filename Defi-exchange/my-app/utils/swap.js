import {exchangeInstance} from './utils';



export const getAmountOfTokensReceivedFromSwap = async ( // This function is a read only function
_swapAmountWei,
provider,
ethSelected,
ethBalance,
reservedCd,
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
    } else { // This is the function but flipped, the amount to be swapped, with the CD tokens to be swapped and the CD reserve, and the eth balance, with the returned amount 
        amountOfTokens = await exchangeContract.getAmountOfTokens(
            _swapAmountWei,
            reservedCd,
            ethBalance,
        )
    }

}

export const swapTokens = async () => {


}