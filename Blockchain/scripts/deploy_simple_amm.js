require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const tokenA = process.env.TOKEN_A;
  const tokenB = process.env.TOKEN_B;
  if (!tokenA || !tokenB) throw new Error("Please set TOKEN_A and TOKEN_B in your .env");

  const SimpleAmm = await hre.ethers.getContractFactory("SimpleAmm");
  const amm = await SimpleAmm.deploy(tokenA, tokenB);
  await amm.waitForDeployment();
  console.log("SimpleAmm deployed to:", await amm.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });