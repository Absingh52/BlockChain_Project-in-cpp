#pragma once

#include <string>

class Wallet {
private:
    std::string publicKey;
    std::string privateKey;

public:
    Wallet();
    explicit Wallet(const std::string& privKey);
    
    std::string getPublicKey() const;
    std::string getPrivateKey() const;
    
    // Sign a transaction message
    std::string signTransaction(const std::string& transactionData) const;
};
