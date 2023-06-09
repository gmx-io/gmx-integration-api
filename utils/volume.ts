import { gql } from 'graphql-request'
import { SUBGRAPHS_API_URLS } from '../config/constants'
import fetchGraphQL from '../lib/fetchGraphQL'

const query = gql`
  query Last24hVolume($id: ID!, $timestamp: Int!) {
    hourlyVolumeByTokens(
      orderBy: timestamp
      orderDirection: desc
      first: 1000
      where: { timestamp_gte: $timestamp, tokenB: $id }
    ) {
      tokenA
      tokenB
      margin
      timestamp
    }
    liquidatedPositions(
      where: { timestamp_gte: $timestamp, indexToken: $id, type: full }
    ) {
      size
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
    const marginVolume = last24hVolumeOfToken.hourlyVolumeByTokens
      .map((volume: any) => volume.margin / 1e30)
      .reduce((a: number, b: number) => a + b, 0)
    const liquidationVolume = last24hVolumeOfToken.liquidatedPositions
      .map((p: any) => p.size / 1e30)
      .reduce((a: number, b: number) => a + b, 0)
    return marginVolume + liquidationVolume
  } catch (e) {
    console.error(e)
    return 0
  }
}
