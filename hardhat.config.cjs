require("@nomicfoundation/hardhat-toolbox");
// This line now points to your .env.local file
require("dotenv").config({ path: ".env.local" });

module.exports = {
  solidity: "0.8.20",
  networks: {
    fuji: {
      url: process.env.FUJI_RPC_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
};