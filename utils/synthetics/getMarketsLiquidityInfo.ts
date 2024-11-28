import { getContractAddress, getSyntheticsReaderContract } from '@/config/constants'
import { getClient } from '@/lib/client'
import { getMarketsInfo } from './getMarketsInfo'
import { getContractPrices } from './getPrices'
import { AddressZero, MAX_PNL_FACTOR_FOR_TRADERS } from '@/config/synthetics'
const USD_DIVISOR = 10n ** 30n

type MarketsLiquidityInfo = {
  tokenPrice: number,
  liquidityUsd: number
}

type MarketLiquidityResult = {
  poolValue: bigint,
  longPnl: bigint,
  shortPnl: bigint,
  netPnl: bigint,
  longTokenAmount: bigint,
  shortTokenAmount: bigint,
  longTokenUsd: bigint,
  shortTokenUsd: bigint,
  totalBorrowingFees: bigint,
  impactPoolAmount: bigint
}

type MarketsLiquidityResult = {
  result: [bigint, MarketLiquidityResult]
}

export async function getMarketsLiquidity(
  chainId: number
)  : Promise <Record<string, MarketsLiquidityInfo> | undefined> {
  const datastoreContract = getContractAddress(chainId, 'DataStore')
  const client = getClient(chainId)
  const readerContract = getSyntheticsReaderContract(chainId)
  const markets = await getMarketsInfo(chainId)
  const prices = await getContractPrices(chainId)

  if (!markets || !readerContract || !datastoreContract || !prices) {
    return
  }

  const callsByMarket = markets.reduce<Record<string, any>>((acc, market) => {
    const longTokenPrice = prices[market.longToken];
    const indexTokenPrice = market.indexToken === AddressZero ? longTokenPrice : prices[market.indexToken];
    const shortTokenPrice = prices[market.shortToken];
    const marketTuple = {
      marketToken: market.marketToken,
      indexToken: market.indexToken,
      longToken: market.longToken,
      shortToken: market.shortToken
    }
    const marketCalls = [{
      ...readerContract,
      functionName: 'getMarketTokenPrice',
      args: [
        datastoreContract,
        marketTuple,
        indexTokenPrice,
        longTokenPrice,
        shortTokenPrice,
        MAX_PNL_FACTOR_FOR_TRADERS,
        true
      ]
    }]
    acc[market.marketToken] = marketCalls
    return acc
  }, {})

  const results = (await client.multicall({
    contracts: Object.values(callsByMarket).flat(),
  })) as MarketsLiquidityResult[]

  const resultsByMarket = Object.keys(callsByMarket).reduce<
    Record<string, MarketsLiquidityInfo>
  >((acc, marketToken, index) => {
    const result = results[index];
    if (result && result.result) {
      const gmPrice = (result.result[0] * BigInt(1000) / USD_DIVISOR);
      const tokenPrice = Number(Number(gmPrice) / 1000);
      const liquidityUsd = Number(result.result[1].poolValue / USD_DIVISOR);
      acc[marketToken] = {
        tokenPrice,
        liquidityUsd,
      }
    }
    return acc
  }, {})

  return resultsByMarket
}
