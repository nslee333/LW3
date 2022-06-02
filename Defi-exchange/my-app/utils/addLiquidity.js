import { utils } from "ethers";
import { EXCHANGE_CONTRACT_ADDRESS } from "../constants";
import { tokenInstance, exchangeInstance } from "./utils";


export const addLiquidity = async (
    signer,
    addCdAmountWei,
    addEtherAmountWei
) => {
    try {
        
        const tokenContract = await tokenInstance(signer);
        const exchangeContract = await exchangeInstance(signer);

        let tx = await tokenContract.approve( // In order for a contract to remove ERC20 tokens from the user's address, we need to get approval, which essentially
        // Is a mapping that we enter in the amount that the exchange contract can move, from the user's address 
            EXCHANGE_CONTRACT_ADDRESS, 
            addCdAmountWei.toString()
        );
        await tx.wait();

        tx = await exchangeContract.addLiquidity(addCdAmountWei, {
            value: addEtherAmountWei,
        });
        await tx.wait();
    } catch (error) {
        console.error(err);
    }

};

export const calculateCd = async (
    _addEther = "0",
    etherBalanceContract,
    cdTokenReserve
) => {
    const _addEtherAmountWei = utils.parseEther(_addEther);

    const cryptoDevTokenAmount = _addEtherAmountWei
        .mul(cdTokenReserve)
        .div(etherBalanceContract);
    return cryptoDevTokenAmount;
};