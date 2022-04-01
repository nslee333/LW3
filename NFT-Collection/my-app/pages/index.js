import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useRef, useState, useEffect } from 'react';
import Web3Modal from "web3modal";
import { Contract, providers } from "ethers";



export default function Home() {
  const [walletConnected, setWalletConnected ] = useState(false);
  const web3ModalRef = useRef();
  
  
    

const checkIfPresaleStarted = async () => {
  const presaleStarted = await 
}









  const connectWallet =  async() => {
    await getProviderOrSigner();
    setWalletConnected(true);
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
  
  
    useEffect(() => {
    if(!walletConnected) { // If walletConnected = false, run this code.
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false,
      }); // This line is creating a new instance of the Web3modal library and giving it arguments to do so.
    
    connectWallet();
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
