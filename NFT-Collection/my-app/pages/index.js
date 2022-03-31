import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {useState, useEffect } from 'react';



export default function Home() {
  const [walletConnected, setWalletConnected ] = useState(false);

  
  
  async function getProviderOrSigner(needSigner = false) {
      try{
          const provider = await web3ModalRef.current.connect();
          const web3Provider = new providers.web3Provider(provider);

          const { chainId } = await web3Provider.getNetwork;
          if (chainId !== 3) {
            window.alert("Please change your network to Rinkeby.");
            throw new Error("Please change your network to Rinkeby.");
          
          } 
          if (needSigner) {
            const signer = await web3Provider.getSigner;
            return signer;
          }
          return web3Provider;
      } catch(err) {
        console.error(err);
      }
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  return (
    <div>
    
    </div>
  )
}
