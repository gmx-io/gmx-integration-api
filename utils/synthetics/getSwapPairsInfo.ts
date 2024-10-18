import { isSameStr } from '@/lib/index'
import { get24HSwapVolume } from './getSwapVolumes'
import { getSwapMarkets } from './getSwapMarkets'
import { getTokensPrice } from './getTokensPrice'

export async function getSwapPairsInfo(chainId: number) {
  const [swapPairs, pairSwapVolume, prices] = await Promise.all(
    [
      getSwapMarkets(chainId),
      get24HSwapVolume(chainId),
      getTokensPrice(chainId)
    ]
  )

  return swapPairs?.map((pair) => {
    const { longToken, shortToken, longTokenInfo, shortTokenInfo } = pair
    const pairAddress = `${longToken}-${shortToken}`
    const volumeUsd = pairSwapVolume?.[pairAddress.toLowerCase()] ?? 0
    const longTokenSymbol = longTokenInfo.baseSymbol ?? longTokenInfo.symbol
    const shortTokenSymbol = shortTokenInfo.baseSymbol ?? shortTokenInfo.symbol
    const longTokenPriceInfo = prices.find((price) => isSameStr(price.tokenSymbol, longTokenSymbol))
    const shortTokenPriceInfo =  prices.find((price) => isSameStr(price.tokenSymbol, shortTokenSymbol))
    const priceCalculation = (type: 'close' | 'high' | 'low') =>
      longTokenPriceInfo && shortTokenPriceInfo
        ? (longTokenPriceInfo[type] ?? 0) / (shortTokenPriceInfo[type] ?? 1)
        : 0

    return {
      ticker_id: `${longTokenSymbol}-${shortTokenSymbol}`,
      base_currency: longTokenSymbol,
      target_currency: shortTokenSymbol,
      product_type: 'Spot',
      last_price: priceCalculation('close'),
      high: priceCalculation('high'),
      low: priceCalculation('low'),
      base_volume: volumeUsd / (longTokenPriceInfo?.close ?? 1),
      target_volume: volumeUsd / (shortTokenPriceInfo?.close ?? 1),
      volume_usd: volumeUsd,
    }
  })
}
