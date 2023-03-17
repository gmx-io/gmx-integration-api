import { gql } from 'graphql-request'
import { SUBGRAPHS_API_URLS } from '../config/constants'
import fetchGraphQL from '../lib/fetchGraphQL'

interface FastPrice {
  value: number
  token: string
  period: string
}

const query = gql`
  query Last24hVolume($id: ID!, $timestamp: Int!) {
    hourlyVolumeByTokens(
      orderBy: timestamp
      orderDirection: desc
      where: { timestamp_gt: $timestamp, tokenB: $id }
    ) {
      tokenA
      tokenB
      margin
      liquidation
      timestamp
    }
  }
`

export async function getLast24hVolume(chainId: number, tokenAddress: string) {
  const endpoint = SUBGRAPHS_API_URLS[chainId]
  const contractAddress = tokenAddress.toLowerCase()
  try {
    const last24hVolumeOfToken = await fetchGraphQL(endpoint, query, {
      id: contractAddress,
      timestamp: Math.floor(Date.now() / 1000) - 86400,
    })
    return last24hVolumeOfToken.hourlyVolumeByTokens
      .map((volume: any) => volume.margin / 1e30 + volume.liquidation / 1e30)
      .reduce((a: number, b: number) => a + b, 0)
  } catch (e) {
    console.error(e)
    return 0
  }
}
