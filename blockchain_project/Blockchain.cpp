#include "Blockchain.h"
// openssl for SHA-256 hashing for security algorithm 
#include<openssl/sha.h>
#include<iomanip>

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
