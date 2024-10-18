import { getFundingPerHour, isSameStr } from '@/lib/index'
import { getPerpVolumes } from './getPerpVolumes'
import { getMarketsOpenInterest } from './getMarketsOpenInterest'
import { getPerpetualMarkets } from './getPerpetualMarkets'
import { getTokensPrice } from './getPrices'
import { Pair } from '@/lib/types'
import { getFundingRates } from './getFundingRates'
import { getMarketsLiquidity } from './getMarketsLiquidityInfo'

export async function getPerpetualPairsInfo(
  chainId: number
): Promise<Pair[] | null> {
  const [perpMarkets, prices, volumeInfo, openInterestByMarket, fundingRates, liquidityInfo] = await Promise.all([
    getPerpetualMarkets(chainId),
    getTokensPrice(chainId),
    getPerpVolumes(chainId),
    getMarketsOpenInterest(chainId),
    getFundingRates(chainId),
    getMarketsLiquidity(chainId)
  ])

  if (!perpMarkets || !prices || !volumeInfo || !openInterestByMarket || !liquidityInfo)
    return null

  return perpMarkets
    .map((market) => {
      const { indexTokenInfo, indexToken, marketToken } = market
      const openInterest = openInterestByMarket[marketToken]
      const fundingRate = fundingRates?.[marketToken]
      const fundingPerHour = getFundingPerHour(
        fundingRate?.fundingFactorPerSecond,
        fundingRate?.longsPayShorts
      )
      const nextFundingPerHour =  getFundingPerHour(
        fundingRate?.nextSavedFundingFactorPerSecond,
        fundingRate?.longsPayShorts
      )
      const nextFundingRateTimestamp = Math.floor(Date.now() / 1000 / 3600) * 3600 + 3600
      const tokenSymbol = indexTokenInfo.baseSymbol ?? indexTokenInfo.symbol
      const priceInfo = prices.find((price) =>
        isSameStr(price.tokenSymbol, tokenSymbol)
      )
      const volumeUsd = volumeInfo[indexToken]
      const gmLiquidityInfo = liquidityInfo[marketToken]
      const longTokenSymbol = market.longTokenInfo.symbol;
      const shortTokenSymbol = market.shortTokenInfo.symbol;
      const collateralSymbols = `${longTokenSymbol}${longTokenSymbol !== shortTokenSymbol ? `-${shortTokenSymbol}`: ''}`;
      return {
        ticker_id: `${tokenSymbol}/USD [${collateralSymbols}]`,
        base_currency: tokenSymbol,
        target_currency: 'USD',
        product_type: 'Perpetual',
        last_price: priceInfo?.close ?? 0,
        high: priceInfo?.high ?? 0,
        low: priceInfo?.low ?? 0,
        base_volume: volumeUsd / (priceInfo?.close ?? 1),
        target_volume: volumeUsd,
        pool_id: marketToken,
        liquidity_in_usd: gmLiquidityInfo.liquidityUsd,
        open_interest: openInterest.openInterestUsd,
        long_open_interest: openInterest.longInterestUsd,
        short_open_interest: openInterest.shortInterestUsd,
        start_timestamp: 0,
        end_timestamp: Math.floor(Date.now() / 1000),
        funding_rate: fundingPerHour,
        next_funding_rate: nextFundingPerHour,
        next_funding_rate_timestamp: nextFundingRateTimestamp
      }
    })
    .filter(Boolean)
}
