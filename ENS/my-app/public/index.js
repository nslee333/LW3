import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import {ethers, providers} from "ethers";
import {useEffect, useRef, useState} from "react";


export default function Home() {

  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();
  const [ens, setENS] = useState("");
  const [address, setAddress] = useState("");
  






























}