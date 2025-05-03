const hre = require("hardhat");

async function main() {
  // Replace with your actual verifier address
  const verifierAddress = "0x0828b7774ea41db0fcbf13ade31b5f61624a1364";

  const ZKPassKYCRegistry = await hre.ethers.getContractFactory("ZKPassKYCRegistry");
  const registry = await ZKPassKYCRegistry.deploy(verifierAddress);
  await registry.waitForDeployment();

  console.log("ZKPassKYCRegistry deployed to:", await registry.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
