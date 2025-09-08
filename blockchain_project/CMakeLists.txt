cmake_minimum_required(VERSION 3.10)

# Project Name
project(SimpleBlockchain)

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

find_package(OpenSSL REQUIRED)

# Add executable
add_executable(SimpleBlockchain
    main.cpp
    Blockchain.cpp
    Blockchain.h
)

target_link_libraries(SimpleBlockchain OpenSSL::SSL OpenSSL::Crypto)
