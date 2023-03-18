import { gql } from 'graphql-request'
import { SUBGRAPHS_API_URLS } from '../config/constants'
import fetchGraphQL from '../lib/fetchGraphQL'

interface FastPrice {
  value: number
  token: string
  period: string
}

interface TokenPrices {
  fastPrice: FastPrice
  fastPrices: FastPrice[]
  openInterestByToken: {
    period: string
    short: number
    long: number
    token: string
    timestamp: number
  }
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
    openInterestByToken(id: $id, period: "total") {
      period
      short
      long
      token
      timestamp
    }
  }
`

export async function getTokenPrice(chainId: number, tokenAddress: string) {
  const endpoint = SUBGRAPHS_API_URLS[chainId]
  const contractAddress = tokenAddress.toLowerCase()
  try {
    const tokenPrices: TokenPrices = await fetchGraphQL(endpoint, query, {
      id: contractAddress,
    })
    const last24Hours = tokenPrices.fastPrices.map(
      (p: FastPrice) => p.value / 1e30
    )
    console.log({ tokenPrices })
    return {
      lastPrice: tokenPrices.fastPrice.value / 1e30,
      high: Math.max(...last24Hours),
      low: Math.min(...last24Hours),
      openInterest:
        tokenPrices.openInterestByToken.short / 1e30 +
        tokenPrices.openInterestByToken.long / 1e30,
    }
  } catch (e) {
    console.error(e)
    return { lastPrice: 0, high: 0, low: 0, openInterest: 0 }
  }
}
