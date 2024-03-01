import { gql } from 'graphql-request'
import fetchGraphQL from '../../lib/fetchGraphQL'
import { SYNTHETICS_SUBGRAPHS } from '../../config/synthetics'

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
