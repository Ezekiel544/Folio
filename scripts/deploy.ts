import hre from "hardhat";

/**
 * Deploy the ReceiptRegistry.
 *
 * Usage:
 *   npm run deploy                # default (in-process hardhat network)
 *   npm run deploy:pharos         # against PHAROS_RPC_URL
 *   npm run deploy:sepolia        # against SEPOLIA_RPC_URL (chainId 11155111)
 *
 * Env:
 *   PHAROS_ISSUER_PRIVATE_KEY        deployer + default issuer wallet
 *   PHAROS_ISSUER_ADDRESS            initial whitelisted issuer
 *                                     (defaults to the deployer address)
 */
async function main() {
  const { ethers, network } = hre;
  const signers = await ethers.getSigners();
  const [deployer] = signers;

  if (!deployer) {
    throw new Error(
      `No signer available on network "${network.name}". ` +
        "Set PHAROS_ISSUER_PRIVATE_KEY in .env before deploying to a live network.",
    );
  }

  const chain = await ethers.provider.getNetwork();
  const issuer = process.env.PHAROS_ISSUER_ADDRESS || deployer.address;

  console.log(`Network: ${network.name} (chainId ${chain.chainId})`);
  console.log(`Deployer balance: ${ethers.formatEther(await ethers.provider.getBalance(deployer.address))} ETH`);
  console.log("");

  const ReceiptRegistry = await ethers.getContractFactory("ReceiptRegistry");
  const registry = await ReceiptRegistry.deploy(issuer);
  await registry.waitForDeployment();

  console.log("ReceiptRegistry deployed to:", registry.target);
  console.log("Admin:                        ", deployer.address);
  console.log("Initial issuer:               ", issuer);
  console.log("");
  console.log("Set in your environment:");
  console.log(`  PHAROS_RECEIPT_REGISTRY_ADDRESS=${registry.target}`);
  console.log(`  PHAROS_ISSUER_ADDRESS=${issuer}`);
  console.log(`  PHAROS_RPC_URL=<rpc url for ${network.name}>`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});