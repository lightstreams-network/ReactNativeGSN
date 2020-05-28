import React, { Component } from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	TextInput,
	AsyncStorage
} from "react-native";

import {
	RELAY_URL,
	RELAY_HUB,
	RELAY_ADRRESS,
	RELAY_FEE,
	GAS_PRICE,
	BLOCKCHAIN_RPC,
	CHAIN_ID,
	CHAIN_NAME
} from "react-native-dotenv";

import Voter from "./build/contracts/Voter.json";

const ethers = require("ethers");

const { GsnProvider } = require('ls-react-native-gsn-client');

const config = {
	chainId: CHAIN_ID,
	blockchainRpc: BLOCKCHAIN_RPC,
	relayUrl: RELAY_URL,
	relayHub: RELAY_HUB,
	relyAddress: RELAY_ADRRESS,
	relayFee: RELAY_FEE,
	gasPrice: GAS_PRICE
}

const url = "https://node.sirius.lightstreams.io:443";

const privateKey1 = ethers.Wallet.createRandom().privateKey;
const privateKey2 = ethers.Wallet.createRandom().privateKey;

const gsnProvider = GsnProvider.new(config);
const wallet1 = new ethers.Wallet(privateKey1, gsnProvider);

const network = {
	chainId: CHAIN_ID
}

const provider = new ethers.providers.JsonRpcProvider(url);
const wallet2 = new ethers.Wallet(privateKey2, provider);
const account2 = wallet2.address;

let contract;

class App extends Component {
	constructor() {
		super();
		this.state = {
			resultText: "",
			status: "",
			account2: wallet2.address,
			account2Bal: 0,
			contractDeployed: false
		};

		let voterAddress = Voter.networks[CHAIN_ID].address;
		console.log({voterAddress})
		const abi = Voter.abi;
		contract = new ethers.Contract(voterAddress, abi, provider);

		let count = contract.count().then((count) => {
			this.setState({
				resultText: count.toString()
			});
		});

		setInterval(() => {
			wallet2.getBalance().then(balance => {
				this.setState({
					account2Bal: ethers.utils.formatEther(balance.toString())
				});
			});
		}, 1000);
{
  //this will repeat every 5 seconds
  //you can reset counter here
}
	}

	voteGasFreePressed = async () => {
		this.vote(wallet1);
	};

	votePayGasPressed = async () => {
		this.vote(wallet2);
	};

	vote = async (wallet) => { 
		this.setState({
			status: "Please wait..."
		});

		let tx, count;
		let contractWithSigner = contract.connect(wallet);
		try {
			tx = await contractWithSigner.upVote();
			await tx.wait();
			count = await contract.count();
		} catch (err) {
			this.setState({
				status: err.message
			});
			return;
		}

		console.log("count", count.toString())
		this.setState({
			resultText: count.toString(),
			status: ""
		});
	}

	render() {
		return (
			<View style={styles.container}>
				<View >

					<Text style={[{ marginTop: 10 }]}>Account: {this.state.account2}</Text>
					<Text style={[{ marginTop: 10 }]}>Balance: {this.state.account2Bal} PHT</Text>

					<TouchableOpacity
						style={styles.bigButton}
						onPress={() => this.votePayGasPressed()}
					>
						<Text style={styles.buttonText}>Vote (pay with gas)</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.bigButton}
						onPress={() => this.voteGasFreePressed()}
					>
						<Text style={styles.buttonText}>Vote (gas-free)</Text>
					</TouchableOpacity>
				</View>

				<View style={[{ alignItems: "center" }]}>
					<Text style={[{ marginTop: 30 }]}>{this.state.resultText}</Text>
					<Text style={[{ marginTop: 30 }]}>{this.state.status}</Text>
				</View>
			</View>
		);
	}
}

export default App;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		alignContent: "center"
	},
	buttons: {
		flex: 1,
		flexDirection: "row"
	},
	bigButton: {
		marginRight: 40,
		marginLeft: 40,
		marginTop: 10,
		padding: 10,
		backgroundColor: "#68a0cf",
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#fff"
	},
	buttonText: {
		color: "#fff",
		textAlign: "center"
	},
	textInput: {
		height: 40,
		paddingLeft: 6,
		borderBottomWidth: 1,
		borderBottomColor: "#76788f"
	},
	hidden: {
		opacity: 0,
		width: 0,
		height: 0
	}
});
