# New GSN Relay client

To send a gasless transaction, a signed transaction message is sent to a GSN (Gas Station Network) Relay Server. The Relay Server sends the transaction to the blockchain network and pays the gas fee on behalf of the sender. 

**Problem**

The current `RelayClient` that we are using from the the `@openzeppelin` library only works in the browser and not in a react native app like iOS. This is because there are references to incompatible Node.js libraries. 

**Solution**

Develop a new RelayClient using javascript libraries that are compatible with React Native.

Using `ethers.js` we can intercept the `sendTransaction` API when an attempt to send a blockchain transaction. I have created a `GsnProvider` in `/src/crypto/crypto.js` that does this.

What needs to be further developed:
1. In `GsnProvider` remove the incompatible dependencies (`web3`, `eth-crypto`, `RelayClient`)
2. Modify `ethers.js` so that smart contract address, the user's private key and the user's account address are sent in the `params` of the `sendTransaction` method. Note: Make changes to the forked repo `https://github.com/lightstreams-network/ethers.js` on the branch `ls_mods`. 
3. Create a new `RelayClient` that doesn't use the `@openzeppelin` library. See the forked repo: `https://github.com/lightstreams-network/openzeppelin-gsn-provider.git` in the branch `ls_mods`. The new `RelayClient` needs to be a lot more simple that the openzeppelin RelayClient. It should just create the a hash in the right format with a signature and then send this message to the RelayServer. The openzeppelin RelayClient is quite complex with a lot of logic that we don't need. (E.g. it allows for multiple RelayServers, we only have one right now).

## Getting Started

1. Install and run the project following the ReadMe.md instructions. When the Metro Bundler is running, only choose to `Run in the web browser`.

2. There is already a `Voter` smart contract deployed to our Sirius test network. This `Voter` smart contract can be found in the `/contracts` directory. When you run the app and click the Vote button, a message is sent to the `https://gsn.sirius.lightstreams.io/relay` url. At the url the Relay Server pays for the transactions to be added to the blockchain. You don't need to understand how this works :-)

3. If you check out the branch `ios`, you can run the app in the IOS Simulator via the Metro Bundler because all the problematic libraries have been removed.