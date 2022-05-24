# Hash-space DeFI integration  for Hackmoney Hackathon: 
- Integrating tellor oracle 
- integrating some DeFI strategies on YearnVaults , AAVE AND APWINE .
## Setup

1. make sure to create a .env file from the .env.example template, contents of the file can be obtained in the team chat


## Scripts

run the hardhat node

```
npm run node
```

deploy the contract to hardhat node

```
npm run deploy
```

deploy the contract to mumbai

```
npm run deploy:testnet
```

clean compiled output (run this as needed)

```
npm run clean
```

test

```
npm run test <<testFile>>
```



## Details  about the integration of sponsors : 

1. Tellor : we used RNG for generating the random positions for the planets and spaceships (to depict the )