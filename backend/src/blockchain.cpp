#include "../include/blockchain.h"
#include "../include/crypto.h"
#include <algorithm>

Blockchain::Blockchain(int diff) : difficulty(diff) {
    // Create genesis block
    Block genesisBlock(0, std::vector<Transaction>(), "0");
    genesisBlock.hash = genesisBlock.calculateHash();
    chain.push_back(genesisBlock);
}

Block Blockchain::getLatestBlock() const {
    return chain.back();
}

bool Blockchain::addTransaction(const Transaction& tx) {
    // Verify transaction signature
    if (!verifyTransaction(tx)) {
        return false;
    }
    
    // Check sender has sufficient balance
    if (tx.amount > 0 && getBalance(tx.senderPublicKey) < tx.amount) {
        return false;
    }
    
    pendingTransactions.push_back(tx);
    return true;
}

Block Blockchain::minePendingTransactions(const std::string& minerPublicKey) {
    // Create mining reward transaction
    Transaction rewardTx;
    rewardTx.senderPublicKey = "SYSTEM";
    rewardTx.receiverPublicKey = minerPublicKey;
    rewardTx.amount = MINING_REWARD;
    rewardTx.timestamp = std::time(nullptr);
    rewardTx.isMiningReward = true;
    rewardTx.transactionHash = Crypto::sha256(rewardTx.calculateHash());
    rewardTx.signatureHex = "SYSTEM_SIGNATURE";
    
    // Add all pending transactions plus reward
    std::vector<Transaction> blockTransactions = pendingTransactions;
    blockTransactions.push_back(rewardTx);
    
    // Create new block
    Block newBlock(chain.size(), blockTransactions, getLatestBlock().hash);
    
    // Proof of Work: find nonce such that hash starts with 'difficulty' zeros
    std::string target(difficulty, '0');
    
    while (newBlock.hash.substr(0, difficulty) != target) {
        newBlock.nonce++;
        newBlock.hash = newBlock.calculateHash();
    }
    
    // Add block to chain
    chain.push_back(newBlock);
    
    // Clear pending transactions
    pendingTransactions.clear();
    
    return newBlock;
}

bool Blockchain::verifyTransaction(const Transaction& tx) const {
    // Mining rewards don't need signature verification
    if (tx.isMiningReward) {
        return true;
    }
    
    // Verify transaction hash
    std::string expectedHash = Crypto::sha256(tx.calculateHash());
    if (expectedHash != tx.transactionHash) {
        return false;
    }
    
    // Verify ECDSA signature
    return Crypto::verifySignature(tx.getMessageForSigning(), tx.signatureHex, tx.senderPublicKey);
}

double Blockchain::getBalance(const std::string& publicKey) const {
    double balance = 0.0;
    
    // Go through all blocks in chain
    for (const auto& block : chain) {
        // Go through all transactions in block
        for (const auto& tx : block.transactions) {
            // Add received amounts
            if (tx.receiverPublicKey == publicKey) {
                balance += tx.amount;
            }
            // Subtract sent amounts
            if (tx.senderPublicKey == publicKey && !tx.isMiningReward) {
                balance -= tx.amount;
            }
        }
    }
    
    return balance;
}

bool Blockchain::isChainValid() const {
    for (size_t i = 1; i < chain.size(); i++) {
        const Block& currentBlock = chain[i];
        const Block& previousBlock = chain[i - 1];
        
        // Verify current block hash
        if (currentBlock.hash != currentBlock.calculateHash()) {
            return false;
        }
        
        // Verify link to previous block
        if (currentBlock.previousHash != previousBlock.hash) {
            return false;
        }
        
        // Verify proof of work
        std::string target(difficulty, '0');
        if (currentBlock.hash.substr(0, difficulty) != target) {
            return false;
        }
    }
    
    return true;
}

Block Blockchain::getBlockByIndex(int index) const {
    if (index >= 0 && index < (int)chain.size()) {
        return chain[index];
    }
    throw std::out_of_range("Block index out of range");
}
