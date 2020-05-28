require('dotenv').config({ path: `${__dirname}/.env` });

const Migrations = artifacts.require("Migrations");
const Voter = artifacts.require("Voter");

const { Web3, GSN } = require('lightstreams-js-sdk');

const ROOT_ACCOUNT = process.env.NETWORK === 'ganache' ? accounts[0] : process.env.ACCOUNT;
const RELAY_HUB = process.env.RELAY_HUB;

module.exports = async (deployer) => {
  await deployer.deploy(Migrations);
  await deployer.deploy(Voter);

  let voter = await Voter.deployed();
  let txHub = await voter.initialize(RELAY_HUB);
  let hubAddr = await voter.getHubAddr();

  voterAddr = await voter.address;

  const voterFundingPHTs = "10";
  await GSN.fundRecipient(web3, {
      recipient: voterAddr,
      relayHub: RELAY_HUB,
      amountInPht: voterFundingPHTs,
      from: ROOT_ACCOUNT
  });

  console.log("Funded Voter contract with address:", voterAddr)
};
