import {
	RELAY_URL,
	RELAY_ADRRESS,
	BLOCKCHAIN_RPC,
	CHAIN_ID,
	CHAIN_NAME
} from "react-native-dotenv";

const inherits = require("inherits");
const ethers = require("ethers");
const { utils, Wallet, getDefaultProvider } = ethers;
const Web3 = require("web3"); // This dependency needs to be removed
const EthCrypto = require("eth-crypto"); // This dependency needs to be removed

const web3 = new Web3(BLOCKCHAIN_RPC); // This dependency needs to be removed
const RelayClient = require("@openzeppelin/gsn-provider/src/tabookey-gasless/RelayClient"); // This dependency needs to be removed

const network = {
	chainId: parseInt(CHAIN_ID),
	name: CHAIN_NAME
};
const url = "https://node.sirius.lightstreams.io:443";

function GsnProvider(url, network) {
	ethers.providers.BaseProvider.call(this, network.chainId);
	this.subprovider = new ethers.providers.JsonRpcProvider(url, network.chainId);
}
inherits(GsnProvider, ethers.providers.BaseProvider);

/*
function toUint256_noPrefix(int) {
    return removeHexPrefix(ethUtils.bufferToHex(ethUtils.setLengthLeft(int, 32)));
}

function removeHexPrefix(hex) {
    return hex.replace(/^0x/, '');
}

function getTransactionHash (from, to, tx, txfee, gas_price, gas_limit, nonce, relay_hub_address, relay_address) {
        let txhstr = bytesToHex_noPrefix(tx)
        let dataToHash =
            Buffer.from(relay_prefix).toString("hex") +
            removeHexPrefix(from)
            + removeHexPrefix(to)
            + txhstr
            + toUint256_noPrefix(parseInt(txfee))
            + toUint256_noPrefix(parseInt(gas_price))
            + toUint256_noPrefix(parseInt(gas_limit))
            + toUint256_noPrefix(parseInt(nonce))
            + removeHexPrefix(relay_hub_address)
            + removeHexPrefix(relay_address)
        return web3Utils.sha3('0x'+dataToHash )
    }
    */

GsnProvider.prototype.perform = async function (method, params) {
	console.log({ method });
	if (method === "sendTransaction") {
		// The voter address needs to come from the params
		const voterAddress = "0x4C3Bf861A9F822F06c10fE12CD912AaCC5e3A4f6";
		// The user's private key and account address needs to come from the params
		const identity = await EthCrypto.createIdentity();
		console.log({ identity });

		console.log({ params });


		let transactionData = {
			nonce: 0,
			gasLimit: 21000,
			gasPrice: utils.bigNumberify("20000000000"),
			to: voterAddress,
			value: null,
			data: "0x",
			chainId: params.chainId
		};
		let wallet = new Wallet(identity.privateKey, provider(url));
		console.log("wallet instance created", { wallet });
		let result = await wallet.sign(transactionData);
		console.log({ result });

        /* ###### Example of signing transactions ###### */

        let hash
        let data

        /* Method 1: The OpenZepplin way */
        
        data = "0x12345";
        hash = ethers.utils.sha256(data)   
        let signed1 = EthCrypto.sign(identity.privateKey, hash);

        console.log({ signed1 });

        /* Method 2: The Ethers way */
        
        data = "0x12345";
        // data = getTransactionHash(xxxx) <- We should generate the serialised data the same way as OpenZepplin does it.

        hash = ethers.utils.sha256(data) 
        let key = new ethers.utils.SigningKey(identity.privateKey)
        let signed2 = ethers.utils.joinSignature(key.signDigest(hash));
        
        console.log({ signed2 });

        /* ######  ###### */

		try {
			let relayRes = await fetch("https://gsn.sirius.lightstreams.io/relay", {
				method: "POST",
				body: JSON.stringify({
					encodedFunction: "0xeed7c128",
					signature: result,
					approvalData: [],
					from: identity.address,
					to: voterAddress,
					gasPrice: 500000000000,
					gasLimit: 28667,
					relayFee: 70,
					RecipientNonce: 0,
					RelayMaxNonce: 1990,
					RelayHubAddress: "0x5e0D6a89895D8B40FCaC27d71D23CB5a989900b9"
				})
			});
			console.log("response from post request to relay", relayRes);
		} catch (err) {
			console.log("error from post request to relay", err);
		}
		return new Promise(function (resolve, reject) {
			resolve(result);
		});
	}

	if (method === "sendSignedTransaction") {
		return new Promise(function (resolve, reject) {
			resolve();
		});
	}

	return this.subprovider.perform(method, params).then(function (result) {
		//console.log('DEBUG', method, params, '=>', result);
		return result;
	});
};

export const provider = (url) => {
	return new GsnProvider(url, network);
};

export const newWallet = (privateKey, provider) => {
	return new ethers.Wallet(privateKey, provider);
};
