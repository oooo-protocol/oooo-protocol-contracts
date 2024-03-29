const { ethers } = require("hardhat");

const provider = ethers.provider;

async function main () {
  let balance1 = await provider.getBalance("0x4371A3aaf71EAc6F554725e8f2a219EA44F58b2e");
  let balance2 = await provider.getBalance("0x2d49fd650b75d69e9acd8e788b295bafcc0861c0");
  let balance3 = await provider.getBalance("0x1f999843b4e510eca423fadf7f7cd17a943ed3ac");
  console.log(`Balance1: ${balance1} Balance2: ${balance2} Balance3: ${balance3}`);

  // testnet dev
  const contractAddress = '0x276f37FF321deAe80281878eAFBB92307A996F61';

  const BatchTransfer = await ethers.getContractFactory('BatchTransfer');
  const batchTransfer = await BatchTransfer.attach(contractAddress);

  const receipt = await ethers.provider.getTransactionReceipt('0x792f4dcb4964fbaddbd65ac18397aea4f1c4e34180f4f14ffccd4d23c6cd42fc');
  console.log(`receipt: ${JSON.stringify(receipt)}`);
  receipt.logs.forEach(log => {
    // Decode the log with the known event signature
    const parsedLog = batchTransfer.interface.parseLog(log);
    if (parsedLog.name === 'TransferSuccessful') {
        console.log(`Transfer successful to ${parsedLog.args.to} for amount ${parsedLog.args.amount}`);
    }
  });
}

async function main111 () {
  let balance1 = await provider.getBalance("0x4371A3aaf71EAc6F554725e8f2a219EA44F58b2e");
  let balance2 = await provider.getBalance("0x2d49fd650b75d69e9acd8e788b295bafcc0861c0");
  let balance3 = await provider.getBalance("0x1f999843b4e510eca423fadf7f7cd17a943ed3ac");
  console.log(`Balance1: ${balance1} Balance2: ${balance2} Balance3: ${balance3}`);

  // testnet dev
  const contractAddress = '0x276f37FF321deAe80281878eAFBB92307A996F61';

  // // local
  // // const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

  const BatchTransfer = await ethers.getContractFactory('BatchTransfer');
  const batchTransfer = await BatchTransfer.attach(contractAddress);

  // const receipt = await ethers.provider.getTransactionReceipt('0x0d124121c3ac3f0fc1c3c7c520bd86279a995d7adefd76405ab7764f16c64a9e');
  // console.log(`receipt: ${JSON.stringify(receipt)}`);
  // receipt.logs.forEach(log => {
  //   // Decode the log with the known event signature
  //   const parsedLog = batchTransfer.interface.parseLog(log);
  //   if (parsedLog.name === 'TransferSuccessful') {
  //       console.log(`Transfer successful to ${parsedLog.args.to} for amount ${parsedLog.args.amount}`);
  //   }
  // });

  const addresses = [
    "0x2d49fd650b75d69e9acd8e788b295bafcc0861c0",
    "0x1f999843b4e510eca423fadf7f7cd17a943ed3ac"
  ];
  const amounts = [
    ethers.parseEther("0.00003"),  // Convert Ether to Wei
    ethers.parseEther("0.00005")   // Convert Ether to Wei
  ];

  // const addresses = [
  //   "0xdD2FD4581271e230360230F9337D5c0430Bf44C0",
  //   "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"
  // ];
  // const amounts = [
  //   ethers.parseEther("0.00003"),  // Convert Ether to Wei
  //   ethers.parseEther("0.00005")   // Convert Ether to Wei
  // ];

  console.log(`amounts: ${amounts}`);

  // Calculate the total amount to send
  const totalAmount = amounts.reduce((acc, amount) => acc+amount, BigInt(0));
  console.log(`totalAmount: ${totalAmount}`);
  const txn = await batchTransfer.batchTransfer(addresses, amounts, {value: totalAmount});
  console.log(`Txn Result: ${JSON.stringify(txn)}`);

  const receipt = await ethers.provider.getTransactionReceipt(txn.hash);
  console.log(`receipt: ${JSON.stringify(receipt)}`);

  // const balance1 = await provider.getBalance("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
  // const balance2 = await provider.getBalance("0xdD2FD4581271e230360230F9337D5c0430Bf44C0");
  // const balance3 = await provider.getBalance("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199");

  balance1 = await provider.getBalance("0x4371A3aaf71EAc6F554725e8f2a219EA44F58b2e");
  balance2 = await provider.getBalance("0x2d49fd650b75d69e9acd8e788b295bafcc0861c0");
  balance3 = await provider.getBalance("0x1f999843b4e510eca423fadf7f7cd17a943ed3ac");

  console.log(`Balance1: ${balance1} Balance2: ${balance2} Balance3: ${balance3}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });