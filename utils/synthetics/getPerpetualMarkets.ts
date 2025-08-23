import { getMarketsInfo } from './getMarketsInfo'

export async function getPerpetualMarkets(chainId: number) {
  const marketInfos = await getMarketsInfo(chainId)
  
  // To filter for Perpetuals and non-deprecated markets 
  const perpetualMarkets = marketInfos?.filter(
    (market) => market.type === 'Perpetual' &&
      !market.indexTokenInfo.symbol.endsWith('deprecated')
  )
  
  return perpetualMarkets
}
