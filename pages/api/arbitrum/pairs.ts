import { NextApiRequest, NextApiResponse } from 'next'
import { ARBITRUM, pricesUrls } from '../../../config/constants'
import getPerpetualPairs from '../../../utils/getPerpetualPairs'
import getSpotPairs from '../../../utils/getSpotPairs'
import { getLast24hTotalVolume } from '../../../utils/totalVolumeTest'

async function handleRequest(req: NextApiRequest, res: NextApiResponse) {
  const currentNetwork = ARBITRUM
  try {
    const perpetualPairsInfo = await getPerpetualPairs(currentNetwork)
    const pairs = await getSpotPairs(currentNetwork)
    const totalVolumes = await getLast24hTotalVolume(currentNetwork)
    const totalSpotVolume = pairs.reduce(
      (acc, pair) => acc + pair.base_volume,
      0
    )
    const totalMarginVolume = perpetualPairsInfo.reduce(
      (acc, pair) => acc + pair.target_volume,
      0
    )
    const prices = await fetch(pricesUrls[ARBITRUM]).then((res) => res.json())

    res.status(200).json({
      perpetualPairsInfo,
      pairs,
      totalSpotVolume,
      totalMarginVolume,
      verifyVolumes: { ...totalVolumes },
      prices,
    })
  } catch (error) {
    console.error('GraphQL request failed:', error)
    res.status(500).json({ error: 'An error occurred while fetching data' })
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    await handleRequest(req, res)
  } else {
    res.status(405).end('Method not allowed')
  }
}
