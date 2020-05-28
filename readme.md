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

Deploy a new smart contract:

```
$ npm run deploy -- sirius
```