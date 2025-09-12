cd $PSScriptRoot

if (Test-Path build) { Remove-Item -Recurse -Force build }
mkdir build
cd build

cmake ..\blockchain_project
cmake --build . --config Release
.\blockchain.exe
