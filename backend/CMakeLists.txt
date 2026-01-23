cmake_minimum_required(VERSION 3.10)
project(BlockchainServer)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(OpenSSL REQUIRED)

include_directories(${OPENSSL_INCLUDE_DIR})
include_directories(${CMAKE_SOURCE_DIR}/include)
include_directories(${CMAKE_SOURCE_DIR}/..)

add_executable(blockchain_server
    src/main.cpp
    src/crypto.cpp
    src/wallet.cpp
    src/block.cpp
    src/blockchain.cpp
)

target_link_libraries(blockchain_server 
    OpenSSL::Crypto 
    OpenSSL::SSL
)

if(WIN32)
    target_link_libraries(blockchain_server ws2_32)
endif()
