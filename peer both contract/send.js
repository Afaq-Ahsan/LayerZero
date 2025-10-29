const { ethers } = require("ethers");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const BSC_RPC = process.env.BSC_RPC_URL;
const BSC_CONTRACT = "0xA152FFB809DB6d461E2f4E9db33c179A76ca0005";
const SEPOLIA_ENDPOINT_ID = 40161;

const oftAbi = [
  `function quoteSend(
      (uint32 dstEid, bytes32 to, uint256 amountLD, uint256 minAmountLD, bytes extraOptions, bytes composeMsg, bytes oftCmd) _sendParam,
      bool _payInLzToken
    ) external view returns (tuple(uint256 nativeFee, uint256 lzTokenFee) fee)`,

  `function send(
      (uint32 dstEid, bytes32 to, uint256 amountLD, uint256 minAmountLD, bytes extraOptions, bytes composeMsg, bytes oftCmd) _sendParam,
      (uint256 nativeFee, uint256 lzTokenFee) _fee,
      address _refundAddress
    ) external payable`
];

async function main() {
  const provider = new ethers.JsonRpcProvider(BSC_RPC);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const oft = new ethers.Contract(BSC_CONTRACT, oftAbi, wallet);

  const receiver = "0x9661daD144Ac7b4046A7C73767F7A880f4f06EfF";
  const amount = ethers.parseEther("10");

  // Matches your manual call: "0x00010000000000000000000000000000000000000000000000000000000000030d40"
  const extraOptions = "0x00010000000000000000000000000000000000000000000000000000000000030d40";

  const sendParam = {
    dstEid: SEPOLIA_ENDPOINT_ID,
    to: ethers.zeroPadValue(receiver, 32),
    amountLD: amount,
    minAmountLD: 0,
    extraOptions,
    composeMsg: "0x",
    oftCmd: "0x"
  };

  console.log("sendParam:", sendParam);

  console.log("Estimating fee...");
  const fee = await oft.quoteSend(sendParam, false);
  console.log(`Estimated native fee: ${ethers.formatEther(fee.nativeFee)} ETH`);

  console.log("Sending tokens cross-chain...");
  const tx = await oft.send(
    sendParam,
    { nativeFee: fee.nativeFee, lzTokenFee: fee.lzTokenFee },
    wallet.address,
    { value: fee.nativeFee }
  );

  console.log(`✅ Tx sent: ${tx.hash}`);
  await tx.wait();
  console.log("✅ Bridge confirmed!");
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
