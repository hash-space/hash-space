const { ipFsClient } = require('./ipfs');

export async function uploadIPFS() {
  let blob = await fetch(
    `${location.protocol}//${location.host}/shipMe.png`
  ).then((r) => r.blob());

  const client = ipFsClient;

  const imageFile = new File([blob], 'nft.png', { type: 'image/png' });
  const metadata = await client.store({
    name: 'Hash Space Starship',
    description: 'Explore the DeFi Galaxy',
    image: imageFile,
  });

  return metadata;
}
