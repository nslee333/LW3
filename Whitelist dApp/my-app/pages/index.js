import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useState, useRef } from "react";
import Web3Modal from "web3modal"; 
import { Contract, providers } from "ethers";
import { WHITELIST_CONTRACT_ADDRESS, abi } from "../constants";

export default function Home() {
    const [walletConnected, setWalletConnected] = useState(false);
    const [numOfWhitelisted, setNumOfWhitelisted] = useState(0); 
    const web3ModalRef = useRef();
    const [joinedWhitelist, setJoinedWhitelist] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // @param {*} needSigner
    
    // done
    const getProviderOrSigner = async(needSigner = false) => {
        try {
            const provider = await web3ModalRef.current.connect();
            const web3Provider = new providers.Web3Provider(provider);
            // This current.connect from web3Modal returns the provider.

            const { chainId } = await web3Provider.getNetwork();
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

    const addAddressToWhitelist = async () => {
        try {
            const signer = await getProviderOrSigner(true);
            
            const whitelistContract = new Contract (
                WHITELIST_CONTRACT_ADDRESS,
                abi,
                signer
            );

            const tx = await whitelistContract.addAddressToWhitelist();

            setLoading(true);
            await tx.wait();
            setLoading(false);
            await getNumberOfWhitelisted();
            setJoinedWhitelist(true);
            


        } catch(err) {
            console.error(err)
        }
    }

// done
    const checkIfAddressIsWhitelisted = async() => {
        try {
            const signer = await getProviderOrSigner(true);
            // This is returning the signer instead of the provider.
            const whitelistContract = new Contract (
                WHITELIST_CONTRACT_ADDRESS,
                abi,
                signer
            );
            const address = await signer.getAddress();
            const _joinedWhitelist = await whitelistContract.whitelistedAddresses(
                address
            );
            setJoinedWhitelist(_joinedWhitelist);

            // if (_joinedWhitelist = true) {
            //     window.alert("You are already on the whitelist.")
            // };

        } catch(err) {
            console.error(err);
        }
    }


    const getNumberOfWhitelisted = async() => {
        try {
            const provider = await getProviderOrSigner();

            const whitelistContract = new Contract (
                WHITELIST_CONTRACT_ADDRESS,
                abi,
                provider
            );
            const _numberOfWhitelisted = await whitelistContract.numAddressesWhitelisted();
            setNumOfWhitelisted(_numberOfWhitelisted);

        } catch(err) {
            console.error(err);
        }
    }

    const renderButton = () => {
        if(walletConnected) {
            if (joinedWhitelist) {
                return (
                    <div className={styles.description}>
                        Thanks for joining the whitelist. 
                    </div>
                );
            } else if (loading) {
                return <button className = {styles.button}>Loading...</button>;
            } else {
                return (
                    <button onClick={addAddressToWhitelist} className = {styles.button}>
                        Join the Whitelist
                    </button>
                );
            }
        } else {
            return (
            <button onClick={connectWallet} className = {styles.button}>
                Connect your Wallet
            </button>
            );
        }
    }

// done
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

// done
    useEffect(() => {
        if (!walletConnected) {{
            web3ModalRef.current = new Web3Modal({
                network: "rinkeby",
                providerOptions: {},
                disabledInjectedProvider: false,
            });
            connectWallet();
        }}
    }, [walletConnected]);

    return (
        <div>
        <Head>
          <title>Whitelist Dapp</title>
          <meta name="description" content="Whitelist-Dapp" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className={styles.main}>
          <div>
            <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
            <div className={styles.description}>
              Its an NFT collection for developers in Crypto.
            </div>
            <div className={styles.description}>
              {numOfWhitelisted} have already joined the Whitelist
            </div>
            {renderButton()}
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