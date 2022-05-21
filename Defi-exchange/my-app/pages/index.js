import { BigNumber, providers, utils } from "ethers";
import Head from "next/head";
import React, {useEffect, useRef, useState} from "react";
import Web3Modal from "web3modal";
import styles from "../styules/Home.module.css";
import { addLiquidity, calculateCd} from "../utils/addLiquidity";
import {
  getCDTokensBalance,
  getEtherBalance,
  getLPTokensBalance,
  getReserveOfCDTokens,
} from "../utils/getAmounts";
import {
  getTokensAfterRemove,
  removeLiquidity,
} from "../utils/removeLiquidity";
import { swapTokens, getAmountOfTokensReceivedFromSwap } from "../utils/swap";

export default function Home() {
  const zero = BigNumber.from(0);
  const [loading, setLoading] = useState(false);
  const [liquidity, setLiquidity] = useState(true);
  const [ethBalance, setEthBalance] = useState(zero);
  const [reservedCD, setReservedCD] = useState(zero);
  const [etherBalanceContract, setEtherBalanceContract] = useState(zero);
  const [cdBalance, setCDBalance] = useState(zero);
  const [LPBalance, setLPBalance] = useState(zero);
  const [addEther, setAddEther] = useState(zero);
  const [addCDTokens, setAddCDTokens] = useState(zero);
  const [removeEther, setRemoveEther] = useState(zero);
  const [removeCD, setRemoveCD] = useState(zero);
  const [removeLPTokens, setRemoveLPTokens] = useState("0");
  const [swapAmount, setSwapAmount] = useState("");
  const [tokensToBeReceivedAfterSwap, setTokensToBeReceivedAfterSwap] = useState(zero);
  const [ethSelected, setEthSelected] = useState(true);
  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();


  const getAmounts = async () => { // This function gets the inputs (address and provider/signer) and gets the balances from the utility files, which then calls the contract functions
    // Which get the values, then updates the react hooks for sustaining the values.
    try {
      
      const provider = await getProviderOrSigner(false); 
      const signer = await getProviderOrSigner(true);
      const address = await signer.getAddress();

      const _ethBalance = await getEtherBalance(provider, address);
      const _cdBalance = await getCDTokensBalance(provider, address);
      const _lpBalance = await getLPBalance(provider, address);
      const _reserveCD = await getReserveOfCDTokens(provider);
      const _ethBalanceContract = await getEtherBalance(provider, null, true);

      setEtherBalanceContract(_ethBalance);
      setCDBalance(_cdBalance);
      setLPBalance(_lpBalance);
      setReservedCD(_reserveCD);
      setReservedCD(_reserveCD);
      setEtherBalanceContract(_ethBalanceContract);
    } catch (error) {
      console.error(error);
    }
  }

  const _swapTokens = async () => { // 
    try {
      const swapAmountWei = utils.parseEther(swapAmount); // Pass in the value of the react hook string and convert it to a big number instance in the amount of wei.

      if(!swapAmountWei.eq(zero)) { // This is a Ethers BN function that checks if the value is equal to (.eq) to amount - in this case, IF the swapAmountWei is NOT equal to zero;
        // perform  this code:
        const signer = await getProviderOrSigner(true); 
        setLoading(true);
        await swapTokens( // Utils
          signer,
          swapAmountWei,
          tokensToBeReceivedAfterSwap,
          ethSelected
        );
        setLoading(false);

        await getAmounts();
        setSwapAmount("");
        
      }

    } catch (error) {
      console.error(error);
      setLoading(false);
      setSwapAmount("") // If there is an error, set the value to an empty string.
    }
  }

  const _getAmountOfTokensReceivedFromSwap = async (_swapAmount) => {
    try {
      
      const _swapAmountWei = utils.parseEther(_swapAmount.toString());

      if(!_swapAmountWei.eq(zero)) { // If the swap amount does not equal zero, then run this code.
        const provider = await getProviderOrSigner();
        const _ethBalance = await getEtherBalance(provider, null, true);
        const amountOfTokens = await getAmountOfTokensReceivedFromSwap( // This goes into the swap.js file, which then correctly inputs the arguments for the ratio depending 
        // On if EthSelected is true, then the contract calculates the amount of tokens according to xy=k formula with fee withdrawn, then returns that token amount, 10 becomes 9.8 if 
        // There is a 1 % fee, then returns it to the swap.js then returns it to this function for use.
          _swapAmountWei,
          provider,
          ethSelected,
          _ethBalance,
          reservedCD
        );
        setTokensToBeReceivedAfterSwap(amountOfTokens); // set this react hook value to the amount returned from the swap.js - contract.
      } else {
        setTokensToBeReceivedAfterSwap(zero); // Else, set the hook to zero.
      }

    } catch (error) {
      console.error(error);
    }
  }

  const _addLiquidity = async () => {
    try {
      
      const addEtherWei = utils.parseEther(addEther.toString());

      if (!addCDTokens.eq(zero) && !addEtherWei.eq(zero)) {
        const signer = await getProviderOrSigner(true);
        setLoading(true);
        await addLiquidity(signer, addCDTokens, addEtherWei);
        setLoading(false);
        setAddCDTokens(zero);
        await getAmounts();
      } else {
        setAddCDTokens(zero);
      }

    } catch (error) {
      console.error(error);
      setLoading(false);
      setAddCDTokens(zero);
    }

  }


  const _removeLiquidity = async () => {
    try {
      
      const signer = await getProviderOrSigner(true);

      const removeLPTokensWei = utils.parseEther(removeLPTokens); // Parse this string into ether, set it to a variable, then pass it in to the removeLiquidity utility function.
      setLoading(true);
      await removeLiquidity(signer, removeLPTokensWei); // This is calling the utils/removeLiquidity.js file, which then calls the contract, inputs the LP tokens to be removed,
      // Then the contract burns the LP tokens, and then sends the ether and CDTokens to the user address.
      setLoading(false);

      await getAmounts(); //
      setRemoveCD(zero); // Set the amount to be removed to zero.
      setRemoveEther(zero); // Set the amount to be removed to zero.
      
    } catch (error) {
      console.error(error);
      setLoading(false);
      setRemoveCD(zero);
      setRemoveEther(zero);
    }
  }











































}