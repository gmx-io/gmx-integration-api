import { NextApiRequest, NextApiResponse } from 'next'
import { AVALANCHE } from '../../../config/constants'
import getPerpetualPairs from '../../../utils/getPerpetualPairs'
import getSpotPairs from '../../../utils/getSpotPairs'

async function handleRequest(req: NextApiRequest, res: NextApiResponse) {
  const currentNetwork = AVALANCHE
  try {
    const [perpetualPairs, spotPairs] = await Promise.all([
      getPerpetualPairs(currentNetwork),
      getSpotPairs(currentNetwork)
    ])

    res.status(200).json(perpetualPairs.concat(spotPairs))
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
