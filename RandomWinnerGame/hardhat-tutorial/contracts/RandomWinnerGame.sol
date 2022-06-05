//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract RandomWinnerGame is VRFConsumerBase, Ownable {

    uint256 public fee; // The amount of LINK to send with the request.

    bytes32 public keyHash; // ID of public key against which randomness is generated.

    address[] public players; // The Address array of the players.abi

    uint8 maxPlayers; // The maximum number of players

    bool public gameStarted; // Boolean of if the game has started.

    uint256 entryFee; // The the amount of the entry Fee for entry in the game.

    uint256 public gameId; // The ID of the game.



    event GameStarted(uint256 gameId, uint8 maxPlayers, uint256 entryFee ); // Event that the game has started.

    event PlayerJoined(uint256 gameId, address player); // An event that triggers everty time a player joins a game.

    event GameEnded(uint256 gameId, address winner, bytes32 requestId); // An event that triggers when the game ends.

    constructor
    (
    address vrfCoordinator, // VRF coordinator contract address
    address linkToken,  // Address of the Link token contract address.
    bytes32 vrfKeyHash, // vrfKeyHash ID of the public key against which randomness is generated.
    uint256 vrfFee // The amount of link to send with the request.
    )
    VRFConsumerBase(vrfCoordinator, linkToken) { // Creating an instance of the VRFConsumerBase Chainlink contract.
    // Passing in all of the arguments for creating the instance.
        keyHash = vrfKeyHash;
        fee = vrfFee;
        gameStarted = false;
    }

    function startGame(uint8 _maxPlayers, uint256 _entryFee) public onlyOwner {

        require(!gameStarted, "Game is currently running"); // Check if the game has started.

        delete players; // Empty the players array.

        maxPlayers = _maxPlayers; // Setting the maxPlayers to the value passed in as an argument.

        gameStarted = true; // Set game started to true.

        entryFee = _entryFee; // Setting the entryFee to the value passed in.

        gameId += 1; // Add 1 count to the gameId state variable.

        emit GameStarted(gameId, maxPlayers, entryFee); // Emit the gameStarted event.

    }

    function joinGame() public payable {

        require(gameStarted, "Game has not started yet");

        require(msg.value == entryFee, "Value sent is not equal to the entry fee.");

        require(players.length < maxPlayers, "Game is full");

        players.push(msg.sender);

        emit PlayerJoined(gameId, msg.sender);

        if(players.length == maxPlayers) {
            getRandomWinner();
        }
     }

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal virtual override {

        // We want out winners Index to be in the length from 0 to players.length - 1.
        // For this we need to mod it with the player.length value
        uint256 winnerIndex = randomness % players.length;
        // Get the address of the winner from the players array.
        address winner = players[winnerIndex];
        // Send the ether in the contract to the winner.
        (bool sent,) = winner.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
        
        emit GameEnded(gameId, winner, requestId);

        gameStarted = false;
    }

    function getRandomWinner() private returns (bytes32 requestId) {
        // Require that  the balance of LINK in the contract is enough to request for randomness.
        require(LINK.balanceOf(address(this)) >= fee, "Not Enough LINK");
        // requestRandomness is a VRFConsumerBase function that starts the process of randomness generation.
        return requestRandomness(keyHash, fee);
    }


    receive() external payable {}

    fallback() external payable {}
    
}