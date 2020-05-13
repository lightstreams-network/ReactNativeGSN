
import { RELAY_URL, RELAY_ADRRESS, BLOCKCHAIN_RPC, CHAIN_ID, CHAIN_NAME } from 'react-native-dotenv'

const inherits = require('inherits');
const ethers = require('ethers');

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

    /*
    if (method === "sendTransaction") {
        return new Promise(function (resolve, reject) {
            resolve(result);
        });  

    }*/

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
