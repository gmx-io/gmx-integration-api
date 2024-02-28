import { isSameStr } from '../../lib'
import { get24HPerpetualVolume } from './get24HPerpetualVolume'
import { get24HSwapVolume } from './get24HSwapVolume'
import { getPerpetualMarkets } from './getPerpetualMarkets'
import { getTokensPrice } from './getTokensPrice'

export async function getPerpetualMetadata(chainId: number) {
  const perpMarkets = await getPerpetualMarkets(chainId)
  const prices = await getTokensPrice(chainId)
  const volumeInfo = await get24HPerpetualVolume(chainId)
  if (!perpMarkets || !prices || !volumeInfo) return null

  return perpMarkets
    .map((market) => {
      const { indexTokenInfo, indexToken } = market
      if (!indexTokenInfo) return null

      const tokenSymbol = indexTokenInfo.baseSymbol ?? indexTokenInfo.symbol
      const priceInfo = prices.find((price) =>
        isSameStr(price.tokenSymbol, tokenSymbol)
      )
      const volumeUsd = volumeInfo[indexToken]
      return {
        ticker_id: `${tokenSymbol}-USD`,
        base_currency: indexTokenInfo?.symbol,
        target_currency: 'USD',
        product_type: 'Perpetual',
        last_price: priceInfo?.close,
        high: priceInfo?.high,
        low: priceInfo?.low,
        base_volume: volumeUsd / (priceInfo?.close ?? 1),
        target_volume: volumeUsd,
      }
    })
    .filter(Boolean)
}
