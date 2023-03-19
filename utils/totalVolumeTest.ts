import { gql } from 'graphql-request'
import { ARBITRUM, SUBGRAPHS_API_URLS } from '../config/constants'
import fetchGraphQL from '../lib/fetchGraphQL'

const query = gql`
  query Last24hTotalVolume($orderBy: String!) {
    volumeStats(
      orderBy: $orderBy
      orderDirection: desc
      first: 24
      where: { period: hourly }
    ) {
      swap
      margin
      liquidation
      id
      burn
      mint
      period
    }
  }
`

export async function getLast24hTotalVolume(chainId: number) {
  const endpoint = SUBGRAPHS_API_URLS[chainId]
  try {
    const last24hVolume = await fetchGraphQL(endpoint, query, {
      orderBy: chainId === ARBITRUM ? 'id' : 'timestamp',
    })
    return last24hVolume.volumeStats.reduce(
      (acc: any, cv: any) => {
        return {
          swap: acc.swap + cv.swap / 1e30,
          margin: acc.margin + cv.margin / 1e30,
          liquidation: acc.liquidation + cv.liquidation / 1e30,
          burn: acc.burn + cv.burn / 1e30,
          mint: acc.mint + cv.mint / 1e30,
          totalMargin:
            acc.totalMargin + cv.margin / 1e30 + cv.liquidation / 1e30,
        }
      },
      {
        swap: 0,
        margin: 0,
        liquidation: 0,
        burn: 0,
        mint: 0,
        totalMargin: 0,
      }
    )
  } catch (e) {
    console.error(e)
    return 0
  }
}
