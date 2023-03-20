import { gql } from 'graphql-request'
import { CHAINLINK_CONTRACTS, SUBGRAPHS_API_URLS } from '../config/constants'
import { getTokenByAddress } from '../config/tokens'
import fetchGraphQL from '../lib/fetchGraphQL'

interface FastPrice {
  value: number
  token: string
  period: string
}

const query = gql`
  query TokenPrices($id: ID!) {
    fastPrice(id: $id, period: "last") {
      value
      token
      period
    }
    fastPrices(
      where: { period: "hourly", token: $id }
      first: 24
      orderBy: timestamp
      orderDirection: desc
    ) {
      token
      value
      timestamp
      period
      id
    }
  }
`

const stableTokenQuery = gql`
  query StableTokenPrices($id: ID!) {
    feeds(where: { contractAddress: $id }) {
      name
      rounds(orderBy: unixTimestamp, orderDirection: desc, first: 1) {
        value
        submissions {
          value
        }
      }
    }
  }
`

export async function getTokenPrice(chainId: number, tokenAddress: string) {
  const token = getTokenByAddress(chainId, tokenAddress)
  try {
    return token.isStable
      ? await getStablePrice(token.symbol)
      : await getNonStablePrice(chainId, tokenAddress)
  } catch (e) {
    console.error(e)
    return { lastPrice: 0, high: 0, low: 0 }
  }
}

async function getStablePrice(symbol: string) {
  const endpoint = SUBGRAPHS_API_URLS['chainlink']
  const priceInfo = await fetchGraphQL(endpoint, stableTokenQuery, {
    id: CHAINLINK_CONTRACTS[symbol],
  })
  const lastPrice = priceInfo.feeds[0].rounds[0].value / 1e8
  const last24Hours = priceInfo.feeds[0].rounds[0].submissions.map(
    (s: any) => s.value / 1e8
  )
  return {
    lastPrice,
    high: Math.max(...last24Hours),
    low: Math.min(...last24Hours),
  }
}

async function getNonStablePrice(chainId: number, tokenAddress: string) {
  const endpoint = SUBGRAPHS_API_URLS[chainId]
  const priceInfo = await fetchGraphQL(endpoint, query, {
    id: tokenAddress.toLowerCase(),
  })
  const lastPrice = priceInfo.fastPrice.value / 1e30
  const last24Hours = priceInfo.fastPrices.map((p: FastPrice) => p.value / 1e30)
  return {
    lastPrice,
    high: Math.max(...last24Hours),
    low: Math.min(...last24Hours),
  }
}
