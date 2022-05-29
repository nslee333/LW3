import { exchangeInstance } from "./utils";

export const removeLiquidity = async (signer, removeLPTokensWei) => {
    const exchangeContract = await exchangeInstance(signer);
    const tx = await exchangeContract.removeLiquidity(removeLPTokensWei);
    await tx.wait();
};

export const getTokensAfterRemove = async ( // Call this function input provider, tokens, _ethBalance and CDT token reserve and get the correct amount of tokens according to the ratio.
    provider,
    removeLPTokensWei,
    _ethBalance,
    cryptoDevTokenReserve
) => {
    try {
        const exchangeContract = await exchangeInstance(provider);

        const _totalSupply = await exchangeContract.totalSupply();

        const _removeEther = _ethBalance.mul(removeLPTokensWei).div(_totalSupply);
        const _removeCD = cryptoDevTokenReserve
        .mul(removeLPTokensWei)
        .div(_totalSupply);
        return {
            _removeEther,
            _removeCD,
        };
    } catch (error) {
        console.error(error);
    }
}