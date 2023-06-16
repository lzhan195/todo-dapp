require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks:{
    sepolia:{
      url:process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId:11155111,
    }
  },
  etherscan:{
    apiKey:process.env.ETHERSCAN_KEY,
  }
};
