import { gql } from 'graphql-request'
import { SYNTHETICS_SUBGRAPHS, Token, getToken } from '../../config/synthetics'
import fetchGraphQL from '../../lib/fetchGraphQL'
import { getSwapMarkets } from './getSwapMarkets'

const query = gql`
  query Swap24HVolume($lastTimestamp: Int!) {
    swapVolumeInfos(
      orderBy: timestamp
      orderDirection: desc
      where: { period: "1h", timestamp_gte: $lastTimestamp }
      first: 10000
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
  period: '1h'
}

export async function get24HSwapVolume(chainId: number) {
  const endpoint = SYNTHETICS_SUBGRAPHS[chainId]
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
        const volume = Number(volumeUsd) / 1e30
        if (acc[key]) {
          acc[key] += volume
        } else {
          acc[key] = volume
        }
        return acc
      },
      {} as { [key: string]: number }
    )

    const combinedVolumes = swapPairs?.reduce(
      (acc, { pairAddress, token0, token1 }) => {
        const key = `${token0}-${token1}`
        const reverseKey = `${token1}-${token0}`
        const volume =
          accumulatedVolumes[key] || accumulatedVolumes[reverseKey] || 0
        acc[pairAddress] = (acc[pairAddress] || 0) + volume
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
