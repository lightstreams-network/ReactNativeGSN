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

const privateKey = ethers.Wallet.createRandom().privateKey;
const url = "https://node.sirius.lightstreams.io:443";
//const voterAddress = "0x4C3Bf861A9F822F06c10fE12CD912AaCC5e3A4f6";

const provider = GsnProvider.new(config);
const wallet = new ethers.Wallet(privateKey, provider);

class App extends Component {
	constructor() {
		super();
		this.state = {
			resultText: "",
			contractDeployed: false
		};
	}

	votePressed = async () => {
		const voterAddress = Voter.networks[162].address;
		console.log({voterAddress})
		const abi = Voter.abi;
		const contract = new ethers.Contract(voterAddress, abi, provider);

		let contractWithSigner = contract.connect(wallet);
		let payload = {
			privateKey: privateKey,
			address: voterAddress
		};

		let tx = await contractWithSigner.upVote();
		//await tx.wait();

		let count = await contract.count();

		this.setState({
			resultText: count.toString()
		});
	};

	render() {
		return (
			<View style={styles.container}>
				<TouchableOpacity
					style={styles.bigButton}
					onPress={() => this.votePressed()}
				>
					<Text style={styles.buttonText}>Vote</Text>
				</TouchableOpacity>

				<Text style={[{ marginTop: 30 }]}>{this.state.resultText}</Text>
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
		justifyContent: "center"
	},
	setValueView: {
		flex: 1,
		flexDirection: "row",
		height: 100
	},
	bigButton: {
		marginRight: 40,
		marginLeft: 40,
		marginTop: 10,
		width: 200,
		paddingTop: 20,
		paddingBottom: 20,
		backgroundColor: "#68a0cf",
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#fff"
	},
	button: {
		marginRight: 40,
		marginLeft: 40,
		marginTop: 10,
		width: 100,
		paddingTop: 10,
		paddingBottom: 10,
		backgroundColor: "#76788f",
		borderRadius: 5,
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
