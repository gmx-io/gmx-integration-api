import { isSameStr } from '@/lib/index'
import { getMarketsLiquidity } from './getMarketsLiquidityInfo'
import { getSwapMarkets } from './getSwapMarkets'
import { get24HSwapVolume } from './getSwapVolumes'
import { getTokensPrice } from './getTokensPrice'

export async function getSwapPairsInfo(chainId: number) {
  const [swapPairs, pairSwapVolume, prices, liquidityInfo] = await Promise.all([
    getSwapMarkets(chainId),
    get24HSwapVolume(chainId),
    getTokensPrice(chainId),
    getMarketsLiquidity(chainId),
  ])

  if (!swapPairs || !pairSwapVolume || !prices || !liquidityInfo) {
    return null
  }

  return swapPairs?.map((pair) => {
    const {
      longToken,
      shortToken,
      longTokenInfo,
      shortTokenInfo,
      marketToken,
    } = pair
    const pairAddress = `${longToken}-${shortToken}`
    const liquidityUsd = liquidityInfo[marketToken]?.liquidityUsd ?? 0n
    const volumeUsd = pairSwapVolume?.[pairAddress] ?? 0
    const longTokenSymbol = longTokenInfo.baseSymbol ?? longTokenInfo.symbol
    const shortTokenSymbol = shortTokenInfo.baseSymbol ?? shortTokenInfo.symbol
    const longTokenPriceInfo = prices.find((price) =>
      isSameStr(price.tokenSymbol, longTokenSymbol)
    )
    const shortTokenPriceInfo = prices.find((price) =>
      isSameStr(price.tokenSymbol, shortTokenSymbol)
    )

    return {
      ticker_id: `${longTokenSymbol}-${shortTokenSymbol}`,
      base_currency: longTokenSymbol,
      target_currency: shortTokenSymbol,
      product_type: 'Spot',
      last_price: longTokenPriceInfo?.close ?? 0,
      high: longTokenPriceInfo?.high ?? 0,
      low: longTokenPriceInfo?.low ?? 0,
      base_volume: volumeUsd / (longTokenPriceInfo?.close ?? 1),
      target_volume: volumeUsd / (shortTokenPriceInfo?.close ?? 1),
      volume_usd: volumeUsd,
      pool_id: marketToken,
      liquidity_in_usd: Number(liquidityUsd),
    }
  })
}
