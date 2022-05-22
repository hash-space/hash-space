import { NFTStorage, File } from 'nft.storage'

export async function uploadIPFS() {
    let blob = await fetch(`${location.protocol}//${location.host}/shipMe.png`).then(r => r.blob());
    
    // const client = new NFTStorage({ token: process.env.NFT_STORAGE_KEY })
    const client = new NFTStorage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGZkNWJmN0U1MEZCYTBkYzViM0M0MEFhNDYwYmVkNzg4MkU0Yzk4Y2QiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1MzEzNzYxNDQ3MSwibmFtZSI6Imhhc2hfc3BhY2UifQ.2Mbm9HyP26J2PdJ-FIv-fDxzB5tOLcjr4HI3fP_-zTo" })
        // Using temporary API key - will change shortly

    const imageFile = new File([ blob ], 'nft.png', { type: 'image/png' })
    const metadata = await client.store({
        name: 'Hash Space Starship',
        description: 'Explore the DeFi Galaxy',
        image: imageFile
        })
    
    return metadata
}