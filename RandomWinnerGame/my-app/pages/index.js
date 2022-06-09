import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {BigNumber, Contract, ethers, providers, utils } from 'ethers';
import React, {useEffect, useRef, useState} from 'react';
import Web3Modal from 'web3modal';
import {abi, RANDOM_GAME_NFT_CONTRACT_ADDRESS} from "../constants";
import { FETCH_CREATED_GAME } from "../queries";
import styles from "../styles/Home.module.css";
import { subgraphQuery } from "../utils";
import { nftInstance } from "../utils/contractInstance";


export default function Home() {
  
  const zero = BigNumber.from("0");

  const [walletConnected, setWalletConnected] = useState(false);

  const [loading, setLoading] = useState(false);

  const [isOwner, setIsOwner] = useState(false);

  const [entryFee, setEntryFee] = useState(false);

  const [maxPlayers, setMaxPlayers] = useState(false);

  const [gameStarted, setGameStarted] = useState(false);

  const [players, setPlayers] = useState(false);

  const [winner, setWinner] = useState();
  // Keeps track of all the logs for a given game.
  const [logs, setLogs] = useState([]);

  const web3ModalRef = useRef();

  // This is used to force react to re-render the page when we want to, in this case, we're doing it to show new logs.
  const forceUpdate = React.useReducer(() => ({}), {},[1]);



  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);


    } catch (error) {
      console.error(err)
    }
  }

  const getProviderOrSigner = async (needSigner = false) => {
   

    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);


    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 80001) {
      window.alert("Change the network to Mumbai");
      throw new Error("Change network to Mumbai");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  const startGame = async () => {
    try {
      
      const signer = await getProviderOrSigner(true);

      const nftContract = await nftInstance(signer);

      setLoading(true);
      const tx = await nftContract.joinGame({
        value: entryFee,
      });

      await tx.wait();

      setLoading(false);
      
    } catch (error) {
      console.error(err);
      setLoading(false);
    }
  };

  const checkIfGameStarted = async () => {
    try {
      
      const provider = await getProviderOrSigner();

      const nftContract = await nftInstance(provider);

      const _gameStarted = await nftContract.gameStarted();

      const _gameArray = await subgraphQuery(FETCH_CREATED_GAME());

      const _game = _gameArray.games[0];

      if(_gameStarted) {
        
      }
      






    } catch (error) {
      console.error(err);
    }
  }








}
