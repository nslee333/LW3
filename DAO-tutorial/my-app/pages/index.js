import { Contract, providers} from "ethers";
import { formatEther } from "ethers/lib/utils";
import Head from 'next/head'
import {useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import {
  CRYPTODEVS_DAO_ABI,
  CRYPTODEVS_DAO_CONTRACT_ADDRESS,
  CRYPTODEVS_NFT_ABI,
  CRYPTODEVS_NFT_CONTRACT_ADDRESS
} from "../constants";
import styles from '../styles/Home.module.css'

export default function Home() {
  const [treasuryBalance, setTreasuryBalance] = useState("0");
  const [numProposals, setNumProposals] = useState("0");
  const [proposals, setProposals] = useState([]);
  const [nftBalance, setNftBalance] = useState(0);
  const [fakeNftTokenId, setFakeNftTokenId] = useState("");
  const [selectedTab, setSelectedTab] = useState("");
  const [loading, setLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();

  const connnectWallet = async() => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (error) {
      console.error(error)
    }
  };

  const getTreasuryBalance = async () => {
    try {
      const provider = await getProviderOrSigner();

      const balance = await provider.getBalance(
          CRYPTODEVS_DAO_CONTRACT_ADDRESS,  
      );

      setTreasuryBalance(balance.toString()); 
    } catch (error) {
     console.error(error) 
    }
  };

  const getNumOfProposalsInDAO = async () => {
    try {    
      const provider = await getProviderOrSigner();
      const contract = getDaoInstance(provider);
      const _numProposals = await contract.numProposals();
      setNumProposals(_numProposals.toString());
    } catch (error) {
      console.error(error)
    }
  }

  const getUserNftBalance = async () => {
    try {
      
      const signer = await getProviderOrSigner(true);
      const contract = getNftInstance(signer);
      const balance = await contract.balanceOf(signer.getAddress());
      setNftBalance(parseInt(balance.toString()));




    } catch (error) {
      console.error(error)
    }
  }

  const createProposal = async (_tokenId) => {
    try {
      
      const signer = await getProviderOrSigner(true);
      const contract = getDaoInstance(signer);

      const proposal = await contract.createProposal(_tokenId);

      setLoading(true);
      await proposal.wait();
      await getNumOfProposalsInDAO();
      setLoading(false);
    } catch (error) {
      console.error(error)
      window.alert(error.data.message);
    }
  };

  const fetchProposalById = async (id) => {
    try {
      
      const provider = await getProviderOrSigner();
      const contract = getDaoInstance(provider);
      const proposalId = await contract.proposal(id);
      


    } catch (error) {
      console.error(error)
    }

  }





  // Vote on the proposal.

  // 














const getDaoInstance = (providerOrSigner) => {
  return new Contract(
    CRYPTODEVS_DAO_CONTRACT_ADDRESS,
    CRYPTODEVS_DAO_ABI,
    providerOrSigner
  );
};

const getNftInstance = (providerOrSigner) => {
  return new Contract(
    CRYPTODEVS_NFT_CONTRACT_ADDRESS,
    CRYPTODEVS_NFT_ABI,
    providerOrSigner
  );
};


}
