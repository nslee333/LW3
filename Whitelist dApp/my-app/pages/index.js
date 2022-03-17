import Head from "next/head";
import Image from 'next/image';
import styles from "../styles/Home.module.css";
import { useEffect, useState, useRef } from "react";
import Web3Modal from "web3modal"; 
import { providers } from "ethers";

export default function Home() {
    const [walletConnected, setWalletConnected] = useState(false);
    const [numOfWhitelisted, setNumOfWhitelisted] = useState(0);
    //  This is linking up the numOfWhitelisted to the react state. 
    const web3ModalRef = useRef();
    
    
    
    const getProviderOrSigner = async(needSigner = false) => {
        try {
            const provider = await web3ModalRef.current.connect();
            const web3Provider = new providers.Web3Provider(provider);
            // This current.connect from web3Modal returns the provider.

            const {chainId} = await web3Provider.getNetwork();
            if(chainId !== 4) {
                window.alert("Change the network to Rinkeby");
                throw new Error("Change the network to Rinkeby");
            }
            if(needSigner) {
                const signer = web3Provider.getSigner();
                return signer;
            }
            return web3Provider;
        } catch(err) {
            console.error(err);
        }
    }




    const checkIfAddressIsWhitelisted = async() => {
        try {

            const signer = getProviderOrSigner(true);
            // This is returning the signer instead of the provider.
            

                
        } catch(err) {
            console.error(err);
        }
    }


    const getNumberOfWhitelisted = async() => {
        try {




        } catch(err) {
            console.error(err);
        }
    }
    


    
    const connectWallet = async() => {
        try {
            await getProviderOrSigner();
            setWalletConnected(true)
            checkIfAddressIsWhitelisted();
            getNumberOfWhitelisted();
        } catch(err) {
            console.error(err)
        }
    }


    useEffect(() => {
        if (!walletConnected) {{
            web3ModalRef.current = new web3Modal({
                network: "rinkeby",
                providerOptions: {},
                disabledInjectedProvider: false,
            });
            connectWallet();
        }}
    }) [walletConnected]

    return (
            <div>
                    <Head>
                        <title> Whitelist dApp </title>
                            <meta name="description" content="Whitelist-Dapp" />
                    </Head>
                    <div className={styles.main}>
                    
                        <h1 className={styles.title}>
                        Welcome to Crypto Devs!
                        </h1>
                        
                            <div className={styles.description}>
                            {numOfWhitelisted} have already joined the Whitelist.
                            </div>
                        <div>
                            <img className={styles.image} src="./crypto-devs.svg" />
                        </div>
                    </div>

                    <footer className={styles.footer}>
                        Made With &#10084; by Nathan Lee 
                    </footer>
            </div>
    )
}