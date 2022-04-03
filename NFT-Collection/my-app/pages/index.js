import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useRef, useState, useEffect } from 'react';
import Web3Modal from "web3modal";
import { Contract, providers } from "ethers";
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from '../constants'



export default function Home() {
  const [walletConnected, setWalletConnected ] = useState(false);
  const web3ModalRef = useRef();
  const [presaleStarted, setPresaleStarted] = useState(false);
  const [presaleEnded, setPresaleEnded] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  
  
  
  const checkIfPresaleEnded = async () => {
    try {
      const provider = await getProviderOrSigner();

      nftContract = new Contract (
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        provider
      );
      
      // This will return a BigNumber because presaleEnded is a uint256 data type.
      // This will return a timestamp in seconds.
      const presaleEndTime = await nftContract.presaleEnded();
      // Date.now in JS returns the time in miliseconds, so we're going to
      // Divide this by 1000 (1000 milliseconds in a second.)
      // Also since we're dividing by 1000 it has the potential to be a float value.
      const currentTimeInSeconds = date.now() / 1000;
      // We're going use bigNumber since JS can't handle numbers the size of 
      // uint256, so we have to use bigNumbers lt() function instead of JS's
      // (>) comparators.
      // We're going to wrap it in a math.floor to make sure its always an integer.

      const hasPresaleEnded = presaleEndTime.lt(Math.floor(currentTimeInSeconds));
      setPresaleEnded(hasPresaleEnded);
      
    } catch (error) {
      console.error(error)
    }
  };




  const getOwner = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      // Getting the provider object.
      const nftContract = new Contract (
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        signer
      );
      // Creating a new instance of the contract using ethers.

      const owner = nftContract.owner();
      // Owner of the contract.
      const userAddress = signer.getAddress();
      // Address of the user who is currently connected to the dapp.

      if (owner.toLowerCase() === userAddress.toLowerCase()) {
        setIsOwner(true);
      }
      
    } catch (error) {
      console.error(error)
    }
  }


  const startPresale = async () => {
    try {
      const signer = await getProviderOrSigner(true);

      const nftContract = new Contract (
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        signer,
      )

      const txn = await nftContract.startPresale();
      await txn.wait();

      PresaleStarted(true);
      
    } catch (error) {
      console.error(error);
    }
  }


  const checkIfPresaleStarted = async () => {
    try {
      const provider = await getProviderOrSigner();
      // Getting the provider object.
      const nftContract = new Contract (
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        provider
      );
      // Creating a new instance of the contract using ethers.

      const isPresaleStarted = await nftContract.presaleStarted();
        // Assigning variable to a boolean value returned from the nft contract.
      setPresaleStarted(isPresaleStarted);
        // Setting the value of the react hook useState with the returned value from
        // The nft contract.

      return isPresaleStarted;
      // Returning the boolean value.
      
    } catch (error) {
      console.error(error);
      return false;
      // If there's an error: return false 
      // - isPresaleStarted(false);
    }
    
  
  }


  const connectWallet =  async() => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (error) {
      console.error(error);
    }

  }
  
  const getProviderOrSigner = async (needSigner = false) => {
    
    const provider = await web3ModalRef.current.connect(); // This line 
    // Will pop open metamask and ask the user to connect their wallet.
    const web3Provider = new providers.Web3Provider(provider);
    // This gives us access to the functions that ethers provides
    
    const { chainId } = await web3Provider.getNetwork();

    if (chainId !== 4) {
      window.alert("Please change your network to Rinkeby");
      throw new Error("Incorrect Network");
    } 

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider; 
    };
  
    // The reason for this function is that checkIfPresaleStarted()
    // Is an async function, and since the useEffect is not an async function
    // We have to create a async function that we'll call in the
    // useEffect function.

    // If we didn't do this presaleStarted wouldn't return a value.

  const onPageLoad = async () => {
    await connectWallet();
    const presaleStarted = await checkIfPresaleStarted();
    if (presaleStarted) {
      await checkIfPresaleEnded();
    }
  }
  
    useEffect(() => {
    if(!walletConnected) { // If walletConnected = false, run this code.
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false,
      }); // This line is creating a new instance of the Web3modal library and giving it arguments to do so.
      onPageLoad();
    }
  }, []) // This will run every time the page loads.

  
  
  return (
    <div>
      <Head>
        <title>Crypto Devs NFT</title>
      </Head>

      <div className={styles.main}>  
        {walletConnected ? null :  (
          <button onClick={connectWallet} className={styles.button}>
            Connect Wallet
          </button>
        )}

        
      </div>
    </div>
  )
}
