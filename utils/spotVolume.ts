import { gql } from 'graphql-request'
import { SUBGRAPHS_API_URLS } from '../config/constants'
import fetchGraphQL from '../lib/fetchGraphQL'

const query = gql`
  query Last24hVolume($tokenA: String!, $tokenB: String!, $timestamp: Int!) {
    hourlyVolumeByTokens(
      where: {
        tokenA_in: [$tokenA, $tokenB]
        tokenB_in: [$tokenA, $tokenB]
        timestamp_gte: $timestamp
      }
      orderBy: timestamp
      orderDirection: desc
    ) {
      swap
    }
  }
`

export async function getLast24hSwapVolume(
  chainId: number,
  tokenA: string,
  tokenB: string
) {
  const endpoint = SUBGRAPHS_API_URLS[chainId]

  try {
    const last24hVolumeOfToken = await fetchGraphQL(endpoint, query, {
      tokenA: tokenA.toLowerCase(),
      tokenB: tokenB.toLowerCase(),
      timestamp: Math.floor(Date.now() / 1000) - 86400,
    })
    return last24hVolumeOfToken.hourlyVolumeByTokens
      .map((volume: any) => volume.swap / 1e30)
      .reduce((a: number, b: number) => a + b, 0)
  } catch (e) {
    console.error(e)
    return 0
  }
}
