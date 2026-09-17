import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import * as dotenv from "dotenv";

dotenv.config();

const accounts = process.env.PHAROS_ISSUER_PRIVATE_KEY
  ? [process.env.PHAROS_ISSUER_PRIVATE_KEY]
  : [];

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    hardhat: {},
    pharos: {
      url: process.env.PHAROS_RPC_URL || "http://127.0.0.1:8545",
      accounts,
    },
    // Public Sepolia testnet. Set SEPOLIA_RPC_URL to a hosted provider
    // (Alchemy / Infura / QuickNode) — the public endpoint is rate-limited
    // and is only a sane default for a one-off deploy.
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org",
      accounts,
      chainId: 11155111,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test/contract",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;