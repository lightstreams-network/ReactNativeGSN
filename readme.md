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

The following deploys a new `Voter` smart contract to Sirius test network.

Note: This is not necessary since a contact has already been deployed at address: `0x4C3Bf861A9F822F06c10fE12CD912AaCC5e3A4f6`

In `.env` file, set the enviroment variables:

- `ACCOUNT` - Your account on the Sirius test network that has a positive balance
- `PASSPHRASE` - The password for the above account.

Deploy smart contracts

```
$ npm run deploy -- sirius
$ npm test -- sirius
```