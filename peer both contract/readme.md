## https://docs.layerzero.network/v2/developers/evm/oft/quickstart
##🧩 LayerZero Token Bridge Setup Guide
Overview

When deploying tokens using the LayerZero-provided example contracts, you may encounter an issue where the contracts are not verified on block explorers.
To resolve this and successfully bridge tokens between chains, follow the steps below.

🚀 Steps to Deploy and Verify Contracts

Manually Deploy Contracts
Deploy both token contracts on their respective chains (e.g., BSC and Sepolia) using your preferred deployment method (such as Hardhat or Remix).

Verify Contracts
Once deployed, verify both contracts manually on Etherscan or BscScan.

Update peer.js
Edit the peer.js file and update it with the correct deployed contract addresses and endpoint configuration.

Run the Peer Setup Script
Execute the script to establish the connection between both tokens.

node peer.js


Verify Peer Connection
Check if both tokens are properly linked by calling the peers public function on each contract.
If the setup is correct, both contracts should recognize each other as peers.

Run the Send Script
Finally, run the send.js file to initiate the cross-chain transfer.

node send.js


This operation will:

Burn tokens on the source chain.

Mint tokens on the destination chain.

✅ Expected Result


## if token is already deployed and you want to bridge it with other token then the procedure is 

🔮 Example Use Case

Let’s say you already have $PHX on BSC.
Now you want to let users move it to Ethereum.

✅ You can:

Deploy OFTAdapter on BSC referencing your $PHX token.

Deploy OFT on Ethereum.

Set them as peers.

Users can bridge between them.

On BSC: $PHX tokens get locked in the adapter.
On Ethereum: $PHX tokens get minted 1:1.
And vice versa.

After running the scripts successfully:

The contracts should be verified on their respective explorers.

Tokens should transfer seamlessly across chains using LayerZero’s messaging system.
