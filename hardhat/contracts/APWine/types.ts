export enum ChainId {
  MAINNET = 1,
  POLYGON = 137,
  KOVAN = 42,
}

import { Currency as UniswapCurrency } from "@uniswap/sdk";

class Currency extends UniswapCurrency {
  public constructor(decimals: number, symbol: string, name: string) {
    super(decimals, symbol, name);
  }
}

export default Currency;

export interface NetworkAddress {
  [chainId: number]: string;
}

import { getAddress } from "@ethersproject/address";

export type Token = {
  currency: Currency;
  address: NetworkAddress;
  underlying?: Token;
};

export const tokens: Token[] = [
  {
    currency: new Currency(18, "APW", "APWine Token"),
    address: {
      [ChainId.MAINNET]: "0x4104b135dbc9609fc1a9490e61369036497660c8",
      [ChainId.KOVAN]: "0x4e92c3Eac3C449c3c7287b920AfDD7BB1189162B",
      [ChainId.POLYGON]: "0x6c0ab120dbd11ba701aff6748568311668f63fe0",
    },
  },
  {
    currency: new Currency(18, "veAPW", "Vote-escrowed APW"),
    address: {
      [ChainId.MAINNET]: "0xc5ca1ebf6e912e49a6a70bb0385ea065061a4f09",
      [ChainId.KOVAN]: "0xb8587F12A2552E2A679379BD7eD021E5a6dBB172",
    },
  },
  {
    currency: new Currency(18, "DAI", "Dai Stablecoin"),
    address: {
      [ChainId.MAINNET]: "0x6b175474e89094c44da98b954eedeac495271d0f",
      [ChainId.KOVAN]: "0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD",
    },
  },
  {
    currency: new Currency(18, "FARM", "Harvest Finance"),
    address: {
      [ChainId.MAINNET]: "0xa0246c9032bc3a600820415ae600c6388619a14d",
      [ChainId.KOVAN]: "",
    },
  },
  {
    currency: new Currency(18, "yUSD", "Curve.fi yDAI/yUSDC/yUSDT/yTUSD"),
    address: {
      [ChainId.MAINNET]: "0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806A8",
      [ChainId.KOVAN]: "",
    },
  },
  {
    currency: new Currency(18, "wETH", "Wrapped Ether"),
    address: {
      [ChainId.MAINNET]: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      [ChainId.POLYGON]: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
      [ChainId.KOVAN]: "0xd0a1e359811322d97991e03f863a0c30c2cf029c",
    },
  },
  {
    currency: new Currency(18, "MUST", "Must"),
    address: {
      [ChainId.MAINNET]: "0x9c78ee466d6cb57a4d01fd887d2b5dfb2d46288f",
      [ChainId.POLYGON]: "0x9c78ee466d6cb57a4d01fd887d2b5dfb2d46288f",
    },
  },
  {
    currency: new Currency(18, "SUSHI", "Sushi"),
    address: {
      [ChainId.MAINNET]: "0x6b3595068778dd592e39a122f4f5a5cf09c90fe2",
    },
  },
  {
    currency: new Currency(18, "YFI", "yearn.finance"),
    address: {},
  },
  {
    currency: new Currency(18, "SDT", "Stake DAO Token"),
    address: {
      [ChainId.MAINNET]: "0x73968b9a57c6E53d41345FD57a6E6ae27d6CDB2F",
    },
  },
  {
    currency: new Currency(18, "stkAAVE", "Staked Aave"),
    address: {
      [ChainId.MAINNET]: "0x4da27a545c0c5B758a6BA100e3a049001de870f5",
    },
  },
  {
    currency: new Currency(18, "wETH", "Wrapped Ether"),
    address: {
      [ChainId.MAINNET]: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    },
  },
  {
    currency: new Currency(18, "PSP", "ParaSwap"),
    address: {
      [ChainId.MAINNET]: "0xcAfE001067cDEF266AfB7Eb5A286dCFD277f3dE5",
    },
  },
  {
    currency: new Currency(6, "USDC", "USD Coin"),
    address: {
      [ChainId.MAINNET]: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      [ChainId.POLYGON]: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    },
  },
  {
    currency: new Currency(18, "4EUR-f", "Curve 4EUR"),
    address: {
      [ChainId.POLYGON]: "0xAd326c253A84e9805559b73A08724e11E49ca651",
    },
  },
  {
    currency: new Currency(18, "crvTriCrypto", "Curve TriCrypto"),
    address: {
      [ChainId.POLYGON]: "0xdAD97F7713Ae9437fa9249920eC8507e5FbB23d3",
    },
  },
  {
    currency: new Currency(18, "FRAX3CRV-f", "FRAX3CRV-f"),
    address: {
      [ChainId.MAINNET]: "0xd632f22692FaC7611d2AA1C0D552930D43CAEd3B",
    },
  },
  {
    currency: new Currency(6, "USDT", "Tether USD"),
    address: {
      [ChainId.MAINNET]: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    },
  },
  {
    currency: new Currency(18, "ibEUR+sEUR-f", "ibEUR+sEUR-f"),
    address: {
      [ChainId.MAINNET]: "0x19b080FE1ffA0553469D20Ca36219F17Fcf03859",
    },
  },
  {
    currency: new Currency(18, "am3CRV", "am3CRV"),
    address: {
      [ChainId.POLYGON]: "0xE7a24EF0C5e95Ffb0f6684b813A78F2a3AD7D171",
    },
  },
  {
    currency: new Currency(18, "2JPY-f", "2JPY-f"),
    address: {
      [ChainId.POLYGON]: "0xE8dCeA7Fb2Baf7a9F4d9af608F06d78a687F8d9A",
    },
  },
];

export const getToken = (symbol: string) => {
  const token = tokens.find((t) => t.currency.symbol === symbol);
  if (!token) throw new Error(`Token '${symbol}' not found`);
  return token;
};

export const getTokenByAddress = (address: string, chainId: number) =>
  tokens.find(
    (t) => (t.address[chainId] || "").toLowerCase() === address.toLowerCase()
  )!;

// Interest Bearing Tokens
tokens.push(
  // Aave
  {
    currency: new Currency(18, "aDAI", "Aave Interest Bearing DAI"),
    address: {
      [ChainId.MAINNET]: "0x028171bCA77440897B824Ca71D1c56caC55b68A3",
      [ChainId.KOVAN]: "0xdCf0aF9e59C002FA3AA091a46196b37530FD48a8",
    },
    underlying: getToken("DAI"),
  },
  {
    currency: new Currency(6, "aUSDC", "Aave Interest Bearing USDC"),
    address: {
      [ChainId.MAINNET]: "0xBcca60bB61934080951369a648Fb03DF4F96263C",
      [ChainId.KOVAN]: "0xe12AFeC5aa12Cf614678f9bFeeB98cA9Bb95b5B0",
    },
  },
  {
    currency: new Currency(6, "aUSDT", "Aave Interest Bearing USDT"),
    address: {
      [ChainId.MAINNET]: "0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811",
    },
    underlying: getToken("USDT"),
  },
  {
    currency: new Currency(18, "aWETH", "Aave Interest bearing wETH"),
    address: {
      [ChainId.MAINNET]: "0x030ba81f1c18d280636f32af80b9aad02cf0854e",
      [ChainId.KOVAN]: "0x87b1f4cf9BD63f7BBD3eE1aD04E8F52540349347",
    },
  },
  // Yearn
  {
    currency: new Currency(18, "yDAI", "iearn DAI"),
    address: {
      [ChainId.MAINNET]: "0x16de59092dAE5CcF4A1E6439D611fd0653f0Bd01",
      [ChainId.KOVAN]: "",
    },
  },
  {
    currency: new Currency(18, "ycrvEURS", "yearn Curve.fi EURS/sEUR"),
    address: {
      [ChainId.MAINNET]: "0x98B058b2CBacF5E99bC7012DF757ea7CFEbd35BC",
      [ChainId.KOVAN]: "",
    },
  },
  {
    currency: new Currency(18, "yyUSD", "yearn Curve.fi USD"),
    address: {
      [ChainId.MAINNET]: "0x5dbcF33D8c2E976c6b560249878e6F1491Bca25c",
      [ChainId.KOVAN]: "",
    },
    underlying: getToken("yUSD"),
  },
  {
    currency: new Currency(18, "yCRV-IB", "Curve Iron Bank Pool yVault"),
    address: {},
  },
  {
    currency: new Currency(18, "yvcrv-ibEUR", "Curve ibEUR Pool yVault"),
    address: {
      [ChainId.MAINNET]: "0x67e019bfbd5a67207755D04467D6A70c0B75bF60",
    },
    underlying: getToken("ibEUR+sEUR-f"),
  },
  // Testnet
  {
    currency: new Currency(18, "ibtUSD", "USD Interest Bearing Token"),
    address: {
      [ChainId.KOVAN]: "0xAa55F82a56D6adC9b863d7D624774F5361C809A4",
    },
    underlying: {
      currency: new Currency(18, "USD", "USD Stablecoin"),
      address: {
        [ChainId.KOVAN]: "0x78FE37f126687c3a1DDD5eE2F9E234899c4A5ac7",
      },
    },
  },
  // Harvest
  {
    currency: new Currency(18, "iFARM", "iFARM"),
    address: {
      [ChainId.MAINNET]: "0x1571ed0bed4d987fe2b498ddbae7dfa19519f651",
      [ChainId.KOVAN]: "",
    },
    underlying: getToken("FARM"),
  },
  // Compound
  {
    currency: new Currency(8, "cDAI", "Compound Dai"),
    address: {
      [ChainId.MAINNET]: "",
      [ChainId.KOVAN]: "0xF0d0EB522cfa50B716B3b1604C4F0fA6f04376AD",
    },
  },
  // Lido
  {
    currency: new Currency(18, "stETH", "Lido Staked Ether"),
    address: {
      [ChainId.MAINNET]: "0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
    },
    underlying: getToken("wETH"),
  },
  // StakeDAO
  {
    currency: new Currency(18, "xSDT", "Staked SDT"),
    address: {
      [ChainId.MAINNET]: "0xaC14864ce5A98aF3248Ffbf549441b04421247D3",
    },
    underlying: getToken("SDT"),
  },
  {
    currency: new Currency(18, "sdFRAX3CRV-f", "sdFRAX3CRV-f"),
    address: {
      [ChainId.MAINNET]: "0x5af15DA84A4a6EDf2d9FA6720De921E1026E37b7",
    },
    underlying: getToken("FRAX3CRV-f"),
  },
  {
    currency: new Currency(18, "sdam3CRV", "sdam3CRV"),
    address: {
      [ChainId.POLYGON]: "0x7d60F21072b585351dFd5E8b17109458D97ec120",
    },
    underlying: getToken("am3CRV"),
  },
  // SushiSwap
  {
    currency: new Currency(18, "xSUSHI", "Staked Sushi"),
    address: {
      [ChainId.MAINNET]: "0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272",
    },
    underlying: getToken("SUSHI"),
  },
  // ParaSwap
  {
    currency: new Currency(18, "sPSP-3", "Staked ParaSwap Pool 3"),
    address: {
      [ChainId.MAINNET]: "0xea02DF45f56A690071022c45c95c46E7F61d3eAb",
    },
    underlying: getToken("PSP"),
  },
  {
    currency: new Currency(18, "sPSP-4", "Staked ParaSwap Pool 4"),
    address: {
      [ChainId.MAINNET]: "0x6b1D394Ca67fDB9C90BBd26FE692DdA4F4f53ECD",
    },
    underlying: getToken("PSP"),
  },
  // Idle
  {
    currency: new Currency(
      18,
      "AA_idleDAIYield",
      "IdleCDO AA Tranche - idleDAIYield"
    ),
    address: {},
  },
  // Visor
  {
    currency: new Currency(18, "vVISR", "Staked VISR"),
    address: {},
  },
  // Impermax
  {
    currency: new Currency(18, "xIMX", "Staked Impermax"),
    address: {},
  },
  // TrueFi
  {
    currency: new Currency(6, "tfUSDC", "TrueFi USD Coin"),
    address: {
      [ChainId.MAINNET]: "0xa991356d261fbaf194463af6df8f0464f8f1c742",
    },
    underlying: getToken("USDC"),
  },
  // Paladin
  {
    currency: new Currency(18, "PalPoolStkAave", "Paladin Staked Aave"),
    address: {
      [ChainId.MAINNET]: "0x24e79e946dea5482212c38aab2d0782f04cdb0e0",
    },
    underlying: getToken("stkAAVE"),
  },
  // Rari
  {
    currency: new Currency(18, "fUSDC-82", "APWine Fuse Pool USDC"),
    address: {},
  },
  // POLYGON
  {
    currency: new Currency(18, "f-j4EUR", "Harvest: Jarvis 4EUR"),
    address: {
      [ChainId.POLYGON]: "0xDDe43710DefEf6CbCf820B18DeBfC3cF9a4f449F",
    },
    underlying: getToken("4EUR-f"),
  },
  {
    currency: new Currency(6, "amUSDC", "Aave Interest Bearing USDC"),
    address: {
      [ChainId.POLYGON]: "0x1a13F4Ca1d028320A707D99520AbFefca3998b7F",
    },
    underlying: getToken("USDC"),
  },
  {
    currency: new Currency(18, "f-jEUR-USDC", "Harvest: Jarvis jEUR-USDC"),
    address: {},
  },
  {
    currency: new Currency(18, "f-jCHF-USDC", "Harvest: Jarvis jCHF-USDC"),
    address: {},
  },
  {
    currency: new Currency(18, "MAI-USDC", "Beefy MAI-USDC Vault"),
    address: {},
  },
  // Beefy
  {
    currency: new Currency(18, "mooATriCrypto3", "Beefy aTriCrypto3 Vault"),
    address: {
      [ChainId.POLYGON]: "0x5a0801bad20b6c62d86c566ca90688a6b9ea1d3f",
    },
    underlying: getToken("crvTriCrypto"),
  },
  {
    currency: new Currency(18, "mooJarvis2jpy", "Moo Jarvis 2jpy"),
    address: {
      [ChainId.POLYGON]: "0x94F64bb5046Ee377bFBb664736547B7f78e5AE06",
    },
    underlying: getToken("2JPY-f"),
  },
  {
    currency: new Currency(18, "mooJarvis4eur", "Moo Jarvis 4eur"),
    address: {
      [ChainId.POLYGON]: "0x80dAd30b61b6110aB4112e440988DA2d9aa85329",
    },
    underlying: getToken("4EUR-f"),
  }
);

tokens.forEach((t) => {
  Object.keys(t.address).forEach((_chainId) => {
    const chainId = parseInt(_chainId);
    t.address[chainId] =
      t.address[chainId] === "" ? "" : getAddress(t.address[chainId]);
  });
});
