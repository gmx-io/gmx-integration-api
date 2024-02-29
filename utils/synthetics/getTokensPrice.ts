import { ORACLE_KEEPER_URLS } from '@/config/synthetics'
import { fetchUrl } from '@/lib/fetchUrl'

type PriceInfo = {
  tokenSymbol: string
  high: number
  low: number
  open: number
  close: number
}

export async function getTokensPrice(chainId: number): Promise<PriceInfo[]> {
  const baseUrl = ORACLE_KEEPER_URLS[chainId]
  const dailyPriceUrl = `${baseUrl}/prices/24h`
  const pricesData: PriceInfo[] = await fetchUrl(dailyPriceUrl)
  return pricesData
}
