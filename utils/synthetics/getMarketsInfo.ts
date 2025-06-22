import { gql } from 'graphql-request'
import { SYNTHETICS_SUBGRAPHS, Token, getTokensCached } from '../../config/synthetics'
import fetchGraphQL from '../../lib/fetchGraphQL'
import { AddressZero } from '../../config/constants'

const query = gql`
  query Markets {
    marketInfos {
      id
      indexToken
      longToken
      marketToken
      marketTokensSupply
      shortToken
    }
  }
`

export type MarketInfo = {
  id: string
  indexToken: string
  longToken: string
  marketToken: string
  marketTokensSupply: string
  shortToken: string
  indexTokenInfo: Token
  longTokenInfo: Token
  shortTokenInfo: Token
  type: 'Spot' | 'Perpetual'
}

export async function getMarketsInfo(
  chainId: number
): Promise<MarketInfo[] | null> {
  const endpoint = SYNTHETICS_SUBGRAPHS[chainId]
  try {
    const { marketInfos } = await fetchGraphQL<{ marketInfos: MarketInfo[] }>(
      endpoint,
      query
    )
    const tokens = await getTokensCached(chainId)
    const findToken = (address: string) => 
      tokens.find((t) => t.address.toLowerCase() === address.toLowerCase())
    const detailedMarketInfos = await Promise.all(
      marketInfos.map(async (marketInfo) => {
        const indexTokenInfo = findToken(marketInfo.indexToken)
        const longTokenInfo = findToken(marketInfo.longToken)
        const shortTokenInfo = findToken(marketInfo.shortToken)
        const isSpotMarket = marketInfo.indexToken === AddressZero
        
        if (!indexTokenInfo || !longTokenInfo || !shortTokenInfo) {
          return null
        }
        return {
          ...marketInfo,
          indexTokenInfo,
          longTokenInfo,
          shortTokenInfo,
          type: isSpotMarket ? 'Spot' : 'Perpetual',
        } as MarketInfo
      })
    )

    // Filtering out for any null results in market token info
    return detailedMarketInfos.filter(Boolean) as MarketInfo[];

  } catch (e) {
    console.error(e)
    return null
  }
}
