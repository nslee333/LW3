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
import { zeroPad } from 'ethers/lib/utils';


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

      const _game = _gameArray.games[0]; // This sustains the Game objects in an array.

      let _logs = [];


      if(_gameStarted) { // If the game has started. 
        _logs = [`Game has started with ID: ${_game.id}`]; // Add this entry to the logs.

        if(_game.players && _game.players.length > 0) { // If the game has players, and the amount of players is less than zero - 
          _logs.push( 
            `${_game.players.length} / ${_game.maxPlayers} already joined 👀` // Push this log to the array - It states x out of x players have joined.
          );
          _game.players.forEach((player) => { // For each player in the array - push the below log to the logs array.
            _logs.push(`${player} joined 🏃‍♂️`);
          });
        }
        
        setEntryFee(BigNumber.from(_game.entryFee)); // Set the entryFee RH to the value of _game.entryFee.
        
        setMaxPlayers(_game.maxPlayers); // Update the RH with the values from the game.
      
      
      } else if (!gameStarted && _game.winner) { // If the game has started and there is a winner, then do this. 
        _logs = [ // Log all of these logs -
          `Last game has ended with ID ${_game.id}`, 
          `Winner is ${_game.winner}  🎉 `,
          `Waiting for host to start new game...`,
        ];

        setWinner(_game.winner); // Set RH winner to the _game winner.
      }

      setLogs(_logs); // Set the RH logs to all the _logs we have pushed with this function call.

      setPlayers(_game.players);  // set the amount of players.

      setGameStarted(_gameStarted); // Set the gameStarted to true.

      forceUpdate(); // Force React to update the web page.

    
    } catch (error) { 
      console.error(err);
    }
  }



  const getOwner = async () => {
    try {
      
      const provider = await getProviderOrSigner();

      const nftContract = await nftInstance(provider);

      const _owner = await nftContract.owner();

      const signer = await getProviderOrSigner(true);

      const address = await signer.getAddress();

      if (address.toLowerCase() === _owner.toLowerCase()) {
        setIsOwner(true);
      }

    } catch (error) {
      console.error(err);
    }
  }




  useEffect(() => {
    if(!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "mumbai",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
      getOwner();
      checkIfGameStarted();
      setInterval(() => {
        checkIfGameStarted();
      }, 2000);
    }
  }, [walletConnected]);


  const renderButton = () => {
    if(!walletConnected) {
      return(
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }

    if(loading) {
      return <button className={styles.button}>Loading...</button>;
    }

    if (gameStarted) {
      if (players.length === maxPlayers) {
        return (
          <button className={styles.button} disabled>
            Choosing winner...
          </button>
        );
      }
    
    return (
      <div>
        <button className={styles.button} onClick={joinGame}>
          Join Game 🚀
        </button>
      </div>
    );
  }
    if(isOwner && !gameStarted) {
      return (
        <div>
          <input
            type="number"
            className={styles.input}
            onChange={(e) => {
              setEntryFee(
                e.target.value >= 0 ? 
                utils.parseEther(e.target.value.toString())
                : zero
              );
            }}
        placeholder="Entry Fee (ETH)"
        />
        <input
          type="number"
          className={styles.input}
          onChange={(e) => {
            setMaxPlayers(e.target.value ?? 0);
          }}
          placeholder="Max players"
          />
          <button className={styles.button} onClick={startGame}>
            Start Game 🚀
          </button>
        </div>
      );
    }
  };

  return(
    <div>
      <Head>
        <title>LW3 Punks</title>
        <meta name="description" content="LW3Punks-Dapp"/>\
        <link rel="icon" href="/favicon.ico" />
      </Head>
    <div className={styles.main}>
      <div>
        <h1 className={styles.title}> Welcome to Random Winner Game!</h1>
        <div className={styles.description}>
        Its a lottery game where a winner is chosen
      </div>
    </div>
    
    
    
    
    
    
    
    
    
    </div>
  )












}




