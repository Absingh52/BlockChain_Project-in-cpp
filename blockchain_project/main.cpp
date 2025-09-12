#include "Blockchain.h"

int main() {
    int userDifficulty,targetTime;
    cout << "Enter starting difficulty: ";
    cin >> userDifficulty;
    cout << "Enter target block time (seconds): ";
    cin >> targetTime;

    Blockchain myBlockchain(userDifficulty,targetTime);

    myBlockchain.addBlock("First transaction: Vivek pays 5 BTC to Abhishek");
    myBlockchain.addBlock("Second transaction: Abhishek pays 2 BTC to Rohan");
    myBlockchain.addBlock("Third transaction: Rohan pays 1 BTC to Alice");

    myBlockchain.printBlockchain();
    
    cout << "Blockchain valid? "<< (myBlockchain.isChainValid() ? "Yes" : "No") << endl;

    return 0;
}
