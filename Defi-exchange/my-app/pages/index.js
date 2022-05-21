import { BigNumber, providers, utils } from "ethers";
import Head from "next/head";
import React, {useEffect, useRef, useState} from "react";
import Web3Modal from "web3modal";
import { EXCHANGE_CONTRACT_ADDRESS, TOKEN_CONTRACT_ADDRESS } from "../constants";
import styles from "../styles/Home.module.css";
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
  const [liquidityTab, setLiquidityTab] = useState(true);
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

  console.log(TOKEN_CONTRACT_ADDRESS, EXCHANGE_CONTRACT_ADDRESS);
  const getAmounts = async () => { // This function gets the inputs (address and provider/signer) and gets the balances from the utility files, which then calls the contract functions
    // Which get the values, then updates the react hooks for sustaining the values.
    try {
      
      const provider = await getProviderOrSigner(false); 
      const signer = await getProviderOrSigner(true);
      const address = await signer.getAddress();

      const _ethBalance = await getEtherBalance(provider, address);
      const _cdBalance = await getCDTokensBalance(provider, address);
      const _lpBalance = await getLPTokensBalance(provider, address);
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


  const _removeLiquidity = async () => { // Remove liquidity from the DEX, update the values of all the hooks then update the removeValue hooks.
    try {
      
      const signer = await getProviderOrSigner(true);

      const removeLPTokensWei = utils.parseEther(removeLPTokens); // Parse this string into ether, set it to a variable, then pass it in to the removeLiquidity utility function.
      setLoading(true);
      await removeLiquidity(signer, removeLPTokensWei); // This is calling the utils/removeLiquidity.js file, which then calls the contract, inputs the LP tokens to be removed,
      // Then the contract burns the LP tokens, and then sends the ether and CDTokens to the user address.
      setLoading(false);

      await getAmounts(); // Get and update the values of all the amount hooks.
      setRemoveCD(zero); // Set the amount to be removed to zero.
      setRemoveEther(zero); // Set the amount to be removed to zero.
      
    } catch (error) {
      console.error(error);
      setLoading(false);
      setRemoveCD(zero);
      setRemoveEther(zero);
    }
  }

  const _getTokensAfterRemove = async (_removeLPTokens) => { // 
    try {

      const provider = await getProviderOrSigner();
      const removeLPTokensWei = utils.parseEther(_removeLPTokens);
      const _ethBalance = await getEtherBalance(provider, null, true);
      const cryptoDevTokenReserve = await getReserveOfCDTokens(provider); // Calls the contract getReserve() function which goes to the CDT contract and returns the balance of the CDT tokens
      // In the DEX's balance.
      const { _removeEther, _removeCD } = await getTokensAfterRemove(  // Assigns two variables to getTokensAfterRemove function which inputs the values, and returns the proper  value 
      // of how much Ether and CDT to give back to Liquidity provider.
        provider,
        removeLPTokensWei,
        _ethBalance,
        cryptoDevTokenReserve
      ); 
      setRemoveEther(_removeEther);
      setRemoveCD(_removeCD); // Then we take these values and update the state hooks for sustaining those values for our use. 

    } catch (error) {
      console.error(error);
    }
  }

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (error) {
      console.error(error);
    }
  }


  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("Change the network to Goerli");
      throw new Error("Change the network to Goerli");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  }

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
      getAmounts();
    }
  }, [walletConnected]);

  const renderButton = () => {
    if (!walletConnected) {
      return (
        <button onClick={connectWallet} className={styles.button}>
        Connect your Wallet 
        </button>
      );
    }

    if (loading) {
      return <button className={styles.button}>Loading...</button>;
    }

    if(liquidityTab) {
      return(
        <div>
          <div className={styles.description}>
            You have: 
            <br />
            {utils.formatEther(cdBalance)} Crypto Dev Tokens
            <br />
            {utils.formatEther(ethBalance)} Ether
            <br />
            {utils.formatEther(LPBalance)} Crypto Dev LP Tokens
          </div>  
          <div>
            {utils.parseEther(reservedCD.toString()).eq(zero) ? (
              <div>
                <input
                  type="number"
                  placeholder="Amount Of Ether"
                  onChange={(e) => setAddEther(e.target.value || "0")}
                  className={styles.input}
                />
              <input
                type="number"
                placeholder="Amount Of Crypto Dev Tokens"
                onChange={(e) => 
                setAddCDTokens(
                  BigNumber.from(utils.parseEther(e.target.value || "0" ))
                )
              }
              className={styles.input}
              />
              <div className={styles.inputDiv}>
                {`You will need ${utils.formatEther(addCDTokens)} Crypto Dev Tokens`}
              </div>
              <button className={styles.button} onClick={_addLiquidity}>
                Add Liquidity
              </button>
            
            </div>
            ) : (
              <div>
              <input
                type="number"
                placeholder="Amount Of Ether"
                onChange={async (e) => {
                  setAddEther(e.target.value || "0");

                  const _addCDTokens = await calculateCd(
                    e.target.value || "0",
                    etherBalanceContract,
                    reservedCD
                  );
                  setAddCDTokens(_addCDTokens);
                  
                  
                  
                
                }}
                className={styles.input}
                />
                <div className={styles.inputDiv}>
                {`You wil need ${utils.formatEther(addCDTokens)} Crypto Dev Tokens`}
                </div>
                <button className={styles.button} onClick={_addLiquidity}>
                  Add Liquidity
                </button>
              </div>
            )}
                <div>
                  <input
                    type="number"
                    placeholder="Amount Of LP Tokens"
                    onChange={async (e) => {
                      setRemoveLPTokens(e.target.value || "0");
                    }}
                    className={styles.input}
                  />
                  <div className={styles.inputDiv}>
                    {`You will get ${utils.formatEther(removeCD)} Crypto Dev Tokens and ${utils.formatEther(removeEther)} Ether`}
                  </div>
                  <button className={styles.button} onClick={_removeLiquidity}>
                    Remove Liquidity
                  </button>
                </div>
              </div>
            </div>
          );
      } else {
        return (
          <div>
            <input 
              type="number"
              placeholder="Amount"
              onChange={async (e) => {
                setSwapAmount(e.target.value || "0");
              }}
              className={styles.input}
              value={swapAmount}
              />
            <select
              className={styles.select}
              name="dropdown"
              id="dropdown"
              onChange={async () => { 
                setEthSelected(!ethSelected);
                await _getAmountOfTokensReceivedFromSwap(0);
                setSwapAmount("");
              }}
              >
                <option value="eth">Ethereum</option>
                <option value="cryptoDevToken">Crypto Dev Token</option>              
              </select>
              <br />
              <div className={styles.inputDiv}>
                {ethSelected 
                  ? `You will get ${utils.formatEther(tokensToBeReceivedAfterSwap)} Crypto Dev Tokens`
                  : `You will get ${utils.formatEther(tokensToBeReceivedAfterSwap)} Ether`}
                    </div>
                    <button className={styles.button} onClick={_swapTokens}>
                      Swap Tokens
                    </button>
              </div>
            );
      }
  };

  return (
    <div>
      <Head>
        <title>Crypto Devs</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    <div className={styles.main}>
      <div>
        <h1 className={styles.title}>Welcome to Crypto Devs Exchange!</h1>
        <div className={styles.description}>
          Exchange Ethereum &#60;&#62; Crypto Dev Tokens
      </div>
      <div>
        <button className={styles.button}
          onClick={() => {
            setLiquidityTab(!liquidityTab);
          }}
        >
          Liquidity
        </button>
        <button
          className={styles.button}
          onClick={() => {
            setLiquidityTab(false);
          }}
        >
          Swap
        </button>
      </div>
      {renderButton()}
    </div>
      <div>
            <img className={styles.image} src="./13.svg" />
      </div>
    </div>

    <footer className={styles.footer}>
          Made with &#10084; by Nathan Lee
    </footer>
  </div>
  );
}