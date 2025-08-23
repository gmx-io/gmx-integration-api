import { getDataStoreContract } from '@/config/constants'
import { getClient } from '@/lib/client'
import { getMarketsInfo } from './getMarketsInfo'
import { openInterestKey } from '@/lib/getKeys'

const USD_DIVISOR = 10n ** 30n

type MarketInterestInfo = {
  longInterestUsd: number
  shortInterestUsd: number
  openInterestUsd: number
}

export async function getMarketsOpenInterest(
  chainId: number
): Promise<Record<string, MarketInterestInfo> | undefined> {
  const client = getClient(chainId)
  const contract = getDataStoreContract(chainId)
  const markets = await getMarketsInfo(chainId)

  if (!markets || !contract) {
    return
  }

  const callsByMarket = markets.reduce<Record<string, any[]>>((acc, market) => {
    const marketCalls = [true, false].flatMap((isLong) => [
      {
        ...contract,
        functionName: 'getUint',
        args: [openInterestKey(market.marketToken, market.longToken, isLong)],
      },
      {
        ...contract,
        functionName: 'getUint',
        args: [openInterestKey(market.marketToken, market.shortToken, isLong)],
      },
    ])

    acc[market.marketToken] = marketCalls
    return acc
  }, {})

  const results = (await client.multicall({
    contracts: Object.values(callsByMarket).flat(),
  })) as { result: bigint; status: string; error?: string }[]

  const resultsByMarket = Object.keys(callsByMarket).reduce<
    Record<string, MarketInterestInfo>
  >((acc, marketToken, index) => {
    const baseIndex = index * 4
    const marketResults = results.slice(baseIndex, baseIndex + 4)
    const [
      longLongInterest,
      longShortInterest,
      shortLongInterest,
      shortShortInterest,
    ] = marketResults.map((result) => Number(result.result / USD_DIVISOR))

    const longInterestUsd = longLongInterest + longShortInterest
    const shortInterestUsd = shortLongInterest + shortShortInterest
    const openInterestUsd = longInterestUsd + shortInterestUsd

    acc[marketToken] = {
      longInterestUsd,
      shortInterestUsd,
      openInterestUsd,
    }

    return acc
  }, {})

  return resultsByMarket
}
