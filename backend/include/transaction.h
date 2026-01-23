#pragma once

#include <string>
#include <ctime>
#include <sstream>
#include <iomanip>

struct Transaction {
    std::string senderPublicKey;
    std::string receiverPublicKey;
    double amount;
    long long timestamp;
    std::string signatureHex;
    std::string transactionHash;
    bool isMiningReward;
    
    Transaction() : amount(0), timestamp(0), isMiningReward(false) {}
    
    Transaction(const std::string& sender, const std::string& receiver, double amt)
        : senderPublicKey(sender), receiverPublicKey(receiver), amount(amt), 
          timestamp(std::time(nullptr)), isMiningReward(false) {}
    
    // Calculate transaction hash: SHA256(sender + receiver + amount + timestamp)
    std::string calculateHash() const {
        std::stringstream ss;
        ss << senderPublicKey << receiverPublicKey << std::fixed << std::setprecision(2) << amount << timestamp;
        // Hash will be computed in crypto.cpp
        return ss.str();
    }
    
    // Create message for signing
    std::string getMessageForSigning() const {
        return calculateHash();
    }
};
