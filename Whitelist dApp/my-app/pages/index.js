import Head from "next/head";
import Image from 'next/image';
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import Web3Modal from "web3modal"; 

export default function Home() {
    const [walletConnected, setWalletConnected] = useState(false);
    const [numOfWhitelisted, setNumOfWhitelisted] = useState(0);
    //  This is linking up the numOfWhitelisted to the react state. 
    const web3ModalRef = useRef();


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