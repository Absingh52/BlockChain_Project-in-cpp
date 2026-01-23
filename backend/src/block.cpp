#include "../include/block.h"
#include "../include/crypto.h"
#include <sstream>
#include <iomanip>

std::string Block::calculateHash() const {
    std::stringstream ss;
    ss << previousHash << timestamp << nonce;
    
    // Add transaction hashes
    for (const auto& tx : transactions) {
        ss << tx.transactionHash << tx.signatureHex;
    }
    
    return Crypto::sha256(ss.str());
}
