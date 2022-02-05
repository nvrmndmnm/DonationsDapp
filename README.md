# DonationsDapp
A simple smart contract that allows users to donate Ethereum and keeps track of contributors.
App is built with Hardhat, so you may make use of tasks to interact with deployed smart contract both on localhost and Ethereum testnets.

Available task commands:
|Command|Required Args|Description|Usage Example|
|--------------|------|-------------------------------|-----------------------------|
|donate|address, amount, network|Donates specified amount of wei from the address to the contract|`hh donate --address 0x0591BBf22F4d436a1d0CCA14A01943Bddb42d9AB --amount 100000 --network rinkeby`|
|donations-sum|address, network|Prints sum of donated ETH from the specified address|`hh donations-sum --address 0x0591BBf22F4d436a1d0CCA14A01943Bddb42d9AB --network rinkeby`|
|donators|network|Prints list of all donators|`hh donators --network rinkeby`|
|redeem|address, amount|Sends specified amount of wei from the contract to the address|`hh redeem --address 0x0591BBf22F4d436a1d0CCA14A01943Bddb42d9AB --amount 100000 --network rinkeby`|
------------
