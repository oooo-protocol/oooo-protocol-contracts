const { ethers } = require("hardhat");

async function main() {
  // Deploying the contract
  const BatchTransfer = await ethers.getContractFactory("BatchTransfer");
  const batchTransfer = await BatchTransfer.deploy();
  await batchTransfer.waitForDeployment();
  console.log('BatchTransfer deployed to:', await batchTransfer.getAddress());

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
