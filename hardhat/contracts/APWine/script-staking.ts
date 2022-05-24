/**
 * @credits 
 * 
 */

import APWineSDK from "@apwine/sdk"
import { ethers } from "hardhat"
import { BigNumber, constants } from "ethers"

import { parseEther } from "ethers/lib/utils"
import { align, computeAPR, getDate, depositAsset, balance, ethFloat } from "./utils";
import { ChainId, getTokenByAddress, getToken } from "./types";
import { AMM_Factory } from "./types/AMM_Factory"
import "@nomiclabs/hardhat-ethers";
require('dotenv').config();

export const testRun = async () => {
    console.log(`1️⃣  Initialize APWine SDK`)

    // TODO: first Verify .env file by setting the ALCHEMY_KEY_MUMBAI  and for testing  to test the deployment (but in reality it will be address from the user address).


    // Create APWine SDK
    const sdk: APWineSDK = new APWineSDK(
        {
            network: ChainId.POLYGON,
            provider: new ethers.providers.AlchemyProvider(ChainId.POLYGON, process.env.ALCHEMY_KEY_MUMBAI),
            signer: new ethers.Wallet(process.env.PRIVATE_KEY, ethers.provider),
        },
        { initialize: false }
    )
    console.log(` 🔮 Created APWine SDK. Initializing...`)

    // Initialize SDK. This will load essential data such as contract addresses.
    try {
        await sdk.initialize()
    } catch (error) {
        console.error(`❌ Failed. ${error}`)
        return null
    }
    console.log(
        ` ✅ APWine SDK initialized on ${ChainId[sdk.network.toString()]}`
    )

    return { sdk }
}

// getting all  future investments 
export const getAllFutures = async () => {
    // Get SDK from previous step
    const { sdk } = await testRun()

    console.log(`2️⃣  Get all futures for the token vaults `)

    // Fetch all future addresses (as contracts)
    const futureVaults = await sdk.fetchAllFutureVaults()
    console.log(
        `    🔮 Fetched ${futureVaults.length} future vaults. Fetching futures...`
    )

    // Fetch detailed future data (more resource-intensive)
    const futures = await Promise.all(
        futureVaults.map((futureVault) =>
            sdk.fetchFutureAggregateFromAddress(futureVault.address)
        )
    )

    // Display all futures
    console.log(`    ✅ Done! Available futures:`)
    futures.forEach((future) => {
        const ibtSymbol = getTokenByAddress(future.ibtAddress, ChainId.MAINNET)
            .currency.symbol
        const endDate = new Date(
            future.nextPeriodTimestamp.toNumber() * 1000
        ).toLocaleDateString()
        console.log(
            `        - ` +
            `${align(ibtSymbol, 16)} ` +
            `${align(future.platform, 12)} ` +
            `ending on ${align(endDate, 24)}`
        )
    })

    return { sdk, futures }
}

export const computePTAPR = async (addressAsset: string) => {

    // Get SDK and futures from previous step
    const { sdk, futures } = await getAllFutures()

    console.log(`3️⃣ Compute PT APR`)

    // Find a future where we can deposit Lido Staked ETH (stETH)
    const tokenParam = getToken(addressAsset);
    const tokenFuture = futures.find(
        (future) => future.ibtAddress === tokenParam.address[ChainId.MAINNET]
    )

    // Get the corresponding AMM
    console.log(`    🔮 Computing APR for buying PT on the stETH future...`)
    const ptAPR = computeAPR(
        (await getDate(sdk)).getTime(),
        tokenFuture.nextPeriodTimestamp.toNumber() * 1000,
        (await sdk.fetchSpotPrice(
            sdk.FutureVault(tokenFuture.address),
            "PT",
            "Underlying"
        )) as BigNumber
    )
    console.log(`    ✅ Done! APR: ${ptAPR.toFixed(2)}%`)

    return { sdk, tokenFuture }
}









export const tokenizeIBT = async (amountToTokenize: BigNumber, assetAddress: any) => {
    // Get stETH future from previous step
    const { sdk, tokenFuture } = await computePTAPR(assetAddress)

    console.log(`4️⃣  Tokenize the asset  Future Yield`)

    // First, we need to deposit ETH on Lido to get stETH
    console.log(
        `    🔮 Depositing ${ethFloat(
            amountToTokenize
        ).toFixed()} Asset on the network...`
    )
    await depositAsset(sdk, amountToTokenize, assetAddress);

    // Next, we deposit our newly acquired stETH on the APWine stETH future vault
    console.log(`    🔮 Depositing stETH on APWine...`)
    await sdk
        .deposit(
            sdk.FutureVault(tokenFuture.address),
            amountToTokenize.sub(1), // stETH is missing 1 unit precision
            { autoApprove: true } // Approve automatically if needed. Will require an extra transaction
        )
        .catch(console.error)

    const user = await sdk.signer.getAddress()
    const ptBalance = await balance(sdk.provider, tokenFuture.ptAddress, user)
    const fytBalance = await balance(
        sdk.provider,
        await sdk.FutureVault(tokenFuture.address).getFYTofPeriod(1),
        user
    )
    console.log(
        `    ✅ Done! Retrieved ${ethFloat(ptBalance).toFixed(
            2
        )} PT and ${ethFloat(fytBalance).toFixed(2)} FYT.`
    )

    return { sdk, tokenFuture }
}


export const getFYTTokens = async (amountToTokenize: BigNumber, assetAddress: any) => {
    // Get derivative token future from previous step
    const { sdk, tokenFuture } = await tokenizeIBT(amountToTokenize, assetAddress);

    console.log(`5️⃣  Swap FYT for PT`)

    const user = await sdk.signer.getAddress()
    const fytAddress = await sdk
        .FutureVault(tokenFuture.address)
        .getFYTofPeriod(1)
    const fytBalance = await balance(sdk.provider, fytAddress, user)

    // Execute a FYT -> PT swap on the AMM
    console.log(`    🔮 Swapping FYT for PT...`)
    const ammAddress = await sdk.AMMRegistry.getFutureAMMPool(
        tokenFuture.address
    )
    const amm = AMM_Factory.connect(ammAddress, sdk.provider)
    await sdk.swapIn(
        {
            amm,
            from: "FYT",
            to: "PT",
            amount: fytBalance,
        },
        { autoApprove: true } // Approve automatically if needed
    )

    // Get final PT balance and compute resulting APR
    const ptBalance = await balance(sdk.provider, tokenFuture.ptAddress, user)
    console.log(`    ✅ Done! Result: ${ethFloat(ptBalance).toFixed(2)} PT.`)
    console.log(
        `\n    💥 Final guaranteed APR with strategy: ${computeAPR(
            (await getDate(sdk)).getTime(),
            tokenFuture.nextPeriodTimestamp.toNumber() * 1000,
            ptBalance.mul(constants.WeiPerEther).div(amountToTokenize)
        ).toFixed(2)}%`
    )

    return { tokenFuture }
}


