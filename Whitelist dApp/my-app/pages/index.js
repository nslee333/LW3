import Head from "next/head";
import Image from 'next/image';
import styles from "../styles/Home.module.css";
import { useState } from "react";

export default function Home() {

    const [numOfWhitelisted, setNumOfWhitelisted] = useState(0);
    //  This is linking up the numOfWhitelisted to the react state. 

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