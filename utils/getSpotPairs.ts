import { Pair } from '@/lib/types'
import { getSwapPairs, getTokenBySymbol } from '../config/tokens'
import { getTokenPrice } from './prices'
import { getLast24hSwapVolume } from './spotVolume'

async function getPairMetadata(
  chainId: number,
  tokenA: string,
  tokenB: string
) {
  const tokenAInfo = getTokenBySymbol(chainId, tokenA)
  const tokenBInfo = getTokenBySymbol(chainId, tokenB)
  
  const [volume, tokenAPrice, tokenBPrice] = await Promise.all([
    getLast24hSwapVolume(chainId, tokenAInfo.address, tokenBInfo.address),
    getTokenPrice(chainId, tokenAInfo.address),
    getTokenPrice(chainId, tokenBInfo.address)

  ])
  
  const lastPrice =
    (tokenAPrice.lastPrice &&
      tokenBPrice.lastPrice &&
      tokenAPrice.lastPrice / tokenBPrice.lastPrice) ??
    0

  return {
    ticker_id: tokenA + '_' + tokenB,
    base_currency: tokenA,
    target_currency: tokenB,
    product_type: 'Spot',
    last_price: lastPrice,
    low: tokenAPrice.low,
    high: tokenAPrice.high,
    base_volume: volume / ((tokenAPrice.high + tokenAPrice.low) / 2),
    target_volume: volume / ((tokenBPrice.high + tokenBPrice.low) / 2),
    volume_usd: volume,
  }
}

export default async function getSpotPairs(chainId: number): Promise<Pair[]> {
  const pairs = getSwapPairs(chainId)
  return Promise.all(
    pairs.map(async (pair) => {
      const [tokenA, tokenB] = pair
      return await getPairMetadata(chainId, tokenA, tokenB)
    })
  )
}
