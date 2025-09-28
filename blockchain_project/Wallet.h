#ifndef WALLET_H
#define WALLET_H
#include <openssl/ec.h> // for ec key
#include <openssl/pem.h> // for PEM format
#include <openssl/sha.h> // for hashing
#include <openssl/ecdsa.h> // for sign in
#include <string>
#include <sstream>
#include <iomanip>
#include <vector>
#include <iostream>
#include <stdexcept>
using namespace std;

class Wallet{

    private:
     // struct pointer for which already predefined in the openssl
     EC_KEY* key;

    public:
         string public_key;
         string private_key;
        
        //  constructor: tob  generate new wallet keys
         
        Wallet();

        // deconstructor :freeup the memory
        ~Wallet();

        // for signature

        string sign(const string &msg);

        // for verify the signature using the hash and public key

         static bool verify(
             const string&pubkey,
             const string& msg,
             const string& signhex
         );
        
};


#endif