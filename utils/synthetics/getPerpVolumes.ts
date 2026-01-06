import { SQUID_SYNTHETICS_SUBGRAPHS } from '@/config/synthetics'
import fetchGraphQL from '@/lib/fetchGraphQL'
import { gql } from 'graphql-request'

const USD_VOLUME_DIVISOR = 1e30

type PositionVolumeInfo = {
  volume: string,
  market: string
}

type AccumulatedVolumes = { [indexToken: string]: number }

const query = gql`
  query Perp24HVolume($lastTimestamp: Float!) {
    positionsVolume(where: { timestamp: $lastTimestamp } ) {
      volume
      market
    }
  }
`

export async function getPerpVolumes(
  chainId: number
): Promise<AccumulatedVolumes | null> {
  const endpoint = SQUID_SYNTHETICS_SUBGRAPHS[chainId]
  const timestamp24hAgo =
    Math.floor(Date.now() / 1000 / 3600) * 3600 - 86400
  try {
    const { positionsVolume } = await fetchGraphQL<{
      positionsVolume: PositionVolumeInfo[]
    }>(endpoint, query, { lastTimestamp: timestamp24hAgo })
    const accumulatedVolumes = positionsVolume.reduce(
      (acc: AccumulatedVolumes, { market, volume }) => {
        const volumeUsd = Number(volume) / USD_VOLUME_DIVISOR
        acc[market] = (acc[market] || 0) + volumeUsd
        return acc
      },
      {}
    )
    return accumulatedVolumes
  } catch (e) {
    console.error(e)
    throw new Error('Failed to fetch 24H perpetual volume')
  }
}
