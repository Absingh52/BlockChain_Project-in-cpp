#include "Blockchain.h"

int main() {
    Blockchain myBlockchain;

    myBlockchain.addBlock("First transaction: Vivek pays 5 BTC to Abhishek");
    myBlockchain.addBlock("Second transaction: Abhishek pays 2 BTC to Rohan");

    myBlockchain.printBlockchain();

    return 0;
}
