#include "Blockchain.h"
#include "Wallet.h"
#include <iostream>
using namespace std;

int main() {
    cout << "=== Mini Blockchain (C++) ===" << endl;

    // Blockchain banate hi genesis block mine ho jayega
    Blockchain myChain(3, 5);

    // Wallets create
    Wallet alice;
    Wallet bob;
    Wallet miner;

    // Alice -> Bob
    Transaction tx1(alice.public_key, bob.public_key, 10.0);
    tx1.signatureHex = alice.sign(tx1.canonicalString());
    myChain.addTransaction(tx1);

    // Bob -> Alice
    Transaction tx2(bob.public_key, alice.public_key, 5.0);
    tx2.signatureHex = bob.sign(tx2.canonicalString());
    myChain.addTransaction(tx2);

    // Miner mine karega
    cout << "\nMining pending transactions...\n";
    myChain.minePendingTransactions(miner.public_key);

    // Print poora chain
    myChain.printBlockchain();

    // Validate chain
    cout << "\nBlockchain valid? "
         << (myChain.isChainValid() ? "Yes " : "No ") << endl;

    return 0;
}
