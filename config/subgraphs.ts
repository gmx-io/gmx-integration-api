import { ARBITRUM, AVALANCHE } from './constants'

export const SUBGRAPHS_API_URLS: { [key: number]: string } = {
  [ARBITRUM]:
    'https://api.thegraph.com/subgraphs/name/vipineth/gmx-stats-arbitrum',
  [AVALANCHE]:
    'https://api.thegraph.com/subgraphs/name/vipineth/gmx-stats-avax',
}
