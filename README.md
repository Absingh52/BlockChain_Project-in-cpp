# 🧱 Mini Blockchain in C++

This is a mini blockchain project built in **C++** with **OpenSSL** for cryptography.  
It demonstrates the core building blocks of a blockchain system:  
- Wallets with Public/Private keys and Digital Signatures  
- Transactions stored in a Mempool  
- Mining with Proof of Work (difficulty adjustment)  
- Block rewards for miners  
- Merkle Tree for transaction integrity  
- Chain validation  

---

## 🚀 Project Flow

### 1. Wallets (`Wallet.h` / `Wallet.cpp`)
- Every user has a **wallet**.  
- A wallet generates a **private key** (secret) and a **public key** (identity).  
- Private key is used to **sign transactions**.  
- Public key is used by others to **verify transactions**.  

**Functions:**
- `Wallet()` → generates new EC key pair (secp256k1 curve).  
- `sign(msg)` → signs a message (usually transaction data) with private key.  
- `verify(pubKey, msg, signHex)` → checks if a signature is valid using sender’s public key.  

---

### 2. Transactions (`Blockchain.h`)
- A **transaction** means value transfer from one wallet to another.  
- Each transaction has:
  - `senderPubKey` → who is sending  
  - `receiverPubKey` → who receives  
  - `amount` → how much value  
  - `timestamp` → when created  
  - `signatureHex` → proof (signed by sender’s private key)  

**Functions:**
- `toString()` → converts transaction into readable string.  
- `canonicalString()` (optional) → deterministic string used for signing/verification.  

---

### 3. Blocks (`Blockchain.h` / `Blockchain.cpp`)
- A block groups multiple transactions.  
- Each block contains:
  - `index` → position in chain  
  - `timestamp` → creation time  
  - `transcation` → list of transactions  
  - `prevHash` → hash of previous block (linking blocks)  
  - `hash` → unique fingerprint of this block  
  - `merkleRoot` → hash of all transactions combined (via Merkle tree)  
  - `nonce` → number used in Proof-of-Work  

**Functions:**
- `calculateHash()` → generates hash using block contents.  
- `calculateMerkleRoot()` → builds a Merkle tree of all transactions, returns root hash.  
- `mineBlock(difficulty)` → repeatedly changes `nonce` until hash starts with `difficulty` zeros (Proof of Work).  
- `getTime()` → fetches system time as string.  

---

### 4. Blockchain (`Blockchain.h` / `Blockchain.cpp`)
- The blockchain is a vector of blocks (`vector<Block> chain`).  
- It also has a **mempool** (pending transactions).  
- Blocks are mined one by one and linked with `prevHash`.  

**Functions:**
- `Blockchain(diff, targetTime)` → constructor, creates **genesis block**.  
- `getLatestBlock()` → returns last block in the chain.  
- `addTransaction(tx)` → verifies transaction signature, then adds to mempool.  
- `minePendingTransactions(minerAddress)` →  
  1. Creates a **reward transaction** for miner.  
  2. Takes all mempool transactions.  
  3. Creates new block and mines it (Proof of Work).  
  4. Adds block to chain and clears mempool.  
  5. Adjusts difficulty depending on mining time.  
- `printBlockchain()` → prints all blocks and transactions.  
- `isChainValid()` → verifies the entire chain:
  - Each block’s hash must be correct.  
  - Each block’s `prevHash` must match previous block.  
  - Merkle root must be valid.  

---

### 5. Main Program (`main.cpp`)
The main program demonstrates the blockchain:

1. Create wallets: Alice, Bob, Miner.  
2. Alice → Bob transaction (signed by Alice).  
3. Bob → Alice transaction (signed by Bob).  
4. Add both to mempool with `addTransaction()`.  
5. Miner mines block using `minePendingTransactions(miner.public_key)`.  
6. Print blockchain with all details.  
7. Validate chain with `isChainValid()`.  

---

## ⚡ Example Flow

1. **Alice → Bob (10 BTC)** transaction created.  
2. Transaction verified → added to mempool.  
3. **Bob → Alice (5 BTC)** transaction created.  
4. Transaction verified → added to mempool.  
5. Miner calls `minePendingTransactions(minerPubKey)`.  
   - Reward transaction added: `System → Miner (50 BTC)`  
   - Block created with `[RewardTx, Alice→Bob, Bob→Alice]`  
   - Block mined with Proof-of-Work.  
6. Chain prints with all blocks and transactions.  

---

## 🛠️ Build Instructions

### Requirements
- C++17  
- OpenSSL library  

### Build with CMake
```bash
mkdir build
cd build
cmake ..
make
