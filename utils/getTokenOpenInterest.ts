import { gql } from 'graphql-request'
import { SUBGRAPHS_API_URLS } from '../config/constants'
import fetchGraphQL from '../lib/fetchGraphQL'

const query = gql`
  query TokenOpenInterest($id: ID!) {
    openInterestByToken(id: $id, period: "total") {
      period
      short
      long
      token
      timestamp
    }
  }
`

export async function getTokenOpenInterest(
  chainId: number,
  tokenAddress: string
) {
  const endpoint = SUBGRAPHS_API_URLS[chainId]
  const contractAddress = tokenAddress.toLowerCase()
  try {
    const tokenOpenInterest = await fetchGraphQL(endpoint, query, {
      id: contractAddress,
    })
    return (
      tokenOpenInterest.openInterestByToken.short / 1e30 +
      tokenOpenInterest.openInterestByToken.long / 1e30
    )
  } catch (e) {
    console.error(e)
    return 0
  }
}
