#pragma once

#include "block.h"
#include "transaction.h"
#include <vector>
#include <string>
#include <map>

class Blockchain {
private:
    std::vector<Block> chain;
    std::vector<Transaction> pendingTransactions;
    int difficulty; // Number of leading zeros required
    const double MINING_REWARD = 10.0;
    std::string minerAddress; // Address to send mining rewards to
    
public:
    Blockchain(int diff = 2);
    
    // Get the latest block
    Block getLatestBlock() const;
    
    // Add a transaction to pending pool after validation
    bool addTransaction(const Transaction& tx);
    
    // Mine pending transactions (PoW)
    Block minePendingTransactions(const std::string& minerPublicKey);
    
    // Verify a transaction signature
    bool verifyTransaction(const Transaction& tx) const;
    
    // Get balance for a public key address
    double getBalance(const std::string& publicKey) const;
    
    // Validate entire chain integrity
    bool isChainValid() const;
    
    // Getters
    const std::vector<Block>& getChain() const { return chain; }
    const std::vector<Transaction>& getPendingTransactions() const { return pendingTransactions; }
    int getDifficulty() const { return difficulty; }
    Block getBlockByIndex(int index) const;
};
