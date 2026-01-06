import { gql } from 'graphql-request'
import fetchGraphQL from '../../lib/fetchGraphQL'
import {
  ORACLE_KEEPER_URLS,
  SQUID_SYNTHETICS_SUBGRAPHS,
} from '../../config/synthetics'
import { fetchUrl } from '@/lib/fetchUrl'

const query = gql`
  query TokenPrices {
    prices(where: { isSnapshot_eq: false, type_eq: v2 }, limit: 1000) {
      maxPrice
      minPrice
      token
    }
  }
`

type TokenPriceInfo = {
  maxPrice: string
  minPrice: string
  token: string
}

type TokenPrices = {
  [key: string]: {
    min: string
    max: string
  }
}

export async function getContractPrices(
  chainId: number
): Promise<TokenPrices | null> {
  const endpoint = SQUID_SYNTHETICS_SUBGRAPHS[chainId]
  try {
    const { prices } = await fetchGraphQL<{
      prices: TokenPriceInfo[]
    }>(endpoint, query)

    const mappedPrices = prices.reduce<TokenPrices>(
      (acc, { minPrice, maxPrice, token }) => {
        acc[token] = { min: minPrice, max: maxPrice }
        return acc
      },
      {}
    )
    return mappedPrices
  } catch (e) {
    console.error(e)
    return null
  }
}

type PriceInfo = {
  tokenSymbol: string
  high: number
  low: number
  open: number
  close: number
}

export async function getTokensPrice(chainId: number): Promise<PriceInfo[]> {
  const baseUrl = ORACLE_KEEPER_URLS[chainId]
  const dailyPriceUrl = `${baseUrl}/prices/24h`
  const pricesData: PriceInfo[] = await fetchUrl(dailyPriceUrl)
  return pricesData
}
