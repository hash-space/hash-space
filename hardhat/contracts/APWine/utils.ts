import { ERC20__factory } from "./typechain/ERC20__factory"
import { BigNumber, providers } from "ethers"
import { BigNumber } from "ethers"
import { formatEther } from "ethers/lib/utils"
import APWineSDK from "@apwine/sdk"
import { BigNumber } from "ethers"
import { BigNumber } from "ethers"
import { formatEther } from "ethers/lib/utils"



//  TODO: define either the   assets that can be deposited further here or passed in the AssetAddress .
export const STETH_ADDRESS = "0xae7ab96520de3a18e5e111b5eaab095312d7fe84";
export const amUSDC = "0x1a13F4Ca1d028320A707D99520AbFefca3998b7F";
export const depositAsset = async (sdk: APWineSDK, amount: BigNumber , AssetAddress : any) => {
    return await (
        await sdk.signer.sendTransaction({
            to: AssetAddress,
            value: amount,
        })
    ).wait()
}
const MILLISECONDS_PER_YEAR = 1000 * 3600 * 24 * 365
export const computeAPR = (now: number, end: number, price: BigNumber) => {
    const timeLeft = end - now
    return (
        ((parseFloat(formatEther(price)) - 1) / timeLeft) *
        MILLISECONDS_PER_YEAR *
        100
    )
}
export const balance = (
    provider: providers.Provider,
    tokenAddress: string,
    address: string
) => ERC20__factory.connect(tokenAddress, provider).balanceOf(address)


export const align = (s: string, length: number) => s.padEnd(length, " ")

export const checkEnv = (v: any, name: string) => {
    if (!v) {
        console.error(
            `    ❌ No ${name} provided. Make sure you've renamed .env.example to .env and filled the file correctly.`
        )
        return false
    } else {
        return true
    }
}

export const ethFloat = (amount: BigNumber) => parseFloat(formatEther(amount))

export const getDate = async (sdk: APWineSDK) =>
    new Date((await sdk.provider.getBlock("latest")).timestamp * 1000)



export const resetFork = async (block: number , provider : any) => {
        return await provider.send("hardhat_reset", [
            {
                forking: {
                    jsonRpcUrl: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY_MUMBAI}`,
                    blockNumber: block,
                },
            },
        ])
    }
    


