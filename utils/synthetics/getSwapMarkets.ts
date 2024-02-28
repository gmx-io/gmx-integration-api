import { getToken } from '../../config/synthetics'
import { getMarketsInfo } from './getMarketsInfo'

export async function getSwapMarkets(chainId: number) {
  const marketInfos = await getMarketsInfo(chainId)
  if (!marketInfos) return
  const uniqueTokens = marketInfos
    .filter(Boolean)
    .reduce<string[]>((acc, market) => {
      if (!acc.includes(market.longToken)) {
        acc.push(market.longToken)
      }
      if (!acc.includes(market.shortToken)) {
        acc.push(market.shortToken)
      }
      return acc
    }, [])

  const spotAssetPairs = []
  if (uniqueTokens) {
    for (let i = 0; i < uniqueTokens.length; i++) {
      for (let j = i + 1; j < uniqueTokens.length; j++) {
        const token0 = getToken(chainId, uniqueTokens[i])
        const token1 = getToken(chainId, uniqueTokens[j])
        spotAssetPairs.push({
          token0,
          token1,
          pairName: `${token0?.baseSymbol ?? token0?.symbol}-${
            token1?.baseSymbol ?? token1?.symbol
          }`,
          pairAddress: `${token0?.address}-${token1?.address}`,
        })
      }
    }
  }
  return spotAssetPairs
}
