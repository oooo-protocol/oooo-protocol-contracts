// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Importing OpenZeppelin's Ownable contract to manage ownership
// import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";

contract BatchTransfer is Ownable2Step {
    // Event declaration for successful transfers
    event TransferSuccessful(address indexed to, uint256 amount);
    event Withdrawal(address indexed to, uint256 amount);

    constructor() Ownable(msg.sender) {}

    // Function to perform batch transfers
    function batchTransfer(address[] calldata receivers, uint256[] calldata amounts) external payable onlyOwner {
        require(receivers.length == amounts.length, "Receivers and amounts do not match");
        
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        require(msg.value >= totalAmount, "Insufficient amount sent");

        for (uint256 i = 0; i < receivers.length; i++) {
            // Sending Ether to the receiver
            // If any send fails, the entire transaction reverts
            (bool success, ) = receivers[i].call{value: amounts[i]}("");
            require(success, "Transfer failed");

            // Emitting event for successful transfer
            emit TransferSuccessful(receivers[i], amounts[i]);
        }
    }

    // Function to allow the owner to withdraw the contract's balance
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = payable(owner()).call{value: balance}("");

        require(success, "Failed to withdraw");
        emit Withdrawal(owner(), balance);
    }
}
