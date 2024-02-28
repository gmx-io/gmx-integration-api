import { get24HSwapVolume } from './get24HSwapVolume'
import { getSwapMarkets } from './getSwapMarkets'

export async function getSwapMetadata(chainId: number) {
  const swapPairs = await getSwapMarkets(chainId)
  const pairSwapVolume = await get24HSwapVolume(chainId)

  return swapPairs?.map((pair) => {
    const volume = pairSwapVolume?.[pair.pairAddress.toLowerCase()] ?? 0
    return {
      pairName: pair.pairName,
      volume,
    }
  })
}
