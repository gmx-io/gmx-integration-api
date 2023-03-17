import { getPerpTokens } from '../config/tokens'

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
}
export const PAIRS: Pair[] = []

function getPairMeta(ticker: string) {
  const pair = {
    ticker_id: ticker + '_USD',
    base_currency: ticker,
    target_currency: 'USD',
  }
}

export default function getPairs(chainId: number) {
  const tokens = getPerpTokens(chainId)
  return tokens
}
