#include "Blockchain.h"
// openssl for SHA-256 hashing for security algorithm 
#include<openssl/sha.h>
#include<iomanip>
#include<string>
#include<ctime>
using namespace std;

// convert data to SHA-256 hash
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
    Block::Block(int idx,string dta,string prevHash){
      this->index=idx;
      this->data=dta;
      this->prevHash=prevHash;
      this->timestamp=getTime();
       this->nonce=0;
      this->hash=calculateHash();
     
    }
//  generating hash for every block by combining the index+data+timestamp+prevHash
   string Block::calculateHash(){
      string record= to_string(index)+timestamp+prevHash+data+to_string(nonce);
      return sha256(record);
   }
  
  //  Mines the block first until hash starts from zero;
  void Block::mineBlock(int difficulty ){
      string target(difficulty,'0');
      while(hash.substr(0,difficulty) != target){
          nonce++;
          hash=calculateHash();
      }
      cout<<"Blocked mined: "<<hash<<"(nonce="<<nonce<<")"<<endl;
  }

// with help of gettime() we can get time from current system
   string Block::getTime(){
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

  //  blockchain
  Blockchain::Blockchain(int diff,int targetTime){
      difficulty=(diff>=1? diff :1);
      targetBlocktime=(targetTime>=1? targetTime : 1);
      Block genesis(0, " famous Block", "0");
      genesis.mineBlock(difficulty);
      chain.push_back(genesis);
  }
  // last_BlocK_position
  Block& Blockchain::getLatestBlock() {
    return chain.back();
  }
// addBlock
void Blockchain::addBlock(string data){
    Block newBlock(chain.size(), data, getLatestBlock().hash); // creating new block with this data
    time_t start =time(0);
    newBlock.mineBlock(difficulty);
    time_t end=time(0);

    chain.push_back(newBlock);

    // mining time adjust on the basis of time taken for mining one block
    int mineTime=int(difftime(end,start));
    // case 1: if minning time is less then target time increase difficulty make it more secure
    if(mineTime<targetBlocktime){
      difficulty++;
      cout<<"Difficulty increased to :"<<difficulty<<endl;
    }   
    // case 2: if mining time is more then target time then dec difficulty make it faster 
    else if(mineTime > targetBlocktime && difficulty>1){
          difficulty--;
          cout<<"Difficulty decreased to :"<<difficulty<<endl;
    }
}


// Print blockchain

void Blockchain::printBlockchain(){
  for(auto &block:chain){
     cout << "Index: " << block.index << endl;
        cout << "Timestamp: " << block.timestamp << endl;
        cout << "Data: " << block.data << endl;
        cout << "PrevHash: " << block.prevHash << endl;
        cout << "Hash: " << block.hash << endl;
         cout << "Nonce: " << block.nonce << endl;
        cout << endl;
  }
}

// check chain validation 
bool Blockchain::isChainValid(){
      for(size_t i=1;i<chain.size();i++){
        Block currentBlock=chain[i];
        Block prevBlock=chain[i-1];

        if(currentBlock.hash != currentBlock.calculateHash()){
            return false;
        }
        else if(prevBlock.hash != prevBlock.calculateHash()){
          return false;
        }
      }
      return true;
}
