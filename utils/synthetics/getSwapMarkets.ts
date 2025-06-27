import { MarketInfo, getMarketsInfo } from './getMarketsInfo'

export async function getSwapMarkets(chainId: number) {
  let marketInfos = await getMarketsInfo(chainId)
  if (!marketInfos) return

  // To remove single token and deprecated GM pools.
  marketInfos = marketInfos.filter(
    (market) => market.longToken !== market.shortToken
     && !market.longTokenInfo.symbol.endsWith('deprecated')
  );

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
