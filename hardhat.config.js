require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config();
require('./tasks/donations.js');
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.7.3",
  networks: {
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [process.env.WALLET_PRIVATE_KEY, process.env.WALLET2_PRIVATE_KEY]
    },
    localhost: {
      url: 'http://localhost:8545'
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};