// SPDX-licence-Idenitifier: MIT
pragma solidity 0.8.0;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import './IWhitelist.sol';

contract CryptoDevs is ERC721Enumerable, Ownable {
    
    string _baseTokenURI;
    IWhitelist whitelist;

    bool public presaleStarted;

    uint256 public presaleEnded;

    uint256 public maxTokenIds = 20;
    
    uint256 public tokenIds;

    uint256 public _price = 0.01 ether;


    constructor(string memory _baseURI, address whitelistContract) ERC721("Crypto Devs", "CD") {
       _baseTokenURI = _baseURI;
       whitelist = IWhitelist(whitelistContract);
    }

    function startPresale() public onlyOwner {
        presaleStarted = true;
        presaleEnded = block.timestamp + 5 minutes;
    }

    function presaleMint() public payable {
        require(presaleStarted && block.timestamp < presaleEnded, "Presale ended");
        require(whitelist.whitelistedAddresses(msg.sender), "You're not in the whitelist");
        require(tokenIds < maxTokenIds, "Exceeded the limit);
        require(msg.value >= _price, "Ether sent is not correct");

        tokenIds += 1;

        _safeMint(msg.sender, tokenIds);
    }


    function mint() public payable {
        require(presaleStarted && block.timestamp >= presaleEnded, "Presale has not ended yet");
        require(tokenIds < maxTokenIds, "Exceeded the limit");
        require(msg.value >= _price, "Ether sent is not correct");


        tokenIds += 1;

        _safeMint(msg.sender, tokenIds);
    }


    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI; 
    }


    function withdraw() public onlyOwner {
        address _owner = owner();
        uint256 amount = address(this).balance;
        (bool sent, ) = _owner.call{value: amount}("");
        require(sent, "Failed to send ether.")
    }



    receive() external payable {}

    fallback() external payable {}



}