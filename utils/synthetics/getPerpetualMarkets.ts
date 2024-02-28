import { getMarketsInfo } from './getMarketsInfo'

export async function getPerpetualMarkets(chainId: number) {
  const marketInfos = await getMarketsInfo(chainId)
  const perpetualMarkets = marketInfos?.filter(
    (market) => market.type === 'perpetual'
  )

  return perpetualMarkets
}
