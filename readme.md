# Lightstreams React Native GSN Example

## Install

```
$ yarn install
$ cp .env.sample .env
```

## Run
```
$ yarn start
```

## Deploying a new smart contract

To deploy a new `Voter` smart contract to Sirius test network.

In `.env` file, set the enviroment variables:

- `ACCOUNT` - Your account on the Sirius test network that has a positive balance that will fund the `Voter` smart contract
- `PASSPHRASE` - The password for the above account.

Run an instance of the Smart Vault connecting this node to the Sirius test network.

https://docs.lightstreams.network/products/smart-vault/getting-started/run-a-smart-vault-node

Ensure `truffle-config.js` is configured correctly for you Smart Vault instance

Deploy a new Voter smart contract:

```
$ npm run deploy -- sirius
```