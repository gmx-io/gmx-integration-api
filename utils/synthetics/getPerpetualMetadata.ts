import { isSameStr } from '../../lib'
import { get24HPerpetualVolume } from './get24HPerpetualVolume'
import { getMarketsOpenInterest } from './getMarketsOpenInterest'
import { getPerpetualMarkets } from './getPerpetualMarkets'
import { getTokensPrice } from './getTokensPrice'

export async function getPerpetualMetadata(chainId: number) {
  const perpMarkets = await getPerpetualMarkets(chainId)
  const prices = await getTokensPrice(chainId)
  const volumeInfo = await get24HPerpetualVolume(chainId)
  const openInterestByMarket = await getMarketsOpenInterest(chainId)
  if (!perpMarkets || !prices || !volumeInfo || !openInterestByMarket)
    return null

  return perpMarkets
    .map((market) => {
      const { indexTokenInfo, indexToken, marketToken } = market

      if (!indexTokenInfo) return null
      const openInterest = openInterestByMarket[marketToken]
      const tokenSymbol = indexTokenInfo.baseSymbol ?? indexTokenInfo.symbol
      const priceInfo = prices.find((price) =>
        isSameStr(price.tokenSymbol, tokenSymbol)
      )
      const volumeUsd = volumeInfo[indexToken]
      return {
        ticker_id: `${tokenSymbol}-USD`,
        base_currency: tokenSymbol,
        target_currency: 'USD',
        product_type: 'Perpetual',
        last_price: priceInfo?.close ?? 0,
        high: priceInfo?.high ?? 0,
        low: priceInfo?.low ?? 0,
        base_volume: volumeUsd / (priceInfo?.close ?? 1),
        target_volume: volumeUsd,
        open_interest: openInterest.openInterestUsd,
        long_open_interest: openInterest.longInterestUsd,
        short_open_interest: openInterest.shortInterestUsd,
      }
    })
    .filter(Boolean)
}
