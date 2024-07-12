import { getPerpTokens, getTokenBySymbol } from '../config/tokens'
import { getTokenOpenInterest } from './getTokenOpenInterest'
import { getTokenPrice } from './prices'
import { Pair } from './types'
import { getLast24hVolume } from './volume'

async function getPairMetadata(ticker: string, chainId: number) {
  const token = getTokenBySymbol(chainId, ticker)
  const [openInterest, { lastPrice, high, low }, volumeLast24Hours] = await Promise.all([
    getTokenOpenInterest(chainId, token.address),
    getTokenPrice(chainId, token.address),
    getLast24hVolume(chainId, token.address)
  ])
  
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

export default async function getPerpetualPairs(
  chainId: number
): Promise<Pair[]> {
  const tokens = getPerpTokens(chainId)
  return Promise.all(
    tokens.map(async (token) => {
      const pair = await getPairMetadata(token.symbol, chainId)
      return pair
    })
  )
}
