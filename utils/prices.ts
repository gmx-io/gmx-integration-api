import { gql } from 'graphql-request'
import { currentPriceUrls } from '../config/constants'
import { getNormalizedTokenSymbol, getTokenByAddress } from '../config/tokens'
import { fetchUrl } from '../lib/fetchUrl'

const currentPriceQuery = gql`
  query CurrentTokenPrice($id: ID!) {
    fastPrice(id: $id, period: "last") {
      value
      token
      period
    }
  }
`

const priceHistoryQuery = gql`
  query TokenPrices($id: ID!) {
    fastPrices(
      where: { period: "hourly", token: $id }
      first: 24
      orderBy: timestamp
      orderDirection: desc
    ) {
      token
      value
      timestamp
      period
      id
    }
  }
`

async function getHighAndLowPriceOfToken(
  chainId: number,
  tokenAddress: string
) {
  const token = getTokenByAddress(chainId, tokenAddress)
  const symbol = getNormalizedTokenSymbol(token.symbol)
  let data
  try {
    data = await fetchUrl(
      `https://stats.gmx.io/api/candles/${symbol}?preferableChainId=${chainId}&period=1h&limit=24`
    )
  } catch (error) {
    data = []
  }

  return {
    max: Math.max(...data.prices.map((bar: { h: number }) => bar.h)),
    min: Math.min(...data.prices.map((bar: { l: number }) => bar.l)),
    lastUpdated: data.updatedAt,
  }
}

async function getCurrentPriceOfToken(chainId: number, tokenAddress: string) {
  try {
    const endpoint = currentPriceUrls[chainId]
    const currentPrices = await fetchUrl(endpoint)

    if (!currentPrices) {
      return undefined
    }

    const currentPricesLowerCase = Object.keys(currentPrices)
      .filter(Boolean)
      .reduce<{ [key: string]: number }>((acc, address: string) => {
        acc[address.toLowerCase()] = currentPrices[address]
        return acc
      }, {})

    return currentPricesLowerCase[tokenAddress.toLowerCase()] / 1e30
  } catch (e) {
    console.error(e)
    return undefined
  }
}

export async function getTokenPrice(chainId: number, tokenAddress: string) {
  const token = getTokenByAddress(chainId, tokenAddress)
  // if (token.isStable) {
  //   return {
  //     lastPrice: 1,
  //     high: 1,
  //     low: 1,
  //   }
  // }
  try {
    const lastPrice = await getCurrentPriceOfToken(chainId, tokenAddress)
    const { max, min } = await getHighAndLowPriceOfToken(chainId, tokenAddress)
    return {
      lastPrice,
      high: max,
      low: min,
    }
  } catch (e) {
    console.error(e)
    return { lastPrice: 0, high: 0, low: 0 }
  }
}
