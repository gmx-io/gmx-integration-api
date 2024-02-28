import { gql } from 'graphql-request'
import { SYNTHETICS_SUBGRAPHS } from '../../config/synthetics'
import fetchGraphQL from '../../lib/fetchGraphQL'

type PerpVolumeInfo = {
  indexToken: string
  volumeUsd: string
}

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

export async function get24HPerpetualVolume(chainId: number) {
  const endpoint = SYNTHETICS_SUBGRAPHS[chainId]
  const lastPeriodFor24Hours =
    Math.floor(Date.now() / 1000 / 3600) * 3600 - 60 * 60 * 24
  try {
    const { positionVolumeInfos } = await fetchGraphQL<{
      positionVolumeInfos: PerpVolumeInfo[]
    }>(endpoint, query, { lastTimestamp: lastPeriodFor24Hours })
    const accumulatedVolumes = positionVolumeInfos.reduce(
      (acc, { indexToken, volumeUsd }) => {
        const volume = Number(volumeUsd) / 1e30
        if (acc[indexToken]) {
          acc[indexToken] += volume
        } else {
          acc[indexToken] = volume
        }
        return acc
      },
      {} as { [key: string]: number }
    )

    return accumulatedVolumes
  } catch (e) {
    console.error(e)
    return null
  }
}
