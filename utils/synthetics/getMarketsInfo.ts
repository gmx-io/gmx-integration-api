import { gql } from 'graphql-request'
import {
  SQUID_SYNTHETICS_SUBGRAPHS,
  Token,
  getTokensCached,
} from '../../config/synthetics'
import fetchGraphQL from '../../lib/fetchGraphQL'
import { AddressZero } from '../../config/constants'

const query = gql`
  query Markets {
    marketInfos(limit: 1000) {
      id
      marketTokenAddress
      indexTokenAddress
      longTokenAddress
      shortTokenAddress
      marketTokenSupply
    }
  }
`

type SquidMarketInfo = {
  id: string
  marketTokenAddress: string
  indexTokenAddress: string
  longTokenAddress: string
  shortTokenAddress: string
  marketTokenSupply: string
}

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
  const endpoint = SQUID_SYNTHETICS_SUBGRAPHS[chainId]
  try {
    const { marketInfos } = await fetchGraphQL<{
      marketInfos: SquidMarketInfo[]
    }>(endpoint, query)
    const tokens = await getTokensCached(chainId)
    const findToken = (address: string) =>
      tokens.find((t) => t.address.toLowerCase() === address.toLowerCase())
    const detailedMarketInfos = await Promise.all(
      marketInfos.map(async (marketInfo) => {
        const indexTokenInfo = findToken(marketInfo.indexTokenAddress)
        const longTokenInfo = findToken(marketInfo.longTokenAddress)
        const shortTokenInfo = findToken(marketInfo.shortTokenAddress)
        const isSpotMarket = marketInfo.indexTokenAddress === AddressZero

        if (!indexTokenInfo && !isSpotMarket || !longTokenInfo || !shortTokenInfo) {
          return null
        }

        return {
          ...marketInfo,
          indexToken: marketInfo.indexTokenAddress,
          longToken: marketInfo.longTokenAddress,
          marketToken: marketInfo.marketTokenAddress,
          marketTokensSupply: marketInfo.marketTokenSupply,
          shortToken: marketInfo.shortTokenAddress,
          indexTokenInfo,
          longTokenInfo,
          shortTokenInfo,
          type: isSpotMarket ? 'Spot' : 'Perpetual',
        } as MarketInfo
      })
    )

    // Filtering out for any null results in market token info
    return detailedMarketInfos.filter((m): m is MarketInfo => Boolean(m));
  } catch (e) {
    console.error(e)
    return null
  }
}
