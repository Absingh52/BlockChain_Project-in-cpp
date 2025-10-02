#include "Blockchain.h"
#include "Wallet.h"
#include <iostream>
using namespace std;

int main() {
    cout << "=== Mini Blockchain with Wallets ===" << endl;

    // Create blockchain
    Blockchain myChain(3, 5);

    // Create wallets for Alice, Bob, and Miner
    Wallet alice;
    Wallet bob;
    Wallet miner;

    cout << "Alice's Public Key: " << alice.public_key.substr(0, 50) << "...\n";
    cout << "Bob's Public Key:   " << bob.public_key.substr(0, 50) << "...\n";
    cout << "Miner's Public Key: " << miner.public_key.substr(0, 50) << "...\n\n";

    // ✅ Step 1: Alice sends 10 to Bob
    Transaction tx1(alice.public_key, bob.public_key, 10.0);
    tx1.signatureHex = alice.sign(tx1.toString()); // sign with Alice's private key
    myChain.addTransaction(tx1);

    // ✅ Step 2: Bob sends 5 back to Alice
    Transaction tx2(bob.public_key, alice.public_key, 5.0);
    tx2.signatureHex = bob.sign(tx2.toString()); // sign with Bob's private key
    myChain.addTransaction(tx2);

    // ✅ Step 3: Mine pending transactions (miner gets reward)
    myChain.minePendingTransactions(miner.public_key);

    // Print the blockchain state
    myChain.printBlockchain();

    cout << "\nBlockchain valid? "
         << (myChain.isChainValid() ? "Yes " : "No ") << endl;

    return 0;
}
