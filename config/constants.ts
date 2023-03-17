export const AVALANCHE = 43114
export const ARBITRUM = 42161
export const AddressZero = '0x0000000000000000000000000000000000000000'

export const SUBGRAPHS_API_URLS: { [key: number]: string } = {
  [ARBITRUM]:
    'https://api.thegraph.com/subgraphs/name/vipineth/gmx-stats-arbitrum',
  [AVALANCHE]:
    'https://api.thegraph.com/subgraphs/name/vipineth/gmx-stats-avax',
}

// https://stats.gmx.io/api/candles/ETH?preferableChainId=42161&period=1h&limit=24
