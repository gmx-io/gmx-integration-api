export const AVALANCHE = 43114
export const ARBITRUM = 42161
export const AddressZero = '0x0000000000000000000000000000000000000000'

export const SUBGRAPHS_API_URLS: { [key: number | string]: string } = {
  [ARBITRUM]:
    'https://subgraph.satsuma-prod.com/9d997f2f923e/gmx/gmx-arbitrum-stats/api',
  [AVALANCHE]:
    'https://subgraph.satsuma-prod.com/9d997f2f923e/gmx/gmx-avalanche-stats/api',
  chainlink: 'https://api.thegraph.com/subgraphs/name/deividask/chainlink',
}

export const currentPriceUrls: { [key: number]: string } = {
  [ARBITRUM]: 'https://gmx-server-mainnet.uw.r.appspot.com/prices',
  [AVALANCHE]: 'https://gmx-avax-server.uc.r.appspot.com/prices',
}

export const CHAINLINK_CONTRACTS: { [key: string]: string } = {
  USDC: '0x789190466e21a8b78b8027866cbbdc151542a26c',
  'USDC.e': '0x789190466e21a8b78b8027866cbbdc151542a26c',
  USDT: '0x838a42bd3b727880ef27920acb637abeff2f73d4',
  DAI: '0xdec0a100ead1faa37407f0edc76033426cf90b82',
  FRAX: '0x61eb091ea16a32ea5b880d0b3d09d518c340d750',
}
