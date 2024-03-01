import { gql } from 'graphql-request'
import { SYNTHETICS_SUBGRAPHS, Token, getToken } from '../../config/synthetics'
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

    return marketInfos
      .map((marketInfo) => {
        const indexTokenInfo = getToken(chainId, marketInfo.indexToken)
        const longTokenInfo = getToken(chainId, marketInfo.longToken)
        const shortTokenInfo = getToken(chainId, marketInfo.shortToken)
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
        }
      })
      .filter(Boolean) as MarketInfo[]
  } catch (e) {
    console.error(e)
    return null
  }
}
