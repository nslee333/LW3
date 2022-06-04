import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {Contract, providers, utils} from "ethers";
import React, {useEffect, useRef, useState} from "react";
import Web3Modal, { getProviderDescription } from "web3modal";
import {abi, NFT_CONTRACT_ADDRESS} from "../constants";

export default function Home() {
  
  const [walletConnected, setWalletConnected] = useState(false);

  const [loading, setLoading] = useState(false);

  const [tokenIdsMinted, setTokenIdsMinted] = useState("0");

  const web3Modal = useRef();


  const publicMint = async () => {
    try {
      
      console.log("Public Mint");

      const signer = await getProviderOrSigner(true);

      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);

      const tx = await nftContract.mint({
        value: utils.parseEther("0.01");
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

      const provider = await getProviderOrSigner();

      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);

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





}
