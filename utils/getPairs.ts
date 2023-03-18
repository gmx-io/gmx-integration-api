import { ARBITRUM } from '../config/constants'
import { getPerpTokens, getTokenBySymbol } from '../config/tokens'
import { getTokenPrice } from './prices'
import { getLast24hVolume } from './volume'

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

async function getPairMetadata(ticker: string, chainId: number) {
  const token = getTokenBySymbol(chainId, ticker)
  const { lastPrice, high, low, openInterest } = await getTokenPrice(
    ARBITRUM,
    token.address
  )
  const volumeLast24Hours = await getLast24hVolume(chainId, token.address)
  return {
    ticker_id: ticker + '_USD',
    base_currency: ticker,
    target_currency: 'USD',
    product_type: 'Perpetual',
    last_price: lastPrice,
    low,
    high,
    base_volume: volumeLast24Hours / ((high + low) / 2),
    target_volume: volumeLast24Hours,
    open_interest: openInterest,
  }
}

export default async function getPairs(chainId: number) {
  const tokens = getPerpTokens(chainId)
  return Promise.all(
    tokens.map(async (token) => {
      const pair = await getPairMetadata(token.symbol, chainId)
      return pair
    })
  )
}
