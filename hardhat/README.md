# Hardhat

## Setup

1. make sure to create a .env file from the .env.example template, contents of the file can be obtained in the team chat

## Scripts

run the hardhat node

```
npm run node
```

deploy the contract to hardhat node

```
npm run deploy:local
```

deploy the contract to mumbai

```
npm run deploy:mumbai
```

clean compiled output (run this as needed)

```
npm run clean
```

test

```
npm run test
```

create world + planets (localhost)

```
npm run seed:local -- --address #addressOfWorldContract
```

create world + planets (mumbai)

```
npm run seed:mumbai -- --address #addressOfWorldContract
```
