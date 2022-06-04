import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {Contract, providers, utils} from "ethers";
import React, {useEffect, useRef, useState} from "react";
import Web3Modal from "web3modal";
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI} from "../constants";

export default function Home() {
  
  const [walletConnected, setWalletConnected] = useState(false);

  const [loading, setLoading] = useState(false);

  const [tokenIdsMinted, setTokenIdsMinted] = useState("0");

  const web3ModalRef = useRef();


  const publicMint = async () => {
    try {
      
      console.log("Public Mint");

      const signer = await getProviderOrSigner(true);

      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signer);

      const tx = await nftContract.mint({
        value: utils.parseEther("0.01"),
      });

      setLoading(true);

      await tx.wait();

      setLoading(false);

      window.alert("You have successfully minted an LW3Punk!");
      
    } catch (error) {
      console.error(error);
    }

  };



  const connectWallet = async () => {
    try {
      
      await getProviderOrSigner();

      setWalletConnected(true);

    } catch (error) {
      console.error(error);
    }
  }



  const getTokenIdsMinted = async () => {
    try {

      const provider = await getProviderOrSigner();

      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, provider);

      const _tokenIds = await nftContract.tokenIds();

      console.log("tokenIds", _tokenIds);

      setTokenIdsMinted(_tokenIds.toString());

    } catch (error) {
      console.error(error);
    }
  }


  const getProviderOrSigner = async (needSigner = false) => {
    
    const provider = await web3ModalRef.current.connect();

    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();
    

    if (chainId !== 80001) {
      window.alert("Please change the network to Mumbai");
      throw new Error("Change the network to Mumbai");
    } 



    if (needSigner) {

      const signer = web3Provider.getSigner();

      return signer;

    }

    return web3Provider;

  };

  useEffect(() => {
    if(!walletConnected) {
      
      web3ModalRef.current = new Web3Modal({
        network: "mumbai",
        providerOptions: {},
        disableInjectedProvider: false,
      });

      connectWallet();

      getTokenIdsMinted();
      
      setInterval(async function () {
        await getTokenIdsMinted();
      }, 5 *  1000);
    }
  }, [walletConnected]);

  
  const renderButton = () => {
    if(!walletConnected) {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    } 

    if(loading) {
      return <button className={styles.button}>Loading...</button>;
    }

    return (
      <button className={styles.button} onClick={publicMint}>
        Public Mint 🚀
      </button>
    );
  };




    return (
      <div>
        <Head>
          <title>LW3 Punks</title>
          <meta name="description" content="LW3Punks-Dapp" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className={styles.main}>
          <div>
            <h1 className={styles.title}>Welcome to LW3Punks!</h1>
            <div className={styles.description}>
              Its an NFT collection for LearnWeb3 students.
            </div>
            <div className={styles.description}>
              {tokenIdsMinted}/10 have been minted
            </div>
              {renderButton()}
            </div>
            <div>
              <img className={styles.image} src="./LW3Punks/7.png" />
            </div>
          </div>
          
          <footer className={styles.footer}> Made with &#10084; by Nathan Lee</footer>
        </div>
    );
}
