// SPDX-license-identifier: MIT
pragma solidity ^0.8.1;

contract MoodDiary{
    string mood;

    function getMood() public view returns (string memory) {
        return mood;
    }

    function setMood(string memory _mood) public{
        mood = _mood
    }
}