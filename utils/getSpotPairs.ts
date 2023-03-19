import {
  getSwapPairs,
  getTokenByAddress,
  getTokenBySymbol,
} from '../config/tokens'
import { getLast24hSwapVolume } from './spotVolume'

type Pair = {
  ticker_id: string
  base_currency: string
  target_currency: string
  last_price: number
  base_volume: number
  target_volume: number
  product_type: string
  open_interest: number
  index_price: number
  index_name: string
  bid?: number
  ask?: number
  high?: number
  low?: number
  funding_rate?: number
  next_funding_rate?: number
  next_funding_timestamp?: number
}
export const PAIRS: Pair[] = []

async function getPairMetadata(
  chainId: number,
  tokenA: string,
  tokenB: string
) {
  const tokenAInfo = getTokenBySymbol(chainId, tokenA)
  const tokenBInfo = getTokenBySymbol(chainId, tokenB)
  const volumes = await getLast24hSwapVolume(
    chainId,
    tokenAInfo.address,
    tokenBInfo.address
  )
  return {
    ticker_id: tokenA + '_' + tokenB,
    base_currency: tokenAInfo.address,
    target_currency: tokenBInfo.address,
    product_type: 'Spot',
    last_price: 0,
    low: 0,
    high: 0,
    base_volume: volumes,
    target_volume: 0,
    open_interest: 0,
  }
}

export default async function getSpotPairs(chainId: number) {
  const pairs = getSwapPairs(chainId)
  return Promise.all(
    pairs.map(async (pair) => {
      const [tokenA, tokenB] = pair
      return await getPairMetadata(chainId, tokenA, tokenB)
    })
  )
}
