import { gql } from 'graphql-request'
import { SQUID_SYNTHETICS_SUBGRAPHS } from '../../config/synthetics'
import fetchGraphQL from '../../lib/fetchGraphQL'
import { getSwapMarkets } from './getSwapMarkets'

const query = gql`
  query Swap24HVolume($lastTimestamp: Int!) {
    swapVolumeInfos(
      orderBy: timestamp_DESC
      where: { period_eq: "1d", timestamp_gte: $lastTimestamp }
      limit: 1000
    ) {
      tokenIn
      tokenOut
      volumeUsd
    }
  }
`
type SwapVolumeInfo = {
  tokenIn: string
  tokenOut: string
  volumeUsd: string
  timestamp: number
  period: '1d'
}

export async function get24HSwapVolume(chainId: number) {
  const endpoint = SQUID_SYNTHETICS_SUBGRAPHS[chainId]
  const lastPeriodFor24Hours =
    Math.floor(Date.now() / 1000 / 3600) * 3600 - 60 * 60 * 24
  try {
    const { swapVolumeInfos } = await fetchGraphQL<{
      swapVolumeInfos: SwapVolumeInfo[]
    }>(endpoint, query, { lastTimestamp: lastPeriodFor24Hours })

    const swapPairs = await getSwapMarkets(chainId)
    const accumulatedVolumes = swapVolumeInfos.reduce(
      (acc, { tokenIn, tokenOut, volumeUsd }) => {
        const key = `${tokenIn}-${tokenOut}`
        const volume = BigInt(volumeUsd)
        if (acc[key]) {
          acc[key] += volume
        } else {
          acc[key] = volume
        }
        return acc
      },
      {} as { [key: string]: bigint }
    )

    const combinedVolumes = swapPairs?.reduce(
      (acc, { longToken, shortToken }) => {
        const key = `${longToken}-${shortToken}`
        const reverseKey = `${shortToken}-${longToken}`

        const volume =
          accumulatedVolumes[key] || accumulatedVolumes[reverseKey] || 0

        acc[key] = (acc[key] || 0) + Number(volume) / 1e30
        return acc
      },
      {} as { [pairAddress: string]: number }
    )
    return combinedVolumes
  } catch (e) {
    console.error(e)
    return null
  }
}
