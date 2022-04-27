// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IFakeNFTMarketplace {
    function getPrice() external view returns (uint256);

    function available(uint256 _tokenId) external view returns (bool);

    function purchase(uint256 _tokenId) external payable;

}

interface ICryptoDevsNFT {
    function balanceOf(address owner) external view returns (uint256);

    function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256);

}

contract CryptoDevsDao is Ownable {

    IFakeNFTMarketplace nftMarketplace;
    ICryptoDevsNFT cryptoDevsNFT;


    mapping(uint256 => Proposal) public proposals;

    uint256 public numProposals;

    struct Proposal {
        uint256 nftTokenId;

        uint256 deadline;

        uint256 yayVotes;

        uint256 nayVotes;

        bool executed;

        mapping(uint256 => bool) voters;
    }

    constructor(address _nftMarketplace, address _cryptoDevsNFT) payable {
        nftMarketplace = IFakeNFTMarketplace(_nftMarketplace);
        cryptoDevsNFT = ICryptoDevsNFT(_cryptoDevsNFT);
    }

    modifier nftHolderOnly() {
        require(cryptoDevsNFT.balanceOf(msg.sender) > 0, "NOT_A_DAO_MEMBER");
        _;
    }

    modifier activeProposalOnly(uint256 proposalIndex) {
        require(
            proposals[proposalIndex].deadline > block.timestamp,
            "DEADLINE_EXCEEDED"
        );
        _;
    }

    function createProposal(uint256 _nftTokenId) 
        external 
        nftHolderOnly 
        returns (uint256) 
    {
        require(nftMarketplace.available(_nftTokenId), "NFT_NOT_FOR_SALE");
        Proposal storage proposal = proposals[numProposals];
        proposal.nftTokenId = _nftTokenId;
        proposal.deadline = block.timestamp + 5 minutes;

        numProposals++;
        // We have to return the ID of the proposal, that's why we subtract from the number of proposals, since we added to it.
        // 32:55
        return numProposals - 1;
    } // The only way this makes sense to me is that numProposals++ adds to the state variable, 
    // and the return numProposals -1 is returning the index position of the proposal 

    enum Vote {
        YAY,
        NAY        
    } // enums help us to predefine the only values a variable can take, 
    // Making sure that people don't vote something else other than yes or no.
    

    function voteOnProposal(uint256 proposalIndex, Vote vote) external nftHolderOnly activeProposalOnly(proposalIndex) {
        Proposal storage proposal = proposals[proposalIndex]; // Come back to this 

        uint256 voterNFTBalance = cryptoDevsNFT.balanceOf(msg.sender);
        uint256 numVotes = 0;

        for(uint256 i = 0; i < voterNFTBalance; i++) {
            uint256 tokenId = cryptoDevsNFT.tokenOfOwnerByIndex(msg.sender, i);
            if(proposal.voters[tokenId] == false) {
                numVotes++;
                proposal.voters[tokenId] = true;
            }
        }
        require(numVotes > 0, "ALREADY_VOTED");

        if (vote == Vote.YAY) {
            proposal.yayVotes += numVotes;
        } else {
            proposal.nayVotes += numVotes;
        }
    }

    modifier inactiveProposalOnly(uint256 proposalIndex) {
        require(
            proposals[proposalIndex].deadline <= block.timestamp, "DEADLINE_NOT_EXCEEDED"
            );
        require (
            proposals[proposalIndex].executed == false,
            "PROPOSAL_ALREADY_EXECUTED"
        );
        _;
    }

    function executeProposal(uint256 proposalIndex)
        external
        nftHolderOnly
        inactiveProposalOnly(proposalIndex)
        {
            Proposal storage proposal = proposals[proposalIndex];
            if(proposal.yayVotes > proposal.nayVotes){
                uint256 nftPrice = nftMarketplace.getPrice();
                require(address(this).balance >= nftPrice, "NOT_ENOUGH_FUNDS");
                nftMarketplace.purchase{value: nftPrice}(proposal.nftTokenId);
                
            } else {
                proposal.executed = true;
            }
        }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    receive() external payable {}
    
    fallback() external payable {}

}