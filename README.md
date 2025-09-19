# BlockChain_Project-in-cpp
# ⛓️ Mini Blockchain in C++

This project is a **mini blockchain implementation in C++** built from scratch using **SHA-256 (OpenSSL)** for hashing.  
It demonstrates **core blockchain concepts** such as blocks, hashing, Proof-of-Work (PoW), nonce, chain validation, and **dynamic difficulty adjustment**.
![CMake Build](https://github.com/Absingh52/BlockChain_Project-in-cpp/actions/workflows/cmake-multi-platform.yml/badge.svg)

---

## 🚀 Features Implemented
- ✅ **Block Structure**: index, data, timestamp, previous hash, hash, nonce
- ✅ **SHA-256 Hashing** with OpenSSL
- ✅ **Proof-of-Work (Mining)** with configurable difficulty
- ✅ **Nonce** to repeatedly try hashes until target is met
- ✅ **Chain Validation (`isChainValid`)** to detect tampering
- ✅ **Dynamic Difficulty Adjustment** based on mining time
- ✅ **Genesis Block Creation** (first block of the chain)
- ✅ **User Input for Difficulty & Target Block Time**

---

## 🛠️ Tech Stack
- **Language:** C++
- **Libraries:** 
  - `<openssl/sha.h>` → SHA-256 hashing
  - `<vector>, <string>, <ctime>` → standard C++ utilities
- **Build System:** CMake

---

## 📂 Project Structure
.
├── Blockchain.h # Header file with Block & Blockchain class declarations
├── Blockchain.cpp # Implementation of hashing, mining, validation
├── main.cpp # Entry point - runs the blockchain
├── CMakeLists.txt # Build configuration
└── README.md # Project documentation

---

## ⚡ How It Works

1. **Genesis Block**
   - First block is created manually and mined.

2. **Adding a Block**
   - New block contains: index, data (transaction), timestamp, previous hash.
   - Block is mined using **Proof-of-Work** → hash must start with N leading zeros (difficulty).
   - Mining repeats by changing the **nonce** until success.

3. **Dynamic Difficulty**
   - If a block mines **too fast**, difficulty increases.
   - If a block mines **too slow**, difficulty decreases.
   - Mimics how real blockchains (like Bitcoin) adjust mining difficulty.

4. **Validation**
   - Recalculates each block’s hash.
   - Ensures `prevHash` matches the previous block’s hash.
   - If any block is tampered, the chain becomes invalid.

---

## 🖥️ Example Run
Enter starting difficulty: 3
Enter target block time (seconds): 5

Block mined: 000ad3c...
⏳ Mining time: 2 seconds
⚡ Difficulty increased to 4

Block mined: 0000f19...
⏳ Mining time: 7 seconds
🐢 Difficulty decreased to 3


Blockchain valid? Yes

