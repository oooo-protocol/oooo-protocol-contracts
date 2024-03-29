const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('BatchTransfer tests', function () {
  const addresses = [
    "0x2d49fd650b75d69e9acd8e788b295bafcc0861c0",
    "0x1f999843b4e510eca423fadf7f7cd17a943ed3ac",
    "0x2d49fd650b75d69e9acd8e788b295bafcc0861c0",
    "0x1f999843b4e510eca423fadf7f7cd17a943ed3ac",
    "0x2d49fd650b75d69e9acd8e788b295bafcc0861c0",
    "0x1f999843b4e510eca423fadf7f7cd17a943ed3ac",
    "0x2d49fd650b75d69e9acd8e788b295bafcc0861c0",
    "0x1f999843b4e510eca423fadf7f7cd17a943ed3ac",
    "0x2d49fd650b75d69e9acd8e788b295bafcc0861c0",
    "0x1f999843b4e510eca423fadf7f7cd17a943ed3ac",
    "0x2d49fd650b75d69e9acd8e788b295bafcc0861c0",
    "0x1f999843b4e510eca423fadf7f7cd17a943ed3ac",
    "0x2d49fd650b75d69e9acd8e788b295bafcc0861c0",
    "0x1f999843b4e510eca423fadf7f7cd17a943ed3ac",
    "0x2d49fd650b75d69e9acd8e788b295bafcc0861c0",
    "0x1f999843b4e510eca423fadf7f7cd17a943ed3ac",
    "0x2d49fd650b75d69e9acd8e788b295bafcc0861c0",
    "0x1f999843b4e510eca423fadf7f7cd17a943ed3ac",
    "0x2d49fd650b75d69e9acd8e788b295bafcc0861c0",
    "0x1f999843b4e510eca423fadf7f7cd17a943ed3ac"
  ];
  const amounts = [
    ethers.parseEther("0.00003"),
    ethers.parseEther("0.00005"),
    ethers.parseEther("0.00003"),
    ethers.parseEther("0.00005"),
    ethers.parseEther("0.00003"),
    ethers.parseEther("0.00005"),
    ethers.parseEther("0.00003"),
    ethers.parseEther("0.00005"),
    ethers.parseEther("0.00003"),
    ethers.parseEther("0.00005"),
    ethers.parseEther("0.00003"),
    ethers.parseEther("0.00005"),
    ethers.parseEther("0.00003"),
    ethers.parseEther("0.00005"),
    ethers.parseEther("0.00003"),
    ethers.parseEther("0.00005"),
    ethers.parseEther("0.00003"),
    ethers.parseEther("0.00005"),
    ethers.parseEther("0.00003"),
    ethers.parseEther("0.00005")
  ];

  it('deployment BatchTransfer', async () => {
    const BatchTransfer = await ethers.getContractFactory("BatchTransfer");
    const batchTransfer = await BatchTransfer.deploy();
    await batchTransfer.waitForDeployment();
    console.log('BatchTransfer deployed to:', await batchTransfer.getAddress());

    const totalAmount = amounts.reduce((acc, amount) => acc+amount, BigInt(0));
    const txn = await batchTransfer.batchTransfer(addresses, amounts, {value: totalAmount});
    const receipt = await ethers.provider.getTransactionReceipt(txn.hash);
    console.log(`receipt: ${JSON.stringify(receipt)}`);
  });

  // it('deployment BatchTransferEvent', async () => {
  //   const BatchTransfer = await ethers.getContractFactory("BatchTransferEvent");
  //   const batchTransfer = await BatchTransfer.deploy();
  //   await batchTransfer.waitForDeployment();
  //   console.log('BatchTransfer deployed to:', await batchTransfer.getAddress());

  //   const totalAmount = amounts.reduce((acc, amount) => acc+amount, BigInt(0));
  //   const txn = await batchTransfer.batchTransfer(addresses, amounts, {value: totalAmount});
  //   const receipt = await ethers.provider.getTransactionReceipt(txn.hash);
  //   console.log(`receipt: ${JSON.stringify(receipt)}`);
  // });
});