export type Pair = {
  ticker_id: string
  base_currency: string
  target_currency: string
  last_price: number
  base_volume: number
  product_type: string
  target_volume: number
  open_interest?: number
  bid?: number
  ask?: number
  high?: number
  low?: number
  funding_rate?: number
  next_funding_rate?: number
  next_funding_timestamp?: number
}
