// prevents redefination of the classes in multiple cpp files 
// like if class is already define then dont define it again just it  

/*
1=>Wallets + Digital Signatures

Dikhata hai ki tumhe cryptography aur security samajh hai.

Ye hi core hai blockchain ka.

2=>Transaction Pool + Miner Rewards

Dikhata hai ki tumhe blockchain ka economic incentive model samajh hai.

Miner reward + fees = motivation to mine → real-world alignment.

3=>Blockchain Explorer CLI

Tumhari chain ke saath interact karne ka tool dega.

Interviewer ko demo dene ka sabse simple aur clear way.

4=>Persistence (file/db)

Ye project ko real application jaisa bana dega (program band karke dubara chalane par chain wahi se continue hogi).

Software engineering value: file I/O, serialization, reliability.
*/
#ifndef BLOCKCHAIN_H
#define BLOCKCHAIN_H
// header files for declaration 
#include<iostream>
#include<vector>
#include<iomanip>
#include<ctime>
#include<string>
#include<sstream>
#include <openssl/sha.h>

// sstream take a string and convert it into stream and vice versa

using namespace std;


struct Transaction {
    string senderPubKey;
    string receiverPubKey;
    string timestamp;
    double amount;
    string signatureHex;


    Transaction( const string& s,const string& r, const double& a  ){
        senderPubKey=s;
        receiverPubKey=r;
        amount=a;
        time_t now=time(0);
        char buf[80];
        strftime(buf,sizeof(buf),"%Y-%m-%d %X",localtime(&now));
        timestamp=string(buf);

    }
    // For human-readable printing
    string toString() const {
        stringstream ss;
        ss << senderPubKey << " | " << receiverPubKey << " | "
           << fixed << setprecision(8) << amount << " BTC "
           << " at " << timestamp;
        return ss.str();
    }

    // For signing and verifying (deterministic, no extra formatting)
    string canonicalString() const {
        stringstream ss;
        ss << senderPubKey << "|" 
           << receiverPubKey << "|" 
           << fixed << setprecision(8) << amount << "|" 
           << timestamp;
        return ss.str();
    }

};
string sha256(const string str);

// class for block 
class Block
{
    public:
        // index of the block in the chain
        int index;
        // stores current time when the block is created
        string timestamp;
        // actual (information) stores inside the block eg:transcations 
        vector<Transaction>transcation;
        // hash of the previous block so that new block can link
        string prevHash;
        // hash of the current block(its unique digital fiingerprint)
        string hash;
        // merkleroot is the hash of all transcations 
        string merkleRoot;

        // constructer (intialize the index and data and previous hash)
        Block(int idx,vector<Transaction> trx,string prevHash);
        // function for generating a unique hash for the block by combining the index,timestamp,data and prevHash
        string calculateHash()const;
        // mines Block
        void mineBlock(int difficulty);
        // gets system time for storing the block as a string(for timestamp)
        string getTime() const;
        // nonce for hashing count with diffculty level(POW)
        long long nonce;
        // function for calculating the merkelroot
        string calculateMerkleroot()  const;
};
// class for blockchain which define the chain of blocks and new blocks in the chain
class Blockchain{
    private:
        vector<Block>chain;// chain wala vector
        vector<Transaction>mempool;// ye transaction wala vector jha block m dalne se phle store hogi
        int difficulty;
        int targetBlocktime;
        double blockreward=50.0; 
        public:
        // constructer which intialize the blockchain 
        Blockchain(int diff,int targetTime);
        // Returns the last block in the chain to know where to link the new block
        Block& getLatestBlock();
        // creates new block with given data and adds its to the chain
        void addTransaction(const Transaction &tx); //mempool m add hogi transaction
        void minePendingTransactions(const string& minerAddress); //mine all pending transactions 
      
        // print all the blocks from the  blockchain for debugging or output
        void printBlockchain() const;
        // check validity of chain
        bool isChainValid()const;

};
#endif