require("dotenv").config();
const { ethers } = require("ethers");

/// ✅ Replace these with your deployed contract addresses
const SEPOLIA_CONTRACT = "0xb668D03e96a1131ED602e60A2fDC82535F405A9b"; // PhoenixOFT on Sepolia
const BSC_CONTRACT = "0xA152FFB809DB6d461E2f4E9db33c179A76ca0005";     // PhoenixOFT on BSC Testnet

/// ✅ Replace with LayerZero EIDs (these are NOT normal chain IDs)
const EID_SEPOLIA = 40161;
const EID_BSC_TESTNET = 40102;

/// ✅ Contract ABI — only need the setPeer() function
const oftAbi = [
  "function setPeer(uint32 eid, bytes32 peer) external",
  "function peers(uint32 eid) external view returns (bytes32)"
];

async function main() {
  console.log("🔗 Connecting providers...");
  
  const sepoliaProvider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const bscProvider = new ethers.JsonRpcProvider(process.env.BSC_RPC_URL);

  const walletSepolia = new ethers.Wallet(process.env.PRIVATE_KEY, sepoliaProvider);
  const walletBsc = new ethers.Wallet(process.env.PRIVATE_KEY, bscProvider);

  const sepoliaOFT = new ethers.Contract(SEPOLIA_CONTRACT, oftAbi, walletSepolia);
  const bscOFT = new ethers.Contract(BSC_CONTRACT, oftAbi, walletBsc);

  console.log("⚙️ Setting peers...");

  // Set BSC as peer of Sepolia
  const tx1 = await sepoliaOFT.setPeer(
    EID_BSC_TESTNET,
    ethers.zeroPadValue(BSC_CONTRACT, 32)
  );
  await tx1.wait();
  console.log("✅ Sepolia peer set:", tx1.hash);

  // Set Sepolia as peer of BSC
  const tx2 = await bscOFT.setPeer(
    EID_SEPOLIA,
    ethers.zeroPadValue(SEPOLIA_CONTRACT, 32)
  );
  await tx2.wait();
  console.log("✅ BSC peer set:", tx2.hash);

  console.log("🎉 Peering complete!");
}

main().catch((err) => {
  console.error("❌ Error:", err);
});
