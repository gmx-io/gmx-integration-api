import { ARBITRUM, AVALANCHE } from './constants'

export const ORACLE_KEEPER_URLS: { [key: number]: string } = {
  [ARBITRUM]: 'https://arbitrum-api.gmxinfra2.io',
  [AVALANCHE]: 'https://avalanche-api.gmxinfra2.io',
}

export const AddressZero = '0x0000000000000000000000000000000000000000'

export const SYNTHETICS_SUBGRAPHS: { [key: number]: string } = {
  [ARBITRUM]:
    'https://subgraph.satsuma-prod.com/3b2ced13c8d9/gmx/synthetics-arbitrum-stats/api',
  [AVALANCHE]:
    'https://subgraph.satsuma-prod.com/3b2ced13c8d9/gmx/synthetics-avalanche-stats/api',
}

export type Token = {
  name: string
  symbol: string
  decimals: number
  address: string
  isNative?: boolean
  isShortable?: boolean
  isV1Available?: boolean
  isWrapped?: boolean
  baseSymbol?: string
  priceDecimals?: number
  assetSymbol?: string
  isStable?: boolean
  isSynthetic?: boolean
  isTempHidden?: boolean
}

export const TOKENS: { [chainId: number]: Token[] } = {
  [ARBITRUM]: [
    {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      address: AddressZero,
      isNative: true,
      isShortable: true,
      isV1Available: true,
    },
    {
      name: 'Wrapped Ethereum',
      symbol: 'WETH',
      decimals: 18,
      address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      isWrapped: true,
      baseSymbol: 'ETH',
      isV1Available: true,
    },
    {
      name: 'Bitcoin (WBTC)',
      symbol: 'BTC',
      assetSymbol: 'WBTC',
      decimals: 8,
      address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
      isShortable: true,
      isV1Available: true,
    },
    {
      name: 'Arbitrum',
      symbol: 'ARB',
      decimals: 18,
      priceDecimals: 3,
      address: '0x912CE59144191C1204E64559FE8253a0e49E6548',
    },
    {
      name: 'Wrapped SOL (Wormhole)',
      symbol: 'SOL',
      assetSymbol: 'WSOL (Wormhole)',
      decimals: 9,
      address: '0x2bcC6D6CdBbDC0a4071e48bb3B969b06B3330c07',
    },
    {
      name: 'Chainlink',
      symbol: 'LINK',
      decimals: 18,
      priceDecimals: 3,
      address: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4',
      isStable: false,
      isShortable: true,
      isV1Available: true,
    },
    {
      name: 'Uniswap',
      symbol: 'UNI',
      decimals: 18,
      priceDecimals: 3,
      address: '0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0',
      isStable: false,
      isShortable: true,
      isV1Available: true,
    },
    {
      name: 'Bridged USDC (USDC.e)',
      symbol: 'USDC.e',
      decimals: 6,
      address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
      isStable: true,
      isV1Available: true,
    },
    {
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      isStable: true,
      isV1Available: true,
    },
    {
      name: 'Tether',
      symbol: 'USDT',
      decimals: 6,
      address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      isStable: true,
      isV1Available: true,
    },
    {
      name: 'Dai',
      symbol: 'DAI',
      decimals: 18,
      address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
      isStable: true,
      isV1Available: true,
    },
    {
      name: 'Frax',
      symbol: 'FRAX',
      decimals: 18,
      address: '0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F',
      isStable: true,
      isV1Available: true,
    },
    {
      name: 'Magic Internet Money',
      symbol: 'MIM',
      decimals: 18,
      address: '0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A',
      isStable: true,
      isTempHidden: true,
      isV1Available: true,
    },
    {
      name: 'Bitcoin',
      symbol: 'BTC',
      address: '0x47904963fc8b2340414262125aF798B9655E58Cd',
      isSynthetic: true,
      decimals: 8,
    },
    {
      name: 'Dogecoin',
      symbol: 'DOGE',
      decimals: 8,
      priceDecimals: 4,
      address: '0xC4da4c24fd591125c3F47b340b6f4f76111883d8',
      isSynthetic: true,
    },
    {
      name: 'Litecoin',
      symbol: 'LTC',
      decimals: 8,
      address: '0xB46A094Bc4B0adBD801E14b9DB95e05E28962764',
      isSynthetic: true,
    },
    {
      name: 'XRP',
      symbol: 'XRP',
      decimals: 6,
      priceDecimals: 4,
      address: '0xc14e065b0067dE91534e032868f5Ac6ecf2c6868',
      isSynthetic: true,
    },
    {
      name: 'Wrapped BNB (LayerZero)',
      symbol: 'BNB',
      assetSymbol: 'WBNB (LayerZero)',
      address: '0xa9004A5421372E1D83fB1f85b0fc986c912f91f3',
      decimals: 18,
    },
  ],
  [AVALANCHE]: [
    {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18,
      address: AddressZero,
      isNative: true,
      isShortable: true,
      isV1Available: true,
    },
    {
      name: 'Wrapped AVAX',
      symbol: 'WAVAX',
      decimals: 18,
      address: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
      isWrapped: true,
      baseSymbol: 'AVAX',
      isV1Available: true,
    },
    {
      name: 'Ethereum (WETH.e)',
      symbol: 'ETH',
      assetSymbol: 'WETH.e',
      address: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB',
      decimals: 18,
      isShortable: true,
      isV1Available: true,
    },
    {
      name: 'Bitcoin (BTC.b)',
      symbol: 'BTC',
      assetSymbol: 'BTC.b',
      address: '0x152b9d0FdC40C096757F570A51E494bd4b943E50',
      decimals: 8,
      isShortable: true,
      isV1Available: true,
    },
    {
      name: 'Bitcoin (WBTC.e)',
      symbol: 'WBTC',
      assetSymbol: 'WBTC.e',
      address: '0x50b7545627a5162F82A992c33b87aDc75187B218',
      decimals: 8,
      isShortable: true,
      isV1Available: true,
    },
    {
      name: 'USD Coin',
      symbol: 'USDC',
      address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
      decimals: 6,
      isStable: true,
      isV1Available: true,
    },
    {
      name: 'Bridged USDC (USDC.e)',
      symbol: 'USDC.e',
      address: '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664',
      decimals: 6,
      isStable: true,
      isV1Available: true,
    },
    {
      name: 'Tether',
      symbol: 'USDT',
      decimals: 6,
      address: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7',
      isStable: true,
    },
    {
      name: 'Tether',
      symbol: 'USDT.e',
      decimals: 6,
      address: '0xc7198437980c041c805A1EDcbA50c1Ce5db95118',
      isStable: true,
    },
    {
      name: 'Dai',
      symbol: 'DAI.e',
      address: '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70',
      decimals: 18,
      isStable: true,
    },
    {
      name: 'Magic Internet Money',
      symbol: 'MIM',
      address: '0x130966628846BFd36ff31a822705796e8cb8C18D',
      decimals: 18,
      isStable: true,
      isTempHidden: true,
      isV1Available: true,
    },
    {
      name: 'Chainlink',
      symbol: 'LINK',
      decimals: 18,
      priceDecimals: 3,
      address: '0x5947BB275c521040051D82396192181b413227A3',
      isStable: false,
      isShortable: true,
    },
    {
      name: 'Dogecoin',
      symbol: 'DOGE',
      decimals: 8,
      priceDecimals: 4,
      address: '0xC301E6fe31062C557aEE806cc6A841aE989A3ac6',
      isSynthetic: true,
    },
    {
      name: 'Litecoin',
      symbol: 'LTC',
      decimals: 8,
      address: '0x8E9C35235C38C44b5a53B56A41eaf6dB9a430cD6',
      isSynthetic: true,
    },
    {
      name: 'Wrapped SOL (Wormhole)',
      symbol: 'SOL',
      assetSymbol: 'WSOL (Wormhole)',
      decimals: 9,
      address: '0xFE6B19286885a4F7F55AdAD09C3Cd1f906D2478F',
    },
    {
      name: 'XRP',
      symbol: 'XRP',
      decimals: 6,
      priceDecimals: 4,
      address: '0x34B2885D617cE2ddeD4F60cCB49809fc17bb58Af',
      isSynthetic: true,
    },
  ],
}

export function getToken(chainId: number, address: string): Token | undefined {
  return TOKENS[chainId]?.find(
    (token) => token.address.toLowerCase() === address.toLowerCase()
  )
}
