const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('BatchTransfer tests', function () {
  let BatchTransfer;
  let batchTransfer;
  let owner;
  let addr1;
  let addr2;
  let addrs;

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

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    BatchTransfer = await ethers.getContractFactory("BatchTransfer");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just call deploy() and await for it to be deployed(), which happens once its transaction has been mined.
    batchTransfer = await BatchTransfer.deploy();
    await batchTransfer.waitForDeployment();

    // console.log('BatchTransfer deployed to:', await batchTransfer.getAddress());
  });

  it("Should set the right owner - Deployment", async function () {
    let contractOwner = await batchTransfer.owner();
    expect(contractOwner).to.equal(owner.address);
  });

  it('Should batchTransfer successfully', async () => {
    const totalAmount = amounts.reduce((acc, amount) => acc+amount, BigInt(0));
    const txn = await batchTransfer.batchTransfer(addresses, amounts, {value: totalAmount});

    const filter = batchTransfer.filters.TransferSuccessful();
    const events = await batchTransfer.queryFilter(filter, -1);

    await txn.wait();
    for (let i = 0; i < addresses.length; i++) {
      const event = events[i];
      // Log the event to verify
      // console.log(`Event ${i}: ${JSON.stringify(event)}`);

      expect(ethers.getAddress(event.args.to)).to.equal(ethers.getAddress(addresses[i]));
      expect(event.args.amount).to.equal(amounts[i]); 
    }
  });

  it("Should fail if sender is not the owner", async function () {
    const receivers = [addr1.address, addr2.address];
    const amounts = [ethers.parseEther("1"), ethers.parseEther("1")];

    await expect(batchTransfer.connect(addr1).batchTransfer(receivers, amounts))
    .to.be.revertedWithCustomError(batchTransfer, "OwnableUnauthorizedAccount")
    .withArgs(addr1.address);
  });

  it("Should allow the owner to withdraw the contract's balance", async function () {
    // Get the initial balance of the owner
    const initialOwnerBalance = await ethers.provider.getBalance(owner.address);

    // Assuming some Ether is already sent to the contract in previous tests or add a sending transaction here
    // console.log(`batchTransfer address: ${batchTransfer.getAddress()}`);
    const contractBalance = await ethers.provider.getBalance(batchTransfer.getAddress());

    // Perform the withdrawal
    const tx = await batchTransfer.withdraw();
    const receipt = await tx.wait(); // Wait for the transaction to be mined
    // console.log(`receipt: ${JSON.stringify(receipt)}`);

    const gasUsedBigInt = BigInt(receipt.gasUsed.toString());
    const effectiveGasPriceBigInt = BigInt(receipt.gasPrice.toString());

    // Calculate the transaction cost using BigInt
    const transactionCost = gasUsedBigInt * effectiveGasPriceBigInt;

    const finalOwnerBalance = await ethers.provider.getBalance(owner.address);

    // Convert finalOwnerBalance and initialOwnerBalance to BigInt for comparison
    const finalOwnerBalanceBigInt = BigInt(finalOwnerBalance.toString());
    const initialOwnerBalanceBigInt = BigInt(initialOwnerBalance.toString());
    const contractBalanceBigInt = BigInt(contractBalance.toString());

    // Calculate the expected final balance
    const expectedFinalBalance = initialOwnerBalanceBigInt + contractBalanceBigInt - transactionCost;

    // Convert BigInt values to strings for comparison
    expect(finalOwnerBalanceBigInt.toString()).to.equal(expectedFinalBalance.toString(), `Expected final balance to be ${expectedFinalBalance.toString()}, but got ${finalOwnerBalanceBigInt.toString()}`);
  });

  it("should allow former owner to call the contract while the new owner cannot", async function() {
    const totalAmount = amounts.reduce((acc, amount) => acc+amount, BigInt(0));
    const [owner, newOwner, otherAccount] = await ethers.getSigners();

    // Initiate ownership transfer to newOwner    

    // Try to call a protected function as the original owner
    await expect(batchTransfer.connect(owner).batchTransfer(addresses, amounts, {value: totalAmount}))
      .not.to.be.reverted;

    // Try to call a protected function as the new owner before accepting
    await expect(batchTransfer.connect(newOwner).batchTransfer(addresses, amounts, {value: totalAmount}))
      .to.be.revertedWithCustomError(batchTransfer, "OwnableUnauthorizedAccount")
      .withArgs(addr1.address);

    // Ensure other accounts still cannot call the protected function
    await expect(batchTransfer.connect(otherAccount).batchTransfer(addresses, amounts, {value: totalAmount}))
      .to.be.revertedWithCustomError(batchTransfer, "OwnableUnauthorizedAccount")
      .withArgs(otherAccount.address);
  });

  it("should allow new owner to call the contract while the former owner cannot, after acceptance", async function() {
    const totalAmount = amounts.reduce((acc, amount) => acc+amount, BigInt(0));
    const [owner, newOwner, otherAccount] = await ethers.getSigners();

    // Initiate and then complete the ownership transfer
    await batchTransfer.connect(owner).transferOwnership(newOwner.address);
    await batchTransfer.connect(newOwner).acceptOwnership();

    // Try to call a protected function as the original owner
    await expect(batchTransfer.connect(owner).batchTransfer(addresses, amounts, {value: totalAmount}))
      .to.be.revertedWithCustomError(batchTransfer, "OwnableUnauthorizedAccount")
      .withArgs(owner.address);

    // Try to call a protected function as the new owner before accepting
    await expect(batchTransfer.connect(newOwner).batchTransfer(addresses, amounts, {value: totalAmount}))
      .not.to.be.reverted;

    // Ensure other accounts still cannot call the protected function
    await expect(batchTransfer.connect(otherAccount).batchTransfer(addresses, amounts, {value: totalAmount}))
      .to.be.revertedWithCustomError(batchTransfer, "OwnableUnauthorizedAccount")
      .withArgs(otherAccount.address);
  });

});