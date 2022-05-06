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
  console.log(CRYPTODEVS_DAO_CONTRACT_ADDRESS);
  const [treasuryBalance, setTreasuryBalance] = useState("0");
  const [numProposals, setNumProposals] = useState("0");
  const [proposals, setProposals] = useState([]);
  const [nftBalance, setNftBalance] = useState(0);
  const [fakeNftTokenId, setFakeNftTokenId] = useState("");
  const [selectedTab, setSelectedTab] = useState("");
  const [loading, setLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();



  const connectWallet = async() => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (error) {
      console.error(error);
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
     console.error(error); 
    }
  };

  const getNumOfProposalsInDAO = async () => {
    try {    
      const provider = await getProviderOrSigner();
      const contract = getDaoInstance(provider);
      const _numProposals = await contract.numProposals();
      setNumProposals(_numProposals.toString());
    } catch (error) {
      console.error(error);
    }
  }

  const getUserNftBalance = async () => {
    try {
      
      const signer = await getProviderOrSigner(true);
      const contract = getNftInstance(signer);
      const balance = await contract.balanceOf(signer.getAddress());
      setNftBalance(parseInt(balance.toString()));




    } catch (error) {
      console.error(error);
    }
  };

  const createProposal = async () => {
    try {
      
      const signer = await getProviderOrSigner(true);
      const contract = getDaoInstance(signer);

      const proposal = await contract.createProposal(fakeNftTokenId);

      setLoading(true);
      await proposal.wait();
      await getNumOfProposalsInDAO();
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProposalById = async (id) => {
    try {
      
      const provider = await getProviderOrSigner();
      const contract = getDaoInstance(provider);
      const proposal = await contract.proposals(id);
      const parsedProposal = { // This is a JS object that takes the properties of the returned proposal and then inputs them as values.
        proposalId: id,
        nftTokenId: proposal.nftTokenId.toString(),
        deadline: new Date(parseInt(proposal.deadline.toString()) * 1000),
        yayVotes: proposal.yayVotes.toString(),
        nayVotes: proposal.nayVotes.toString(),
        executed: proposal.executed, 
      };
      return parsedProposal; // Returning the proposal JS object.
    } catch (error) {
      console.error(error);
    }

  }

  const fetchAllProposals = async () => { // This is looping through all of the proposals, then pushing the parsed proposals to the proposal array.
    try {
      const proposals = []; // Array
      for (let i = 0; i < numProposals; i++) {
        const proposal = await fetchProposalById(i);
        proposals.push(proposal);
      }
      setProposals(proposals); // Updating the proposals hook with the parsed proposal array (react hook is initialized as an array )
      return proposals; // Return all of the contents in the proposal array.

    } catch (error) {
      console.error(error);
    }
  }


  const voteOnProposal = async (proposalId, _vote) => {
    try {
      const signer = await getProviderOrSigner(true);
      const contract = getDaoInstance(signer);

      let vote = _vote === "YAY" ? 0 : 1; // If _vote === "YAY"? (yes => 0, else 1(NAY))
      const txn = await contract.voteOnProposal(proposalId, vote);
      setLoading(true);
      await txn.wait();
      setLoading(false);
      await fetchAllProposals(); // Update all proposals.

    } catch (error) {
      console.error(error);
      window.alert(error.data.message);
    }

  }

  // Vote on the proposal.

  // 




  const executeProposal = async (proposalId) => {
    try {
      const signer = await getProviderOrSigner(true);
      const contract = getDaoInstance(signer);
      const txn = await contract.executeProposal(proposalId);
      setLoading(true);
      await txn.wait();
      setLoading(false);
      await fetchAllProposals(); // Update the proposals.
    } catch (error) {
      console.error(error);
      window.alert(error.data.message);
    }
  };
 
  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const {chainId} = await web3Provider.getNetwork();
    if (chainId !== 4) {
      window.alert("Please switch to the Rinkeby network");
      throw new Error("Please switch to the Rinkeby network");
    }
    
    if(needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };


  const getDaoInstance = (providerOrSigner) => { // This is crating an instance of contracts for our use.
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

  useEffect(() => {
    if(!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false,
      });

      connectWallet().then(() => {
        getTreasuryBalance();
        getUserNftBalance();
        getNumOfProposalsInDAO();
      });
    }
  }, [walletConnected]);


  useEffect(() => {
    if(selectedTab === "View Proposals") {
      fetchAllProposals();
    }
  }, [selectedTab]);


  function renderTabs() {
    if (selectedTab === "Create Proposal") {
      return renderCreateProposalTab();
    } else if (selectedTab === "View Proposals") {
      return renderViewProposalsTab();
    }
    return null;
  }

  function renderCreateProposalTab() {
    if(loading) {
      return (
        <div className={styles.description}>
          Loading... Waiting for transaction...
        </div>
      );
    } else if (nftBalance === 0) {
      return (
        <div className={styles.description}>
          You do not own any Crypto Dev NFTs. <br />
          <b> You cannot create or vote on any proposals</b>
        </div>
      );
    } else {
      return (
        <div className={styles.container}>
          <label> Fake NFT Token ID to Purchase: </label>
          <input
            placeholder="0"
            type="number"
            onChange={(e) => setFakeNftTokenId(e.target.value)} // onChange(input entered) = event => setFakeNftTokenId(tokenId)
            />
            <button className={styles.button2} onClick={createProposal}>
              Create
            </button>
        </div>
      );
    }
  }

  function renderViewProposalsTab() {
    if(loading) {
      return(
        <div className={styles.description}>
          Loading... Waiting for transaction...
        </div>
      );      
    } else if (proposals.length === 0) {
      return(
        <div className={styles.description}>
          No Proposals have been created.
        </div>
      );
    } else {
      return(
        <div>
          {proposals.map((p, index) => (
            console.log(p.yayVotes),
            console.log(p.nayVotes),
            <div key={index} className={styles.proposalCard}>
              <p>Proposal ID: {p.proposalId}</p>
              <p>Fake NFT to Purchase: {p.nftTokenId}</p>
              <p>Deadline:  {p.deadline.toLocaleString()}</p>
              <p>Yay Votes: {p.yayVotes}</p>
              <p>Nay Votes: {p.nayVotes}</p>
              <p>Executed?: {p.executed.toString()}</p>
              {p.deadline.getTime() > Date.now() && !p.executed ? (
                <div className={styles.flex}>
                  <button 
                    className={styles.button2}
                    onClick={() => voteOnProposal(p.proposalId, "YAY")}>
                  Vote YAY
                  </button>
                  <button 
                    className={styles.button2}
                    onClick={() => voteOnProposal(p.proposalId, "NAY")}>
                    Vote NAY
                  </button>
                </div>
              ) : p.deadline.getTime() < Date.now() && !p.executed ? (
                <div className={styles.flex}>
                  <button
                    className={styles.button2}
                    onClick={() => executeProposal(p.proposalId)}
                    >
                      Execute Proposal{" "}
                      {p.yayVotes > p.nayVotes ? "(YAY)" : "(NAY)"}
                    </button>
                  </div>
                ) : (
                  <div className={styles.description}> Proposal Executed </div>
                )}
            </div>
          ))}
        </div>
      );
    }
  }

  return (
    <div>
      <Head>
        <title>CryptoDevs DAO</title>
        <meta name="description" content="Crypto Devs DAO" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome To Crypto Devs!</h1>
          <div className={styles.description}>Welcome to the DAO!</div>
          <div className={styles.description}>
            Your CryptoDevs NFT Balance: {nftBalance}
            <br />
            Treasury Balance: {formatEther(treasuryBalance)} ETH
            <br />
            Total Number of Proposals: {numProposals}
        </div>
        <div className={styles.flex}>
          <button
            className={styles.button}
            onClick={() => setSelectedTab("Create Proposal")}
            >
              Create Proposal
          </button>
          <button
            className={styles.button}
            onClick={() => setSelectedTab("View Proposals")}
          >
            View Proposals
          </button>
        </div>
        {renderTabs()}
      </div>
      <div>
      <img className={styles.image} src="/18.svg"/>
      </div>
    </div>
   
    <footer className={styles.footer}>
      Made with &#10084; by Nathan Lee
    </footer>
  </div>
  );
}



  

