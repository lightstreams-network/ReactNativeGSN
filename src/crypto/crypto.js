
import { RELAY_URL, RELAY_ADRRESS, BLOCKCHAIN_RPC, CHAIN_ID, CHAIN_NAME } from 'react-native-dotenv'

const inherits = require('inherits');
const ethers = require('ethers');

const Web3 = require('web3'); // This dependency needs to be removed
const EthCrypto = require('eth-crypto'); // This dependency needs to be removed

const web3 = new Web3(BLOCKCHAIN_RPC); // This dependency needs to be removed
const RelayClient = require('@openzeppelin/gsn-provider/src/tabookey-gasless/RelayClient'); // This dependency needs to be removed

const network = {
        chainId: parseInt(CHAIN_ID),
        name: CHAIN_NAME
    }

function GsnProvider(url, network) {
    ethers.providers.BaseProvider.call(this, network.chainId);
    this.subprovider = new ethers.providers.JsonRpcProvider(url, network.chainId);
}
inherits(GsnProvider, ethers.providers.BaseProvider);


GsnProvider.prototype.perform = async function(method, params) {

    if (method === "sendTransaction") {
        // The voter address needs to come from the params
        const voterAddress = "0x4C3Bf861A9F822F06c10fE12CD912AaCC5e3A4f6"

        // The user's private key and account address needs to come from the params
        const identity = EthCrypto.createIdentity();

        let payload = {
            params: [{
                from: identity.address,
                value: null,
                useGSN: true,
                gas: params.gasLimit.toHexString(),
                data: params.data,
                gasPrice: params.gasPrice.toHexString(),
                to: voterAddress,
                txfee: 70,
                privateKey: identity.privateKey,
                relayUrl: RELAY_URL,
                relayAddr: RELAY_ADRRESS
            }]
        } 

        let relayClient = new RelayClient(web3, {verbose: true});
        let result = await relayClient.sendTransaction(payload);
        return new Promise(function (resolve, reject) {
            resolve(result);
        });  

    }

    if (method === "sendSignedTransaction") {
        return new Promise(function (resolve, reject) {
            resolve();
        });  
    }

    return this.subprovider.perform(method, params).then(function(result) {
        //console.log('DEBUG', method, params, '=>', result);
        return result;
    });
}

export const provider = (url) => {
    return new GsnProvider(url, network)
}

export const newWallet = (privateKey, provider) => {
    return new ethers.Wallet(privateKey, provider);
}
