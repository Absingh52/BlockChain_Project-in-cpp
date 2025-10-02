#include "Blockchain.h"
// openssl for SHA-256 hashing for security algorithm 
#include<openssl/sha.h>
#include<iomanip>
#include<string>
#include<ctime>
#include "Wallet.h"
using namespace std;

// convert data to SHA-256 hash this is the id of the block
string sha256(const string str){
    // SHA256_DIGEST_LENGTH is of 32 bytes which is 256 bits 
    // unsigned char range 0 to 255 
    unsigned char hash[SHA256_DIGEST_LENGTH];
    // SHA256 is openssl function for hashing the data
    SHA256((unsigned char*)str.c_str(),str.size(),hash);
    /*(unsigned char*)str.c_str() → converts the C++ string into a raw C-style byte array.
      str.size() → length of the input string (number of bytes).
      hash → pointer to the buffer where the 32-byte hash will be stored.*/
    stringstream ss;// convert the binary to string
    for(int i=0;i<SHA256_DIGEST_LENGTH;i++){
        // convert the binary format to hex decimal format,and set atleast 2 characters and if the hex number is 1
        // than fill all empty space with 0,and convert raw byte to integer
        ss<<hex<<setw(2) << setfill('0')<<(int)hash[i];
    }
    //return the binary hash into string 
    return ss.str();
}
// Block constructor
    Block::Block(int idx,vector<Transaction>trx,string prevHash){
      this->index=idx;
      this->transcation=trx;
      this->prevHash=prevHash;
      this->timestamp=getTime();
       this->nonce=0;
      this->merkleRoot=calculateMerkleroot();
      this->hash=calculateHash();
      
    }
//  generating hash for every block by combining the index+data+timestamp+prevHash
   string Block::calculateHash() const{
      string record= to_string(index)+timestamp+prevHash+merkleRoot+to_string(nonce);
      return sha256(record);
   }
  
//merkleroot calculate functionn()
    string Block::calculateMerkleroot() const{
      if(transcation.empty()){
        return "";
      }

      vector<string>merkle;
      for(auto & tx:transcation){
            merkle.push_back(sha256(tx.toString()));

      }

      while(merkle.size()>1){

        if(merkle.size() %2!=0){
           merkle.push_back(merkle.back());
        }

        vector<string>newmerkle;
        for(size_t i=0; i<merkle.size();i+=2){
          newmerkle.push_back(sha256(merkle[i] + merkle[i+1]));
        }
        merkle=newmerkle;
      }
       return merkle[0];
  
    }

  //  Mines the block first until hash starts from zero;
  // (Proof of work)
  void Block::mineBlock(int difficulty ){
      string target(difficulty,'0');
      while(hash.substr(0,difficulty) != target){
          nonce++;
          hash=calculateHash();
      }
      cout<<"Blocked mined: "<<hash<<"(nonce="<<nonce<<")"<<endl;
  }

// with help of gettime() we can get time from current system
   string Block::getTime() const{
      time_t now=time(0);// time_t is a datatype for representing the calender
      // time() fetch the current time from the system its not returns -1
      char buf[80];
      // strftime converts the structre time to string 
      strftime(buf,sizeof(buf),"%Y-%m-%d %X",localtime(&now));
      /*
        in this function localtime coverts timestamp
        into the structre format and then sets it into string format
        and then stores it in the buf array
      */
      return string(buf);
   }

  //  blockchain constructor
  Blockchain::Blockchain(int diff,int targetTime){
      difficulty=(diff>=1? diff :1);
      targetBlocktime=(targetTime>=1? targetTime : 1);
      //  genesis block with dummy transaction 
      vector<Transaction>genesisTxs={Transaction("genesis","network",0.0)};
       Block genesis(0, genesisTxs, "0");
      genesis.mineBlock(difficulty);
      chain.push_back(genesis);
  }
  // last_BlocK_position
  Block& Blockchain::getLatestBlock() {
    return chain.back();
  }
// add transaction to mempool
void Blockchain::addTransaction(const Transaction &tx)
{
  // check if the transaction is of the system if yes then continue
  if(tx.senderPubKey != "System"){
      if(! Wallet::verify(tx.canonicalString(), tx.senderPubKey,tx.signatureHex)){
            cout<<" Invalid transaction signautre"<<endl;
            return;
      }
  }
  mempool.push_back(tx);
  cout<<"Transaction added to memepool :"<<tx.toString()<<endl;
}

// Mine all pending transactions 
void Blockchain::minePendingTransactions(const string& minerAddress){
    // Add miner reward 
      Transaction rewardTx("System",minerAddress,blockreward);
      rewardTx.signatureHex="System";
      mempool.insert(mempool.begin(),rewardTx);

      //  create new block with the mempool tx
      Block newBlock(chain.size(),mempool,getLatestBlock().hash);

      time_t start=time(0);
      newBlock.mineBlock(difficulty);
      time_t end=time(0);

      chain.push_back(newBlock);
      mempool.clear();
      int minetime= int(difftime(end,start));
      if(minetime<targetBlocktime){
        difficulty++;
        cout<< "Difficulty increased to: " << difficulty << endl;
      }
      else{
        difficulty--;
        cout<<"Difficulty decreased to: "<< difficulty<< endl;
      }

}

// Print blockchain
void Blockchain::printBlockchain() const {
    cout << "\n=== Blockchain (" << chain.size() << " blocks) ===\n\n";
    for (const auto& block : chain) {
        cout << "Index: " << block.index << endl;
        cout << "Timestamp: " << block.timestamp << endl;
        cout << "PrevHash: " << block.prevHash.substr(0, 16) << "..." << endl;
        cout << "MerkleRoot: " << block.merkleRoot.substr(0, 16) << "..." << endl;
        cout << "Hash: " << block.hash.substr(0, 16) << "..." << endl;
        cout << "Nonce: " << block.nonce << endl;
        cout << "Transactions:" << endl;
        for (auto &tx : block.transcation) {
            cout << "  - " << tx.toString() << endl;
        }
        cout << "-----------------------------\n";
    }
}

bool Blockchain::isChainValid() const {
    for (size_t i = 1; i < chain.size(); ++i) {
        const Block& current = chain[i];
        const Block& prev = chain[i - 1];

        if (current.hash != current.calculateHash()) return false;
        if (current.prevHash != prev.hash) return false;
        if (current.merkleRoot != current.calculateMerkleroot()) return false;
    }
    return true;
}