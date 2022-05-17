import { exchangeInstance } from "./utils";

export const removeLiquidity = async (signer, removeLPTokensWei) => {
    const exchangeContract = exchangeInstance(signer);
    const tx = await exchangeContract.removeLiquidity(removeLPTokensWei);
    await tx.wait();
};

export const getTokensAfterRemove = async (
    provider,
    removeLPTokensWei,
    _ethBalance,
    cryptoDevTokenReserve
) => {
    try {
        const exchangeContract = exchangeInstance(provider);

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