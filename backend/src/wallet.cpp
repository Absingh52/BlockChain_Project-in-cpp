#include "../include/wallet.h"
#include "../include/crypto.h"

Wallet::Wallet() {
    // Generate new key pair
    Crypto::generateKeyPair(publicKey, privateKey);
}

Wallet::Wallet(const std::string& privKey) : privateKey(privKey) {
    // Derive public key from private key
    publicKey = Crypto::getPublicKeyFromPrivate(privKey);
}

std::string Wallet::getPublicKey() const {
    return publicKey;
}

std::string Wallet::getPrivateKey() const {
    return privateKey;
}

std::string Wallet::signTransaction(const std::string& transactionData) const {
    return Crypto::signMessage(transactionData, privateKey);
}
