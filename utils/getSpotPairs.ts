import { getSwapPairs, getTokenBySymbol } from '../config/tokens'
import { getTokenPrice } from './prices'
import { getLast24hSwapVolume } from './spotVolume'
import { Pair } from './types'

async function getPairMetadata(
  chainId: number,
  tokenA: string,
  tokenB: string
) {
  const tokenAInfo = getTokenBySymbol(chainId, tokenA)
  const tokenBInfo = getTokenBySymbol(chainId, tokenB)
  const volume = await getLast24hSwapVolume(
    chainId,
    tokenAInfo.address,
    tokenBInfo.address
  )
  const tokenAPrice = await getTokenPrice(chainId, tokenAInfo.address)
  const tokenBPrice = await getTokenPrice(chainId, tokenAInfo.address)

  return {
    ticker_id: tokenA + '_' + tokenB,
    base_currency: tokenA,
    target_currency: tokenB,
    product_type: 'Spot',
    last_price: tokenAPrice.lastPrice,
    low: tokenAPrice.low,
    high: tokenAPrice.high,
    base_volume: volume / (tokenAPrice.low + tokenAPrice.low) / 2,
    target_volume: volume / (tokenBPrice.low + tokenBPrice.low) / 2,
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
