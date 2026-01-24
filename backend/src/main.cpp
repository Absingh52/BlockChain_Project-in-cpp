#include "../include/blockchain.h"
#include "../include/wallet.h"
#include "../include/crypto.h"
#include <iostream>
#include <cstring>
#include <sstream>
#include <regex>
#include <iomanip>
#include <cmath>
#include <ctime>

#ifdef _WIN32
    #include <winsock2.h>
    #include <ws2tcpip.h>
    #pragma comment(lib, "ws2_32.lib")
    #define close closesocket
    typedef int socklen_t;
#else
    #include <sys/socket.h>
    #include <netinet/in.h>
    #include <arpa/inet.h>
    #include <unistd.h>
    #include <signal.h>
#endif

// Global blockchain instance
Blockchain blockchain(2); // difficulty = 2

// Dummy transaction structure for demo
struct DummyTransaction {
    std::string sender;
    std::string receiver;
    double amount;
    long long timestamp;
};

// Vector to store dummy transactions in memory
std::vector<DummyTransaction> dummyTransactions;

// Simple JSON builder helpers
std::string jsonString(const std::string& value) {
    std::string escaped;
    for (char c : value) {
        if (c == '"') escaped += "\\\"";
        else if (c == '\\') escaped += "\\\\";
        else if (c == '\n') escaped += "\\n";
        else if (c == '\r') escaped += "\\r";
        else if (c == '\t') escaped += "\\t";
        else escaped += c;
    }
    return "\"" + escaped + "\"";
}

std::string jsonNumber(double value) {
    std::ostringstream oss;
    if (value == std::floor(value)) {
        oss << static_cast<long long>(value);
    } else {
        oss << std::fixed << std::setprecision(2) << value;
    }
    return oss.str();
}

std::string extractJsonString(const std::string& json, const std::string& key) {
    std::string pattern = "\"" + key + "\"\\s*:\\s*\"([^\"]*)\"";
    std::regex re(pattern);
    std::smatch match;
    if (std::regex_search(json, match, re)) {
        return match[1];
    }
    return "";
}

double extractJsonNumber(const std::string& json, const std::string& key) {
    std::string pattern = "\"" + key + "\"\\s*:\\s*([0-9.]+)";
    std::regex re(pattern);
    std::smatch match;
    if (std::regex_search(json, match, re)) {
        return std::stod(match[1]);
    }
    return 0.0;
}

// Serve HTTP responses
void sendHttpResponse(int clientSocket, int statusCode, const std::string& contentType, const std::string& body) {
    std::stringstream response;
    response << "HTTP/1.1 " << statusCode << " OK\r\n";
    response << "Content-Type: " << contentType << "\r\n";
    response << "Access-Control-Allow-Origin: *\r\n";
    response << "Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n";
    response << "Access-Control-Allow-Headers: Content-Type\r\n";
    response << "Content-Length: " << body.length() << "\r\n";
    response << "Connection: close\r\n\r\n";
    response << body;
    
    send(clientSocket, response.str().c_str(), response.str().length(), 0);
}

// Handle POST /api/createWallet
void handleCreateWallet(int clientSocket) {
    try {
        Wallet wallet;
        std::string response = "{\"success\":true,\"publicKey\":" + jsonString(wallet.getPublicKey()) + 
                               ",\"privateKey\":" + jsonString(wallet.getPrivateKey()) + "}";
        sendHttpResponse(clientSocket, 200, "application/json", response);
    } catch (const std::exception& e) {
        std::string response = "{\"success\":false,\"error\":" + jsonString(e.what()) + "}";
        sendHttpResponse(clientSocket, 500, "application/json", response);
    }
}

// Handle POST /api/transaction
void handleTransaction(int clientSocket, const std::string& requestBody) {
    try {
        Transaction tx;
        tx.senderPublicKey = extractJsonString(requestBody, "senderPublicKey");
        tx.receiverPublicKey = extractJsonString(requestBody, "receiverPublicKey");
        tx.amount = extractJsonNumber(requestBody, "amount");
        tx.timestamp = (long long)extractJsonNumber(requestBody, "timestamp");
        tx.signatureHex = extractJsonString(requestBody, "signatureHex");
        tx.transactionHash = extractJsonString(requestBody, "transactionHash");
        
        if (blockchain.addTransaction(tx)) {
            std::string response = "{\"success\":true,\"message\":\"Transaction added to pending pool\",\"transactionHash\":" + 
                                   jsonString(tx.transactionHash) + "}";
            sendHttpResponse(clientSocket, 200, "application/json", response);
        } else {
            std::string response = "{\"success\":false,\"error\":\"Transaction validation failed\"}";
            sendHttpResponse(clientSocket, 400, "application/json", response);
        }
    } catch (const std::exception& e) {
        std::string response = "{\"success\":false,\"error\":" + jsonString(e.what()) + "}";
        sendHttpResponse(clientSocket, 500, "application/json", response);
    }
}

// Handle POST /api/mine
void handleMine(int clientSocket, const std::string& requestBody) {
    try {
        std::string minerPublicKey = extractJsonString(requestBody, "minerPublicKey");
        
        Block minedBlock = blockchain.minePendingTransactions(minerPublicKey);
        
        std::string response = "{\"success\":true,\"block\":{\"index\":" + jsonNumber(minedBlock.index) + 
                               ",\"hash\":" + jsonString(minedBlock.hash) + 
                               ",\"previousHash\":" + jsonString(minedBlock.previousHash) + 
                               ",\"nonce\":" + jsonNumber(minedBlock.nonce) + 
                               ",\"timestamp\":" + jsonNumber(minedBlock.timestamp) + 
                               ",\"transactionCount\":" + jsonNumber(minedBlock.transactions.size()) + "}}";
        sendHttpResponse(clientSocket, 200, "application/json", response);
    } catch (const std::exception& e) {
        std::string response = "{\"success\":false,\"error\":" + jsonString(e.what()) + "}";
        sendHttpResponse(clientSocket, 500, "application/json", response);
    }
}

// Handle GET /api/blocks
void handleGetBlocks(int clientSocket) {
    try {
        std::string response = "{\"success\":true,\"blockCount\":" + jsonNumber(blockchain.getChain().size()) + 
                               ",\"difficulty\":" + jsonNumber(blockchain.getDifficulty()) + 
                               ",\"pendingTransactions\":" + jsonNumber(blockchain.getPendingTransactions().size()) + 
                               ",\"blocks\":[";
        
        bool first = true;
        for (const auto& block : blockchain.getChain()) {
            if (!first) response += ",";
            response += "{\"index\":" + jsonNumber(block.index) + 
                       ",\"hash\":" + jsonString(block.hash) + 
                       ",\"previousHash\":" + jsonString(block.previousHash) + 
                       ",\"nonce\":" + jsonNumber(block.nonce) + 
                       ",\"timestamp\":" + jsonNumber(block.timestamp) + 
                       ",\"transactionCount\":" + jsonNumber(block.transactions.size()) + 
                       ",\"transactions\":[";
            
            bool txFirst = true;
            for (const auto& tx : block.transactions) {
                if (!txFirst) response += ",";
                response += "{\"sender\":" + jsonString(tx.senderPublicKey) + 
                           ",\"receiver\":" + jsonString(tx.receiverPublicKey) + 
                           ",\"amount\":" + jsonNumber(tx.amount) + 
                           ",\"timestamp\":" + jsonNumber(tx.timestamp) + 
                           ",\"hash\":" + jsonString(tx.transactionHash) + "}";
                txFirst = false;
            }
            response += "]}";
            first = false;
        }
        response += "]}";
        
        sendHttpResponse(clientSocket, 200, "application/json", response);
    } catch (const std::exception& e) {
        std::string response = "{\"success\":false,\"error\":" + jsonString(e.what()) + "}";
        sendHttpResponse(clientSocket, 500, "application/json", response);
    }
}

// Handle GET /api/block/{index}
void handleGetBlock(int clientSocket, const std::string& indexStr) {
    try {
        int index = std::stoi(indexStr);
        Block block = blockchain.getBlockByIndex(index);
        
        std::string response = "{\"success\":true,\"block\":{\"index\":" + jsonNumber(block.index) + 
                               ",\"hash\":" + jsonString(block.hash) + 
                               ",\"previousHash\":" + jsonString(block.previousHash) + 
                               ",\"nonce\":" + jsonNumber(block.nonce) + 
                               ",\"timestamp\":" + jsonNumber(block.timestamp) + 
                               ",\"transactions\":[";
        
        bool first = true;
        for (const auto& tx : block.transactions) {
            if (!first) response += ",";
            response += "{\"sender\":" + jsonString(tx.senderPublicKey) + 
                       ",\"receiver\":" + jsonString(tx.receiverPublicKey) + 
                       ",\"amount\":" + jsonNumber(tx.amount) + 
                       ",\"timestamp\":" + jsonNumber(tx.timestamp) + 
                       ",\"hash\":" + jsonString(tx.transactionHash) + "}";
            first = false;
        }
        response += "]}}";
        
        sendHttpResponse(clientSocket, 200, "application/json", response);
    } catch (const std::exception& e) {
        std::string response = "{\"success\":false,\"error\":" + jsonString(e.what()) + "}";
        sendHttpResponse(clientSocket, 500, "application/json", response);
    }
}

// Handle GET /api/balance/{address}
void handleGetBalance(int clientSocket, const std::string& address) {
    try {
        double balance = blockchain.getBalance(address);
        
        std::string response = "{\"success\":true,\"address\":" + jsonString(address) + 
                               ",\"balance\":" + jsonNumber(balance) + "}";
        
        sendHttpResponse(clientSocket, 200, "application/json", response);
    } catch (const std::exception& e) {
        std::string response = "{\"success\":false,\"error\":" + jsonString(e.what()) + "}";
        sendHttpResponse(clientSocket, 500, "application/json", response);
    }
}

// Handle POST /api/send (DUMMY DEMO)
void handleDummySend(int clientSocket, const std::string& requestBody) {
    try {
        std::string sender = extractJsonString(requestBody, "sender");
        std::string receiver = extractJsonString(requestBody, "receiver");
        double amount = extractJsonNumber(requestBody, "amount");
        
        if (sender.empty() || receiver.empty() || amount <= 0) {
            std::string response = "{\"success\":false,\"error\":\"Invalid sender, receiver, or amount\"}";
            sendHttpResponse(clientSocket, 400, "application/json", response);
            return;
        }
        
        // Store dummy transaction in memory
        DummyTransaction dummyTx;
        dummyTx.sender = sender;
        dummyTx.receiver = receiver;
        dummyTx.amount = amount;
        dummyTx.timestamp = (long long)(std::time(nullptr) * 1000); // milliseconds
        
        dummyTransactions.push_back(dummyTx);
        
        std::string response = "{\"success\":true,\"message\":\"Dummy transaction stored\"}";
        sendHttpResponse(clientSocket, 200, "application/json", response);
    } catch (const std::exception& e) {
        std::string response = "{\"success\":false,\"error\":" + jsonString(e.what()) + "}";
        sendHttpResponse(clientSocket, 500, "application/json", response);
    }
}

// Handle GET /api/mempool (DUMMY DEMO)
void handleDummyMempool(int clientSocket) {
    try {
        std::string response = "{\"success\":true,\"transactions\":[";
        
        bool first = true;
        for (const auto& tx : dummyTransactions) {
            if (!first) response += ",";
            response += "{\"sender\":" + jsonString(tx.sender) + 
                       ",\"receiver\":" + jsonString(tx.receiver) + 
                       ",\"amount\":" + jsonNumber(tx.amount) + 
                       ",\"timestamp\":" + jsonNumber(tx.timestamp) + "}";
            first = false;
        }
        
        response += "],\"count\":" + jsonNumber(dummyTransactions.size()) + "}";
        sendHttpResponse(clientSocket, 200, "application/json", response);
    } catch (const std::exception& e) {
        std::string response = "{\"success\":false,\"error\":" + jsonString(e.what()) + "}";
        sendHttpResponse(clientSocket, 500, "application/json", response);
    }
}

// Parse HTTP request and route to handler
void handleRequest(int clientSocket, const std::string& request) {
    std::istringstream iss(request);
    std::string method, path, version;
    iss >> method >> path >> version;
    
    // Extract request body
    size_t bodyStart = request.find("\r\n\r\n");
    std::string body = (bodyStart != std::string::npos) ? request.substr(bodyStart + 4) : "";
    
    // Handle OPTIONS (CORS preflight)
    if (method == "OPTIONS") {
        sendHttpResponse(clientSocket, 200, "text/plain", "");
        return;
    }
    
    // Route requests
    if (method == "POST" && path == "/api/createWallet") {
        handleCreateWallet(clientSocket);
    } else if (method == "POST" && path == "/api/transaction") {
        handleTransaction(clientSocket, body);
    } else if (method == "POST" && path == "/api/mine") {
        handleMine(clientSocket, body);
    } else if (method == "POST" && path == "/api/send") {
        handleDummySend(clientSocket, body);
    } else if (method == "GET" && path == "/api/blocks") {
        handleGetBlocks(clientSocket);
    } else if (method == "GET" && path == "/api/mempool") {
        handleDummyMempool(clientSocket);
    } else if (method == "GET" && path.substr(0, 11) == "/api/block/") {
        std::string indexStr = path.substr(11);
        handleGetBlock(clientSocket, indexStr);
    } else if (method == "GET" && path == "/api/balance/") {
        // Catch routes that start with /api/balance/
        handleGetBalance(clientSocket, "");
    } else if (method == "GET" && path.substr(0, 12) == "/api/balance/") {
        std::string address = path.substr(12);
        handleGetBalance(clientSocket, address);
    } else {
        std::string response = "{\"error\":\"Endpoint not found\"}";
        sendHttpResponse(clientSocket, 404, "application/json", response);
    }
}

int main() {
#ifdef _WIN32
    WSADATA wsa;
    if (WSAStartup(MAKEWORD(2, 2), &wsa) != 0) {
        std::cerr << "WSAStartup failed" << std::endl;
        return 1;
    }
#else
    signal(SIGPIPE, SIG_IGN);
#endif
    
    int serverSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (serverSocket < 0) {
        std::cerr << "Failed to create socket" << std::endl;
        return 1;
    }
    
    int opt = 1;
#ifdef _WIN32
    setsockopt(serverSocket, SOL_SOCKET, SO_REUSEADDR, (char*)&opt, sizeof(opt));
#else
    setsockopt(serverSocket, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));
#endif
    
    struct sockaddr_in serverAddr;
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_addr.s_addr = htonl(INADDR_ANY);
    serverAddr.sin_port = htons(5000);
    
    if (bind(serverSocket, (struct sockaddr*)&serverAddr, sizeof(serverAddr)) < 0) {
        std::cerr << "Failed to bind socket" << std::endl;
        close(serverSocket);
        return 1;
    }
    
    if (listen(serverSocket, 5) < 0) {
        std::cerr << "Failed to listen" << std::endl;
        close(serverSocket);
        return 1;
    }
    
    std::cout << "Blockchain server running on http://localhost:5000" << std::endl;
    
    while (true) {
        struct sockaddr_in clientAddr;
        socklen_t clientAddrLen = sizeof(clientAddr);
        
        int clientSocket = accept(serverSocket, (struct sockaddr*)&clientAddr, &clientAddrLen);
        if (clientSocket < 0) {
            std::cerr << "Failed to accept connection" << std::endl;
            continue;
        }
        
        // Read request
        char buffer[8192] = {0};
        int bytesRead = recv(clientSocket, buffer, sizeof(buffer) - 1, 0);
        
        if (bytesRead > 0) {
            buffer[bytesRead] = '\0';
            std::string request(buffer);
            handleRequest(clientSocket, request);
        }
        
        close(clientSocket);
    }
    
    close(serverSocket);
    return 0;
}
