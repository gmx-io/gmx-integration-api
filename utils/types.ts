export type Pair = {
  ticker_id: string
  base_currency: string
  target_currency: string
  base_volume: number
  product_type: string
  target_volume: number
  open_interest?: number
  last_price: number | undefined
  bid?: number
  ask?: number
  high?: number
  low?: number
  funding_rate?: number
  next_funding_rate?: number
  next_funding_timestamp?: number
  volume_usd?: number
}
