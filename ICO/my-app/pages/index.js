import { BigNumber, Contract, ethers, providers, utils} from "ethers";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import {
    NFT_CONTRACT_ABI,
    NFT_CONTRACT_ADDRESS,
    TOKEN_CONTRACT_ABI,
    TOKEN_CONTRACT_ADDRESS,
} from "../constants";
import styles from "../styles/Home.module.css";

export default function Home() {
        const zero = BigNumber.from(0);
        // This is setting it as a BigNumber
        const [walletConnected, setWalletConnected] = useState(false);
        const [loading, setLoading] = useState(false);
        const [tokensToBeClaimed, setTokensToBeClaimed] = useState(zero);
        // tokensToBeClaimed keeps track of the number of tokens that can be claimed.
        // Based on the crypto dev NFT's held by the user for which they haven't claimed the tokens
        const [balanceOfCryptoDevTokens, setBalanceOfCryptoDevTokens] = useState(zero);
        // Keeps track of the number of crypto dev tokens by an address.
        const [tokenAmount, setTokenAmount] = useState(zero);
        // Amount of tokens that the user wants to mint.
        const [tokensMinted, setTokensMinted] = useState(zero);
        const web3ModalRef = useRef();

        const getTokensToBeClaimed = async () => {
            try {
                
                const provider = await getProviderOrSigner();

                const nftContract = new Contract(
                    NFT_CONTRACT_ADDRESS,
                    NFT_CONTRACT_ABI,
                    provider
                );

                const tokenContract = new Contract(
                    TOKEN_CONTRACT_ADDRESS,
                    TOKEN_CONTRACT_ABI,
                    provider,
                );

                const signer = await getProviderOrSigner(true);

                const address = await signer.getAddress();

                const balance = await nftContract.balanceOf(address);

                if (balance === zero) {
                    setTokensToBeClaimed(zero);
                } else {
                    var amount = 0;

                    for (var i = 0; i < balance; i++) {
                        const tokenId = await nftContract.tokenOfOwnerByIndex(address, i);
                        const claimed = await tokenContract.tokenIdsClaimed(tokenId);
                        if(!claimed) {
                            amount++;
                        }
                    }

                    setTokensToBeClaimed(BigNumber.from(amount));
                }
                
            } catch (error) {
                console.error(error)
                setTokensToBeClaimed(zero);
            }


        const getBalanceOfCryptoDevTokens = async () => {

            try {
                const provider = await getProviderOrSigner();

                const tokenContract = new Contract(
                    TOKEN_CONTRACT_ADDRESS,
                    TOKEN_CONTRACT_ABI,
                    provider
                );

                const signer = await getProviderOrSigner(true);

                const address = await signer.getAddress(signer);

                const balance = await tokenContract.balanceOf(address);

                setBalanceOfCryptoDevTokens(balance);
            } catch (error) {
                console.error(error);
                setBalanceOfCryptoDevTokens(zero);   
            }

        }

        // Confused on amount, value of mint.
        const mintCryptoDevToken = async (amount) => {
            try {
                
                const signer = getProviderOrSigner(true);

                const tokenContract = new Contract(
                    TOKEN_CONTRACT_ADDRESS,
                    TOKEN_CONTRACT_ABI,
                    signer
                );

                const value = 0.001 * amount;
                const tx = await tokenContract.mint(amount, {
                    value: utils.parseEther(value.toString()),
                });

                setLoading(true);
                await tx.wait();
                setLoading(false);
                
                window.alert("Successfully minted Crypto Dev Tokens");

                await getBalanceOfCryptoDevTokens();
                await getTotalTokensMinted();
                await getTokensToBeClaimed();

            } catch (error) {
                console.error(error);
            }
        };

    const claimCryptoDevTokens = async () => {
        try {
                
            const signer = getProviderOrSigner(true);

            const tokenContract = new Contract(
                TOKEN_CONTRACT_ADDRESS,
                TOKEN_CONTRACT_ABI,
                signer
            );

            const tx = await tokenContract.claim();

            setLoading(true);
            await tx.wait();
            setLoading(false);

            window.alert("Successfully claimed Crypto Dev Tokens");

            await getBalanceOfCryptoDevTokens();
            await getTotalTokensMinted();
            await getTokensToBeClaimed();
            
        } catch (error) {
            console.error(error);
        }

    }


    const getTotalTokensMinted = async () => {
        try {
            
            const provider = await getProviderOrSigner();

            const tokenContract = new Contract(
                TOKEN_CONTRACT_ADDRESS,
                TOKEN_CONTRACT_ABI,
                provider
            );

            const _tokensMinted = await tokenContract.totalSupply();
            setTokensMinted(_tokensMinted);a

        } catch (error) {
            console.error(error);
        };
    }

    const getProviderOrSigner = async (needSigner = false) => {
        const provider = await web3ModalRef.current.connect();
        const web3Provider = new providers.Web3Provider(provider);

        const {chainId} = await web3Provider.getNetwork();
        if(chainId !== 4 ) {
            window.alert("Please change the network to Rinkeby");
            throw new Error("Change network to Rinkeby");
        }

        if(needSigner) {
            const signer = web3Provider.getSigner();
            return signer;
        }
        return web3Provider;
    };

    const connectWallet = async () => {
        try {
            await getProviderOrSigner();
            setWalletConnected(true);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(()=> {
        if(!walletConnected) {
            web3ModalRef.current = new Web3Modal({
                network: "rinkeby",
                providerOptions: {},
                disableInjectedProvider: false,
            });
            connectWallet();
            getTotalTokensMinted();
            getBalanceOfCryptoDevTokens();
            getTokensToBeClaimed();
        }
    }, [walletConnected]);

    const renderButton = () => {

        if(loading) {
            return(
                <div>
                    <button className={styles.button}>Loading...</button>
                </div>
            );
        }

        if (tokensToBeClaimed > 0) {
            return(
                <div>
                    <div className={styles.description}>
                        {tokensToBeClaimed * 10} Tokens can be claimed!
                    </div>
                    <button className={styles.button} onClick={claimCryptoDevTokens}>
                        Claim Tokens
                    </button>
                </div>
            );
        }

        return(
            <div style={{ display: "flex-col" }}>
                <div>
                    <input 
                    type="number"
                    placeholder="Amount Of Tokens"
                    onChange={(e) => setTokenAmount(BigNumber.from(e.target.value))}
                    className={styles.input}
                    />
                </div>
                <button
                    className={styles.button}
                    disabled={!(tokenAmount > 0)}
                    onClick={() => mintCryptoDevToken(tokenAmount)}
                >
                    Mint Tokens0
                </button>
            </div>
        );
    };

    return (
        <div>
            <Head>
                <title>Crypto Devs</title>
                <meta name="description" content="ICO-Dapp"/>
            </Head>
            <div className={styles.main}>
                <div>
                    <h1 className={styles.title}>Welcome to Crypto Devs</h1>
                    <div className={styles.description}>
                        You can claim or mint Crypto Dev tokens here.
                    </div>
                    {walletConnected ? (
                        <div>
                            <div className={styles.description}>
                                Overall {utils.formatEther(tokensMinted)}/10000 have been minted!
                            </div>
                            {renderButton()}
                        </div>
                    ) : (
                        <button onClick={connectWallet} className={styles.button}>
                            Connect your wallet
                        </button>
                    )}
                </div>
                <div>
                        <img className={styles.image}src="./0.svg"/>
                </div>
            </div>
            <footer className={styles.footer}>
                Made with &#100084; by Nathan Lee
            </footer>
        </div>
    );
}}


















