import { gql } from 'graphql-request'
import fetchGraphQL from '../../lib/fetchGraphQL'
import {
  ORACLE_KEEPER_URLS,
  SYNTHETICS_SUBGRAPHS,
} from '../../config/synthetics'
import { fetchUrl } from '@/lib/fetchUrl'

const query = gql`
  query TokenPrices {
    tokenPrices {
      maxPrice
      minPrice
      id
    }
  }
`

type TokenPriceInfo = {
  maxPrice: string
  minPrice: string
  id: string
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
  const endpoint = SYNTHETICS_SUBGRAPHS[chainId]
  try {
    const { tokenPrices } = await fetchGraphQL<{
      tokenPrices: TokenPriceInfo[]
    }>(endpoint, query)

    const mappedPrices = tokenPrices.reduce<TokenPrices>(
      (acc, { id, minPrice, maxPrice }) => {
        acc[id] = { min: minPrice, max: maxPrice }
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

// export function getStableTokenPrice(tokenSymbol: string) {
//   return {
//     tokenSymbol,
//     high: 1,
//     low: 1,
//     open: 1,
//     close: 1,
//   }
// }

export async function getTokensPrice(chainId: number): Promise<PriceInfo[]> {
  const baseUrl = ORACLE_KEEPER_URLS[chainId]
  const dailyPriceUrl = `${baseUrl}/prices/24h`
  const pricesData: PriceInfo[] = await fetchUrl(dailyPriceUrl)
  return pricesData
}
