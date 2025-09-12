// prevents redefination of the classes in multiple cpp files 
// like if class is already define then dont define it again just it  
#ifndef BLOCKCHAIN_H
#define BLOCKCHAIN_H
// header files for declaration 
#include<iostream>
#include<vector>
#include<ctime>
#include<string>
#include<sstream>
#include <openssl/sha.h>

// sstream take a string and convert it into stream and vice versa

using namespace std;
// class for block 
class Block
{
    public:
        // index of the block in the chain
        int index;
        // stores current time when the block is created
        string timestamp;
        // actual (information) stores inside the block eg:transcations 
        string data;
        // hash of the previous block so that new block can link
        string prevHash;
        // hash of the current block(its unique digital fiingerprint)
        string hash;

        // constructer (intialize the index and data and previous hash)
        Block(int idx,string dta,string prevHash);
        // function for generating a unique hash for the block by combining the index,timestamp,data and prevHash
        string calculateHash();
        // mines Block
        void mineBlock(int difficulty);
        // gets system time for storing the block as a string(for timestamp)
        string getTime();
        // nonce for hashing count with diffculty level(POW)
        long long nonce;
};
// class for blockchain which define the chain of blocks and new blocks in the chain
class Blockchain{
    private:
        vector<Block>chain;
        int difficulty;
        int targetBlocktime;
    public:
        // constructer which intialize the blockchain 
        Blockchain(int diff,int targetTime);
        // Returns the last block in the chain to know where to link the new block
        Block& getLatestBlock();
        // creates new block with given data and adds its to the chain
        void addBlock(string data);
        // print all the blocks from the  blockchain for debugging or output
        void printBlockchain();
        // check validity of chain
        bool isChainValid();

};
#endif