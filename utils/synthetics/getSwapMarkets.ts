import { MarketInfo, getMarketsInfo } from './getMarketsInfo'

export async function getSwapMarkets(chainId: number) {
  const marketInfos = await getMarketsInfo(chainId)
  if (!marketInfos) return

  const uniqueMarketsMap = new Map<string, MarketInfo>()
  marketInfos.forEach((market) => {
    const tokens = [market.longToken, market.shortToken].sort()
    const pairKey = tokens.join('-')

    if (!uniqueMarketsMap.has(pairKey)) {
      uniqueMarketsMap.set(pairKey, market)
    }
  })

  return Array.from(uniqueMarketsMap.values())
}
