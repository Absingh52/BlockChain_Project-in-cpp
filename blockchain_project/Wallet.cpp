#include "Wallet.h"

using namespace std;
Wallet::Wallet(){
    /*
        generate the  EC_KEY object that is configure to secp... 
        for its curve parameters
    */
    key=EC_KEY_new_by_curve_name(NID_secp256k1);
    if(!key){
        throw runtime_error("EC_KEY_new_by_curve_name failed");
    }
    
    // with help of of that key object we create private and public keys 
    // EC_KEY_generate_key is a function that generate the keys basis on the parametersx
    //  also first it creates the private key and then public private->public
    if(!EC_KEY_generate_key(key)){
            throw runtime_error("EC_KEY_generate_key failed");
    }

    // exporting the private key to PEM format
    BIO* privbio=BIO_new(BIO_s_mem());// creating memory buffer
    // paasing private key to memorybuffer and nullptrs are for no encrypt and password
    PEM_write_bio_ECPrivateKey(privbio,key,nullptr,nullptr,0,nullptr,nullptr);
    
    char* pdata;
    long plen=BIO_get_mem_data(privbio,&pdata);// length and address of the data
    private_key.assign(pdata,plen);// assign the pem formatted private key with length 

    BIO_free(privbio);// free the memory buffer

    //  export the public key to Pem format

     BIO* pubbio=BIO_new(BIO_s_mem());
     PEM_write_bio_EC_PUBKEY(pubbio,key);
     char* qdata;
     long qlen=BIO_get_mem_data(pubbio,&qlen);
     public_key.assign(qdata,qlen);

     BIO_free(pubbio);

}
// free the EC_KEY and free the memory 
Wallet::~Wallet(){
    if(!key){
        EC_KEY_free(key);
    }
}

// sign function of hashing and signature
string Wallet::sign(const string& msg){// here msg parameter is the transaction 

    unsigned char hash[32];
    SHA256((unsigned char*)msg.c_str(),msg.size(),hash);

    // sign the private key
    // creates digital signature 
    ECDSA_SIG* sig=ECDSA_do_sign(hash,32,key);
    if(!sig){
        throw runtime_error("signing  failed!");
    }

    // signature to DER format (binary format)
    unsigned char* der=nullptr;
    int derlen=i2d_ECDSA_SIG(sig,&der);// passing the signature and der use to store the address

    // der to hex string

    stringstream ss;
    for(int i=0;i<derlen;i++){
        ss<<hex<< setw(2)<<setfill('0')<<(int)der[i];
    }


    OPENSSL_free(der);
    ECDSA_SIG_free(sig);

    return ss.str();



}

bool Wallet::verify(const string& msg ,const string&public_key,const string& sigHex){
        // msg 
        unsigned char hash[32];
            SHA256((unsigned char*)msg.c_str(),msg.size(),hash);
        // public key
        BIO* bio=BIO_new_mem_buf(public_key.c_str(),-1);
        EC_KEY* pubKey=PEM_read_bio_EC_PUBKEY(bio,nullptr,nullptr,nullptr);
        BIO_free(bio);
        if(!pubKey){
            return false;
        }

        // signature hex m coverted hai usko bytes m convert karenge wapis 
        vector<unsigned char>sigBytes;
        for (size_t i = 0; i < sigHex.size(); i+=2)
        {
            /* code */
            string bytestring=sigHex.substr(i,2);
            unsigned char b = (unsigned char) strtol(bytestring.c_str(), nullptr, 16);
             sigBytes.push_back(b);
        }

        // now convert der to signature
         const unsigned char* p = sigBytes.data();
            ECDSA_SIG* sig = d2i_ECDSA_SIG(nullptr, &p, sigBytes.size());
            if (!sig) {
                EC_KEY_free(pubKey);
                return false;
             }

            //  verify

            int ret =ECDSA_do_verify(hash,32,sig,pubKey);
             ECDSA_SIG_free(sig);
             EC_KEY_free(pubKey);

            return ret == 1;

        

} 