require("@nomiclabs/hardhat-waffle");

// Requiring hardhat waffle library to run this code.

require("dotenv").config({ path: ".env"});

// Requiring the .env library to run this code.

const ALCHEMY_API_KEY_URL = process.env.ALCHEMY_API_KEY_URL;

// Assigning a variable to api key that is at the .env file.

const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY;

// Assigning a variable to the rinkeby private key in the .env file.

module.exports = {
// exporting this config files.

  solidity: "0.8.4",
    // Solidity version 
  networks: {
    rinkeby: {
      url: ALCHEMY_API_KEY_URL,
      accounts: [RINKEBY_PRIVATE_KEY]
    },
  },
};
