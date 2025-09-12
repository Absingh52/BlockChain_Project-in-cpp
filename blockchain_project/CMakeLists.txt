cmake_minimum_required(VERSION 3.15)

# Project name
project(BlockchainProject LANGUAGES CXX)

# Use C++17 (you can change to C++20 if needed)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Add the source files
add_executable(blockchain
    main.cpp
    Blockchain.cpp
)

# Find OpenSSL
find_package(OpenSSL REQUIRED)

# Link OpenSSL libraries
target_link_libraries(blockchain PRIVATE OpenSSL::SSL OpenSSL::Crypto)

# Include OpenSSL headers
target_include_directories(blockchain PRIVATE ${OPENSSL_INCLUDE_DIR})
