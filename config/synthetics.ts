import { ARBITRUM, AVALANCHE, BOTANIX } from './constants'
import { getTokens } from '@/utils/synthetics/getTokens'

export const ORACLE_KEEPER_URLS: { [key: number]: string} = {
  [ARBITRUM]: 'https://arbitrum-api.gmxinfra2.io',
  [AVALANCHE]: 'https://avalanche-api.gmxinfra2.io',
  [BOTANIX]: 'https://botanix-api.gmxinfra2.io'
}

export const AddressZero = '0x0000000000000000000000000000000000000000'
export const MAX_PNL_FACTOR_FOR_TRADERS  = '0xab15365d3aa743e766355e2557c230d8f943e195dc84d9b2b05928a07b635ee1'

export const SYNTHETICS_SUBGRAPHS: { [key: number]: string } = {
  [ARBITRUM]:
    'https://subgraph.satsuma-prod.com/3b2ced13c8d9/gmx/synthetics-arbitrum-stats/api',
  [AVALANCHE]:
    'https://subgraph.satsuma-prod.com/3b2ced13c8d9/gmx/synthetics-avalanche-stats/api',
  [BOTANIX]:
    'https://subgraph.satsuma-prod.com/3b2ced13c8d9/gmx/synthetics-botanix-stats/api',
}

export type Token = {
  name: string
  symbol: string
  address: string
  decimals: number
  synthetic?: boolean
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

const tokensCache: { [chainId: number]: Token[] } = {}

export async function getTokensCached(chainId: number): Promise<Token[]> {

  // If not in the tokensCache -> Add to cache
  if (!tokensCache[chainId]) {
    tokensCache[chainId] = await getTokens(chainId)
  }
  return tokensCache[chainId]
}

export async function getToken(chainId: number, address: string): Promise<Token | undefined> {
  const tokens =  await getTokensCached(chainId);
  // Case insensitive search
  return tokens.find(
    (token) => token.address.toLowerCase() === address.toLowerCase()
  )
}