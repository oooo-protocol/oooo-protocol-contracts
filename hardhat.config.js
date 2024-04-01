require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");
// require("@nomiclabs/hardhat-etherscan");
require('@openzeppelin/hardhat-upgrades');
require("hardhat-gas-reporter");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: "0.8.20",
        settings: {
            optimizer: {
              enabled: true,
              runs: 200 // This is a typical number of runs; adjust as needed
            }
        },
    },
    paths: {
        artifacts: "./src",
    },
    gasReporter: {
        enabled: true
    },
    networks: {
        b2Testnet: {
            url: `https://haven-rpc.bsquared.network`,
            accounts: [process.env.B2_TESTNET_ACCOUNT_PRIVATE_KEY],
        },
        bevmTestnet: {
            url: `https://canary-testnet.bevm.io`,
            accounts: [process.env.BEVM_TESTNET_ACCOUNT_PRIVATE_KEY],
        },
        merlinTestnet: {
            url: `https://testnet-rpc.merlinchain.io`,
            accounts: [process.env.MERLIN_TESTNET_ACCOUNT_PRIVATE_KEY],
        },
        rootstockTestnet: {
            url: `https://public-node.testnet.rsk.co`,
            accounts: [process.env.ROOTSTOCK_TESTNET_ACCOUNT_PRIVATE_KEY],
        },
        bitlayerTestnet: {
            url: `https://testnet-rpc.bitlayer.org`,
            accounts: [process.env.BITLAYER_TESTNET_ACCOUNT_PRIVATE_KEY],
        },
        localhost: {
            url: `http://127.0.0.1:8545`,
            accounts: [process.env.LOCAL_ACCOUNT_PRIVATE_KEY],
        }
    },
    // etherscan: {
    //     apiKey: {
    //         b2Testnet: "abc"
    //     },
    //     customChains: [
    //         {
    //           network: "b2Testnet",
    //           chainId: 1102,
    //           urls: {
    //             apiURL: "https://haven-rpc.bsquared.network",
    //             browserURL: "https://haven-explorer.bsquared.network"
    //           }
    //         }
    //     ]
    // },
    
};