import { ORACLE_KEEPER_URLS, Token } from '@/config/synthetics'
import { fetchUrl } from '@/lib/fetchUrl'
import { isSameStr } from '@/lib/index'

type PriceInfo = {
  tokenSymbol: string
  high: number
  low: number
  open: number
  close: number
}

// export function getStableTokenPrice(tokenSymbol: string) {
//   return {
//     tokenSymbol,
//     high: 1,
//     low: 1,
//     open: 1,
//     close: 1,
//   }
// }

export async function getTokensPrice(chainId: number): Promise<PriceInfo[]> {
  const baseUrl = ORACLE_KEEPER_URLS[chainId]
  const dailyPriceUrl = `${baseUrl}/prices/24h`
  const pricesData: PriceInfo[] = await fetchUrl(dailyPriceUrl)
  return pricesData
}

export function getTokenPrice(prices: PriceInfo[], token: Token) {
  return prices.find((price) =>
    isSameStr(price.tokenSymbol, token.baseSymbol ?? token.symbol)
  )
}
