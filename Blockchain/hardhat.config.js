require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    pharos: {
      url: "https://devnet.dplabs-internal.com",
      accounts: [vars.get("PRIVATE_KEY")],
    },
  },
};