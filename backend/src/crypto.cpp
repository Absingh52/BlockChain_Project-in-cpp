#include "../include/crypto.h"
#include <openssl/sha.h>
#include <openssl/bio.h>
#include <openssl/buffer.h>
#include <iomanip>
#include <sstream>
#include <cstring>

std::string Crypto::sha256(const std::string& input) {
    unsigned char hash[SHA256_DIGEST_LENGTH];
    SHA256_CTX sha256;
    SHA256_Init(&sha256);
    SHA256_Update(&sha256, input.c_str(), input.length());
    SHA256_Final(hash, &sha256);
    
    // Convert hash to hex string
    std::stringstream ss;
    for(int i = 0; i < SHA256_DIGEST_LENGTH; i++) {
        ss << std::hex << std::setw(2) << std::setfill('0') << (int)hash[i];
    }
    return ss.str();
}

void Crypto::generateKeyPair(std::string& publicKey, std::string& privateKey) {
    // Create EC key with secp256k1 curve
    EC_KEY* ecKey = EC_KEY_new_by_curve_name(OBJ_txt2nid("secp256k1"));
    if (!ecKey) {
        throw std::runtime_error("Failed to create EC key");
    }
    
    // Generate key pair
    if (!EC_KEY_generate_key(ecKey)) {
        EC_KEY_free(ecKey);
        throw std::runtime_error("Failed to generate key pair");
    }
    
    // Create EVP key for signing
    EVP_PKEY* pkey = EVP_PKEY_new();
    EVP_PKEY_assign_EC_KEY(pkey, ecKey);
    
    // Export private key in PEM format
    BIO* privBio = BIO_new(BIO_s_mem());
    PEM_write_bio_ECPrivateKey(privBio, ecKey, nullptr, nullptr, 0, nullptr, nullptr);
    
    BUF_MEM* privBufMem;
    BIO_get_mem_ptr(privBio, &privBufMem);
    privateKey = std::string(privBufMem->data, privBufMem->length);
    BIO_free(privBio);
    
    // Export public key in PEM format
    BIO* pubBio = BIO_new(BIO_s_mem());
    PEM_write_bio_EC_PUBKEY(pubBio, ecKey);
    
    BUF_MEM* pubBufMem;
    BIO_get_mem_ptr(pubBio, &pubBufMem);
    publicKey = std::string(pubBufMem->data, pubBufMem->length);
    BIO_free(pubBio);
    
    EVP_PKEY_free(pkey);
}

std::string Crypto::signMessage(const std::string& message, const std::string& privateKey) {
    // Read private key from PEM
    BIO* bio = BIO_new_mem_buf(privateKey.c_str(), -1);
    EC_KEY* ecKey = PEM_read_bio_ECPrivateKey(bio, nullptr, nullptr, nullptr);
    BIO_free(bio);
    
    if (!ecKey) {
        throw std::runtime_error("Failed to read private key");
    }
    
    // Create EVP context for signing
    EVP_MD_CTX* mdctx = EVP_MD_CTX_new();
    EVP_PKEY* pkey = EVP_PKEY_new();
    EVP_PKEY_assign_EC_KEY(pkey, ecKey);
    
    // Hash and sign
    unsigned char hash[SHA256_DIGEST_LENGTH];
    SHA256_CTX sha256;
    SHA256_Init(&sha256);
    SHA256_Update(&sha256, message.c_str(), message.length());
    SHA256_Final(hash, &sha256);
    
    // Sign with ECDSA
    unsigned char sig[256];
    size_t sigLen = 256;
    
    if (EVP_DigestSign(mdctx, sig, &sigLen, hash, SHA256_DIGEST_LENGTH) <= 0) {
        EVP_MD_CTX_free(mdctx);
        EVP_PKEY_free(pkey);
        throw std::runtime_error("Failed to sign message");
    }
    
    EVP_MD_CTX_free(mdctx);
    EVP_PKEY_free(pkey);
    
    // Convert signature to hex
    std::stringstream ss;
    for(unsigned int i = 0; i < sigLen; i++) {
        ss << std::hex << std::setw(2) << std::setfill('0') << (int)sig[i];
    }
    return ss.str();
}

bool Crypto::verifySignature(const std::string& message, const std::string& signature, const std::string& publicKey) {
    try {
        // Read public key from PEM
        BIO* bio = BIO_new_mem_buf(publicKey.c_str(), -1);
        EC_KEY* ecKey = PEM_read_bio_EC_PUBKEY(bio, nullptr, nullptr, nullptr);
        BIO_free(bio);
        
        if (!ecKey) {
            return false;
        }
        
        // Hash the message
        unsigned char hash[SHA256_DIGEST_LENGTH];
        SHA256_CTX sha256;
        SHA256_Init(&sha256);
        SHA256_Update(&sha256, message.c_str(), message.length());
        SHA256_Final(hash, &sha256);
        
        // Convert hex signature to binary
        unsigned char sigBinary[256];
        size_t sigLen = 0;
        for(size_t i = 0; i < signature.length(); i += 2) {
            std::string byte = signature.substr(i, 2);
            sigBinary[sigLen++] = (unsigned char)std::stoi(byte, nullptr, 16);
        }
        
        // Verify signature
        EVP_PKEY* pkey = EVP_PKEY_new();
        EVP_PKEY_assign_EC_KEY(pkey, ecKey);
        
        EVP_MD_CTX* mdctx = EVP_MD_CTX_new();
        int verified = EVP_DigestVerify(mdctx, sigBinary, sigLen, hash, SHA256_DIGEST_LENGTH);
        
        EVP_MD_CTX_free(mdctx);
        EVP_PKEY_free(pkey);
        
        return verified == 1;
    } catch (...) {
        return false;
    }
}

std::string Crypto::getPublicKeyFromPrivate(const std::string& privateKey) {
    BIO* bio = BIO_new_mem_buf(privateKey.c_str(), -1);
    EC_KEY* ecKey = PEM_read_bio_ECPrivateKey(bio, nullptr, nullptr, nullptr);
    BIO_free(bio);
    
    if (!ecKey) {
        throw std::runtime_error("Failed to read private key");
    }
    
    BIO* pubBio = BIO_new(BIO_s_mem());
    PEM_write_bio_EC_PUBKEY(pubBio, ecKey);
    
    BUF_MEM* pubBufMem;
    BIO_get_mem_ptr(pubBio, &pubBufMem);
    std::string publicKey(pubBufMem->data, pubBufMem->length);
    
    BIO_free(pubBio);
    EC_KEY_free(ecKey);
    
    return publicKey;
}
