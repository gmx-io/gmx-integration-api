import { ORACLE_KEEPER_URLS } from '../../config/synthetics'
import { fetchUrl } from '../../lib/fetchUrl'

type PriceInfo = {
  tokenSymbol: string
  high: number
  low: number
  open: number
  close: number
}

export async function getTokensPrice(chainId: number): Promise<PriceInfo[]> {
  const url = ORACLE_KEEPER_URLS[chainId]
  const price24hUrl = `${url}/prices/24h`
  const data = await fetchUrl(price24hUrl)
  return data
}
