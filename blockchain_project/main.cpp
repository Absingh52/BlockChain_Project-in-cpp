#include "Blockchain.h"
#include <limits>

int main() {
    cout << "=== Mini Blockchain (C++) ===" << endl;

    int startDifficulty, targetTime;
    cout << "Enter starting difficulty (2-5): ";
    if (!(cin >> startDifficulty)) {
        startDifficulty = 3;
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
    }

    cout << "Enter target block time (seconds): ";
    if (!(cin >> targetTime)) {
        targetTime = 5;
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
    }

    Blockchain myChain(startDifficulty, targetTime);

    // 1️⃣ Inline demo transactions
    myChain.addBlock({
        {"Vivek", "Abhishek", 500},
        {"Abhishek", "Rohan", 20}
    });

    myChain.addBlock({
        {"Rohan", "Alice", 15},
        {"Alice", "Vivek", 7},
        {"Bob", "Charlie", 314159}
    });

    // 2️⃣ User-input transactions
    int txCount;
    cout << "\nEnter number of transactions for new block: ";
    cin >> txCount;

    vector<Transaction> userTxs;
    for (int i = 0; i < txCount; i++) {
        string sender, receiver;
        double amount;

        cout << "Transaction " << (i+1) << " sender: ";
        cin >> sender;
        cout << "Transaction " << (i+1) << " receiver: ";
        cin >> receiver;
        cout << "Transaction " << (i+1) << " amount: ";
        cin >> amount;

        userTxs.emplace_back(sender, receiver, amount);
    }

    myChain.addBlock(userTxs);

    // Print blockchain
    myChain.printBlockchain();

    cout << "Blockchain valid? " 
         << (myChain.isChainValid() ? "Yes " : "No") 
         << endl;

    return 0;
}
