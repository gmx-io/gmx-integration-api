import { SYNTHETICS_SUBGRAPHS } from '@/config/synthetics'
import fetchGraphQL from '@/lib/fetchGraphQL'
import { gql } from 'graphql-request'

const USD_VOLUME_DIVISOR = 1e30

type PerpVolumeInfo = {
  indexToken: string
  volumeUsd: string
}

type AccumulatedVolumes = { [indexToken: string]: number }

const query = gql`
  query Swap24HVolume($lastTimestamp: Int!) {
    positionVolumeInfos(
      orderBy: timestamp
      orderDirection: desc
      where: { period: "1h", timestamp_gte: $lastTimestamp }
      first: 10000
    ) {
      indexToken
      volumeUsd
    }
  }
`

export async function get24HPerpetualVolume(
  chainId: number
): Promise<AccumulatedVolumes | null> {
  const endpoint = SYNTHETICS_SUBGRAPHS[chainId]
  const timestamp24hAgo =
    Math.floor(Date.now() / 1000 / 3600) * 3600 - 60 * 60 * 24
  try {
    const { positionVolumeInfos } = await fetchGraphQL<{
      positionVolumeInfos: PerpVolumeInfo[]
    }>(endpoint, query, { lastTimestamp: timestamp24hAgo })
    const accumulatedVolumes = positionVolumeInfos.reduce(
      (acc: AccumulatedVolumes, { indexToken, volumeUsd }) => {
        const volume = Number(volumeUsd) / USD_VOLUME_DIVISOR
        acc[indexToken] = (acc[indexToken] || 0) + volume
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
