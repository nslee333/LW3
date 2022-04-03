import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useRef, useState, useEffect } from 'react';
import Web3Modal from "web3modal";
import { Contract, providers, utils } from "ethers";
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from '../constants'



export default function Home() {
  const [walletConnected, setWalletConnected ] = useState(false);
  const [presaleStarted, setPresaleStarted] = useState(false);
  const [presaleEnded, setPresaleEnded] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [numTokensMinted, setNumTokensMinted] = useState("");
  const [loading, setLoading] = useState(false);
  const web3ModalRef = useRef();
  


  const getNumMintedTokens = async () => {
    try {
      const provider = await getProviderOrSigner();

      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        provider
      )

      const numTokenIds = nftContract.tokenIds();
      // This will return a BigNumber, so we're converting it to a string
      // So that we can accept the uint256 value.
      setNumTokensMinted(numTokenIds.toString());


    } catch (error) {
      console.error(error)
    }
  }




  const presaleMint = async () => {
    setLoading(true);
    try {
      const signer = await getProviderOrSigner(true);

      const nftContract = new Contract (
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        signer
      );
     
      const txn = await nftContract.presaleMint({
        value: utils.parseEther("0.01"),
      });
      await txn.wait();

      window.alert("You successfully minted a CryptoDev!");

    } catch (error) {
      console.error(error)
    }
    setLoading(false);
  }



  const publicMint = async () => {
    setLoading(true);
    try {
      const signer = await getProviderOrSigner(true);

      const nftContract = new Contract (
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        signer
      );
     
      const txn = await nftContract.mint({
        value: utils.parseEther("0.01"),
      });
      await txn.wait();

      window.alert("You successfully minted a CryptoDev!");

    } catch (error) {
      console.error(error)
    }
    setLoading(false);
  }
  
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

      const hasPresaleEnded = presaleEndTime.lt(
        Math.floor(currentTimeInSeconds)
        );
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

      const owner = await nftContract.owner();
      // Owner of the contract.
      const userAddress = await signer.getAddress();
      // Address of the user who is currently connected to the dapp.

      if (userAddress.toLowerCase() === owner.toLowerCase()) {
        setIsOwner(true);
      }
      
    } catch (error) {
      console.error(error)
    }
  }


  const startPresale = async () => {
    setLoading(true);
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
    setLoading(false);
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
    await getOwner();
    const presaleStarted = await checkIfPresaleStarted();
    if (presaleStarted) {
      await checkIfPresaleEnded(); 
    }
    // The reason for the if statement is that all integers in solidity are given the initial value of 0.
    // In this case presaleEnded is an integer, until the presale starts, it will have the value of 0.
    // In our checkIfPresaleEnded function our less than number logic will always equal 
    // True since an unsigned integer is always bigger than zero.

    await getNumMintedTokens();
          
    // Track in real time the number of minted tokens.
    // setInterval is a function in JS that helps us to check something
    // everytime a time interval passes.
    setInterval(async() =>{
      await getNumMintedTokens();
    }, 5 * 1000);
    // Also keep in mind, JS time is in miliseconds, so we have to multiply
    // 5 * 1000 to get 5 second interval time.

    // Track in real time the status of the presale (started, ended)
    setInterval(async()=>{
      const presaleStarted = await checkIfPresaleStarted();
      if(presaleStarted) {
        await checkIfPresaleEnded();
      }
    }, 5 * 100);

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


    function renderBody() {
      if (!walletConnected) {
        return (
          <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
          </button>
        );
      }




      if (loading) {
        return <button className={styles.button}>Loading...</button>;
      }





      if(isOwner && !presaleStarted) {
        // Render a button to start the presale.
        return (
          <button className={styles.button} onClick={startPresale}>
            Start Presale!
          </button>
        );
      }

      if(!presaleStarted) {
        // Just say that the presale has not started yet, come back later.
      return (
        <div>
          <div className={styles.description}>
            Presale has not started yet, come back later!
          </div>
        </div>
      );
    }
      
      if(presaleStarted && !presaleEnded) {
        // Allow whitelisted addresses to mint tokens.
        // Need to be in whitelist to work.
        return (
          <div>
            <div className={styles.description}>
              Presale has started! If your address is whitelisted, you can mint a 
              Crypto Dev 🥳
            </div>
            <button className={styles.button} onClick={presaleMint}>
              Presale Mint 🚀
            </button>
          </div>
        );
      }
    
      if(presaleStarted && presaleEnded) {
        // Render a button to mint the tokens.
        return (
          <div>
            <div className={styles.description}>
              Presale has ended.
              You can mint a CryptoDev in public sale, 
              if any remain.
            </div>
            <button className={styles.button} onClick={publicMint}>
              Public Mint
            </button>
          </div>
        );
      }
    }



  return (
    <div>
      <Head>
        <title>Crypto Devs NFT</title>
      </Head>

      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
          <div className={styles.description}>
            CryptoDevs NFT is a collection for Developers in Web3 
          </div>
          <div className={styles.description}>
            {getNumMintedTokens}/20 have been minted already!
          </div>
        <div>
        {renderBody()}
      </div>  
        
      </div>
        <img className={styles.image} src="/cryptodevs/0.svg"/>
      </div>


      <footer className={styles.footer}>
        Made with &#10084; by Nathan Lee
      </footer>
    </div>
  );
}
