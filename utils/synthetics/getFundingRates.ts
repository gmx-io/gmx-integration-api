import {
  getContractAddress,
  getSyntheticsReaderContract,
} from '@/config/constants'
import { getClient } from '@/lib/client'
import { getPerpetualMarkets } from './getPerpetualMarkets'
import { ContractFunctionParameters } from 'viem'
import { getContractPrices } from './getPrices'

type FundingRates = {
  [key: string]: {
    longsPayShorts: boolean
    fundingFactorPerSecond: bigint,
    nextSavedFundingFactorPerSecond: bigint
  }
}

type MarketResult = {
  market: {
    marketToken: string
    indexToken: string
    longToken: string
    shortToken: string
  }
  nextFunding: {
    longsPayShorts: boolean
    fundingFactorPerSecond: bigint,
    nextSavedFundingFactorPerSecond: bigint
  }
}

type MarketsResult = {
  result: MarketResult
}

export async function getFundingRates(chainId: number) {
  const dataStoreAddress = getContractAddress(chainId, 'DataStore')
  const client = getClient(chainId)
  const contract = getSyntheticsReaderContract(chainId)
  const markets = await getPerpetualMarkets(chainId)
  const prices = await getContractPrices(chainId)

  if (!markets || !prices) return null

  const calls: ContractFunctionParameters[] = markets.map((market) => {
    const tokensPrices = {
      indexTokenPrice: prices[market.indexToken],
      longTokenPrice: prices[market.longToken],
      shortTokenPrice: prices[market.shortToken],
    }
    return {
      ...contract,
      functionName: 'getMarketInfo',
      args: [dataStoreAddress, tokensPrices, market.marketToken],
    }
  })

  const results = (await client.multicall({
    contracts: calls,
  })) as MarketsResult[]

  return results.reduce<FundingRates>(
    (acc, { result }: { result: MarketResult }) => {
      if (result) {
        acc[result.market.marketToken?.toLowerCase()] = {
          longsPayShorts: result.nextFunding.longsPayShorts,
          fundingFactorPerSecond: result.nextFunding.fundingFactorPerSecond,
          nextSavedFundingFactorPerSecond: result.nextFunding.nextSavedFundingFactorPerSecond,
        }
      }
      return acc
    },
    {}
  )
}
