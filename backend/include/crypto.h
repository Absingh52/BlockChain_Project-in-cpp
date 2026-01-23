#pragma once

#include <string>
#include <vector>
#include <openssl/ec.h>
#include <openssl/evp.h>
#include <openssl/err.h>
#include <openssl/pem.h>

class Crypto {
public:
    // SHA256 hashing
    static std::string sha256(const std::string& input);
    
    // Key pair generation using secp256k1 elliptic curve
    static void generateKeyPair(std::string& publicKey, std::string& privateKey);
    
    // ECDSA sign a message with private key
    static std::string signMessage(const std::string& message, const std::string& privateKey);
    
    // Verify ECDSA signature with public key
    static bool verifySignature(const std::string& message, const std::string& signature, const std::string& publicKey);
    
    // Derive public key from private key
    static std::string getPublicKeyFromPrivate(const std::string& privateKey);
};
