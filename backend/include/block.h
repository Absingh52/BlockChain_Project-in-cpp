#pragma once

#include "transaction.h"
#include <vector>
#include <string>
#include <ctime>

struct Block {
    int index;
    long long timestamp;
    std::vector<Transaction> transactions;
    std::string previousHash;
    long long nonce;
    std::string hash;
    
    Block() : index(0), timestamp(0), nonce(0) {}
    
    Block(int idx, const std::vector<Transaction>& txs, const std::string& prevHash)
        : index(idx), timestamp(std::time(nullptr)), transactions(txs), 
          previousHash(prevHash), nonce(0) {}
    
    // Calculate block hash: SHA256(previousHash + timestamp + nonce + transactions)
    std::string calculateHash() const;
};
