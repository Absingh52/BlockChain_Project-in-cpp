cmake_minimum_required(VERSION 3.10)

project(SimpleBlockchain)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# Manually point CMake to OpenSSL
set(OPENSSL_ROOT_DIR "C:/OpenSSL-Win64")
set(OPENSSL_INCLUDE_DIR "${OPENSSL_ROOT_DIR}/include")
set(OPENSSL_LIBRARIES "${OPENSSL_ROOT_DIR}/lib")

find_package(OpenSSL REQUIRED)

add_executable(SimpleBlockchain
    main.cpp
    Blockchain.cpp
)

target_include_directories(SimpleBlockchain PRIVATE ${OPENSSL_INCLUDE_DIR})
target_link_libraries(SimpleBlockchain PRIVATE OpenSSL::SSL OpenSSL::Crypto)
