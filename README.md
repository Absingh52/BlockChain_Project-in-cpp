# BlockChain\_Project-in-cpp

# ⛓️ Mini Blockchain in C++class Solution {

  public:
    // Function to find minimum number of pages.
    bool isPossible( int n,int m,int mid, vector<int>&arr){
        int studentCount=1;
        int pagesum=0;
        for(int i=0;i<n;i++){
          if(pagesum+arr[i]<=mid){
            pagesum=pagesum+arr[i];
          }
          else{
            studentCount++;
              if(studentCount>m || arr[i]>mid){
                return false;
              }
              pagesum=arr[i];
          }
        }
        return true;
    }

    long long findPages(int n, vector<int>arr, int m) { 
      if(m>n){
        return-1;
      }
       int min=0;
       int max=0;
       for(int i=0;i<n;i++){
         max=max+arr[i];
       }
      int s=min;
       int e=max;
      int ans=-1;
       int mid=s+(e-s)/2;
       while(s<=e){
        if(isPossible(n, m, mid, arr))
             { ans=mid;
              e=mid-1;}
         else{
           s=mid+1;
         }
          mid=s+(e-s)/2;
       }
       return ans;
    }
};

This project is a **mini blockchain implementation in C++** built from scratch using **SHA-256 (OpenSSL)** for hashing.
It demonstrates **core blockchain concepts** such as blocks, hashing, Proof-of-Work (PoW), nonce, chain validation, **Merkle root for transactions**, and **dynamic difficulty adjustment**.
![CMake Build](https://github.com/Absingh52/BlockChain_Project-in-cpp/actions/workflows/cmake-multi-platform.yml/badge.svg)

---

## 🚀 Features Implemented

* ✅ **Block Structure**: index, data/transactions, timestamp, previous hash, hash, nonce, merkle root
* ✅ **SHA-256 Hashing** with OpenSSL
* ✅ **Proof-of-Work (Mining)** with configurable difficulty
* ✅ **Nonce** to repeatedly try hashes until target is met
* ✅ **Chain Validation (`isChainValid`)** to detect tampering
* ✅ **Dynamic Difficulty Adjustment** based on mining time
* ✅ **Genesis Block Creation** (first block of the chain)
* ✅ **User Input for Difficulty & Target Block Time**
* ✅ **Merkle Root Calculation** for transaction transparency

  * Converts plain block data into **transactions**
  * Computes a **Merkle root hash** for all transactions in a block
  * Provides a single, secure digest of all block transactions

---

## 🛠️ Tech Stack

* **Language:** C++
* **Libraries:**

  * `<openssl/sha.h>` → SHA-256 hashing
  * `<vector>, <string>, <ctime>` → standard C++ utilities
* **Build System:** CMake

---

## 📂 Project Structure

.
├── Blockchain.h # Header file with Block & Blockchain class declarations
├── Blockchain.cpp # Implementation of hashing, mining, validation, merkle root
├── main.cpp # Entry point - runs the blockchain
├── CMakeLists.txt # Build configuration
└── README.md # Project documentation

---

## ⚡ How It Works

1. **Genesis Block**

   * First block is created manually and mined.

2. **Adding a Block**

   * New block contains: index, transactions, timestamp, previous hash.
   * All transactions in a block are hashed into a **Merkle root**.
   * Block is mined using **Proof-of-Work** → hash must start with N leading zeros (difficulty).
   * Mining repeats by changing the **nonce** until success.

3. **Dynamic Difficulty**

   * If a block mines **too fast**, difficulty increases.
   * If a block mines **too slow**, difficulty decreases.
   * Mimics how real blockchains (like Bitcoin) adjust mining difficulty.

4. **Validation**

   * Recalculates each block’s hash.
   * Verifies **Merkle root** matches block transactions.
   * Ensures `prevHash` matches the previous block’s hash.
   * If any block or transaction is tampered, the chain becomes invalid.

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

Transactions in block: \[Alice→Bob: 10, Bob→Charlie: 5]
Merkle Root: 5f3a9c...

Blockchain valid? Yes

