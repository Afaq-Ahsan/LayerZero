## https://docs.layerzero.network/v2/developers/evm/oft/quickstart
# MyOFT - LayerZero OFT Deployment Guide

This guide walks you through deploying and configuring a LayerZero Omnichain Fungible Token (OFT) on testnet.

## 📋 Prerequisites

- Node.js >= 18.16.0
- npm or pnpm installed
- A wallet with testnet tokens on BSC and Sepolia
- Basic understanding of LayerZero's OFT standard

## 🏗️ Project Structure

```
my-lz-oapp/
├── contracts/
│   └── MyOFT.sol          # Main OFT contract
├── deploy/
│   └── MyOFT.ts           # Deployment script
├── hardhat.config.ts      # Network configuration
├── layerzero.config.ts    # LayerZero wiring configuration
└── .env                   # Environment variables
```

## 🚀 Quick Start - Deployment Flow

### Step 1: Environment Setup

1. Create a `.env` file (copy from `.env.example` if it exists)
2. Add your wallet credentials:

```bash
we can add any from both
# Option 1: Use a mnemonic
MNEMONIC="your twelve word mnemonic phrase here"

# Option 2: Use a private key
PRIVATE_KEY="0xYourPrivateKeyHere"
```

3. Fund your wallet with testnet tokens on both networks:
   - BSC Testnet: Get BNB from [BSC Faucet](https://testnet.bnbchain.org/faucet-smart)
   - Sepolia Testnet: Get ETH from [Sepolia Faucet](https://sepoliafaucet.com/)

### Step 2: Compile Contracts

Compile your Solidity contracts:

```bash
npm run compile
```

**What this does:**
- Compiles contracts using both Hardhat and Foundry
- Produces bytecode and ABIs in `artifacts/` folder
- Required before deployment

### Step 3: Configure Network Mapping

Before deploying, ensure your `layerzero.config.ts` matches networks in `hardhat.config.ts`.

**Current Configuration (hardhat.config.ts):**
- BSC Testnet (Endpoint ID: 40102)
- Sepolia Testnet (Endpoint ID: 40161)

**Update layerzero.config.ts:**
```typescript
const bscContract: OmniPointHardhat = {
    eid: EndpointId.BSC_V2_TESTNET,
    contractName: 'MyOFT',
}

const sepoliaContract: OmniPointHardhat = {
    eid: EndpointId.SEPOLIA_V2_TESTNET,
    contractName: 'MyOFT',
}
```

### Step 4: Deploy Contracts

Deploy your OFT contract to the configured networks:

```bash
npx hardhat lz:deploy --tags MyOFT
```

**What this does:**
- Prompts you to select networks (choose BSC and Sepolia)
- Deploys the MyOFT contract to each selected network
- Parameters used from `deploy/MyOFT.ts`:
  - Name: "Phoenix"
  - Symbol: "PhX"
  - Endpoint: LayerZero's EndpointV2 address (auto-resolved)
  - Owner: Your deployer address

**Example Output:**
```
Deployed contract: MyOFT, network: bsc, address: 0x47Ef62Cd15b7e989C4352aaC91f78bE8C99d0c0a
Deployed contract: MyOFT, network: sepolia, address: 0x19a2e0c393629b8af20FC63Ab6d7645670F1aB32
```

📁 **Save these addresses!** They're in `deployments/<network>/MyOFT.json`

### Step 5: Wire Contracts (Configure Cross-Chain)

Wire the contracts together to enable cross-chain messaging:

```bash
npx hardhat lz:oapp:wire --oapp-config layerzero.config.ts
```

**What this does:**
- Configures peer relationships between chains
- Sets up send/receive libraries
- Configures DVN (Decentralized Verifier Networks)
- Sets enforced gas options
- Executes ~12 transactions total

**What you'll see:**
- Transaction details for each configuration step
- Both BSC ↔ Sepolia pathways configured

### Step 6: Verify Deployment

Check your configuration:

```bash
npx hardhat lz:oapp:config:get --oapp-config layerzero.config.ts
```

## 📊 Deployment Summary

### Network Configuration
| Network | Endpoint ID | Deployed Address | Deployer |
|---------|-------------|------------------|----------|
| BSC Testnet | 40102 | `0x47Ef62Cd15b7e989C4352aaC91f78bE8C99d0c0a` | `0x7b3A848119f61B88a7E505A107ABdA6414c50941` |
| Sepolia Testnet | 40161 | `0x19a2e0c393629b8af20FC63Ab6d7645670F1aB32` | `0x7b3A848119f61B88a7E505A107ABdA6414c50941` |

### Contract Parameters
- **Name:** Phoenix
- **Symbol:** PhX
- **Total Supply:** 0 (no pre-mint)
- **Decimals:** 18 (standard ERC20)

## 🔄 Using Your OFT

### Mint Tokens (Optional)

If you need test tokens, you can deploy `MyOFTMock` instead which has a public mint function:

```bash
npx hardhat lz:deploy --tags MyOFTMock
```

Then mint tokens:
```bash
cast send <OFT_ADDRESS> "mint(address,uint256)" <RECIPIENT_ADDRESS> 1000000000000000000000 \
  --private-key <PRIVATE_KEY> \
  --rpc-url <BSC_RPC_URL>
```

### Send Cross-Chain

Transfer tokens from BSC to Sepolia:

```bash
npx hardhat lz:oft:send \
  --src-eid 40102 \
  --dst-eid 40161 \
  --amount 1 \
  --to <YOUR_ADDRESS>
```

**Parameters:**
- `--src-eid 40102` - BSC Testnet Endpoint ID
- `--dst-eid 40161` - Sepolia Testnet Endpoint ID
- `--amount 1` - Amount to send in wei (1 token = 1000000000000000000 wei)
- `--to` - Recipient address on destination chain

## 🛠️ Common Commands Reference

```bash
# Compile
npm run compile

# Deploy to specific network
npx hardhat lz:deploy --tags MyOFT --network bsc

# Deploy to all configured networks
npx hardhat lz:deploy --tags MyOFT

# Wire (configure) the contracts
npx hardhat lz:oapp:wire --oapp-config layerzero.config.ts

# Check current configuration
npx hardhat lz:oapp:config:get --oapp-config layerzero.config.ts

# Send cross-chain
npx hardhat lz:oft:send --src-eid 40102 --dst-eid 40161 --amount 1 --to 0x...

# Run tests
npm test
```

## 📝 Understanding the Process

### Deployment Flow

```
1. Setup Environment
   ↓
2. Compile Contracts
   ↓
3. Deploy Contracts (BSC & Sepolia)
   ↓
4. Wire Contracts (Configure LayerZero)
   ↓
5. Ready for Cross-Chain Transfers!
```

### What Each Step Does

1. **Compile** - Converts Solidity to bytecode and generates ABIs
2. **Deploy** - Creates contract instances on each blockchain
3. **Wire** - Connects contracts across chains via LayerZero protocol
   - Sets up peer relationships
   - Configures security parameters (DVNs, gas limits)
   - Enables cross-chain communication

### Key Configuration Files

- **hardhat.config.ts** - Defines which networks to deploy to
- **layerzero.config.ts** - Defines how chains are connected
- **deploy/MyOFT.ts** - Deployment script with constructor parameters

## 🔍 Troubleshooting

### "Could not find a network for eid"
- Check that `layerzero.config.ts` uses correct Endpoint IDs
- Verify networks in `hardhat.config.ts` match the eid

### "Insufficient funds"
- Ensure your wallet has native tokens (BNB for BSC, ETH for Sepolia)
- Get testnet tokens from faucets

### Transaction fails
- Check RPC endpoint is working
- Verify wallet has enough gas
- Ensure contract is properly deployed

## 📚 Additional Resources

- [LayerZero Documentation](https://docs.layerzero.network/)
- [OFT Standard Explanation](https://docs.layerzero.network/v2/concepts/applications/oft-standard)
- [Deployed Endpoints](https://docs.layerzero.network/v2/deployments/deployed-contracts)

## 🎯 Next Steps

- [ ] Test cross-chain transfers
- [ ] Profile gas usage for production
- [ ] Add more chains
- [ ] Deploy to mainnet
- [ ] Audit your contracts

---

**Congratulations! Your OFT is now deployed and ready for cross-chain transfers.** 🎉
