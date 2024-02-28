type Pair = {
  ticker_id: string
  base_currency: string
  target_currency: string
  product_type: 'Perpetual' | 'Spot'
  last_price: number
  high: number
  low: number
  base_volume: number
  target_volume: number
  volume_usd: number
  open_interest?: number
}
export const PAIRS: Pair[] = []
