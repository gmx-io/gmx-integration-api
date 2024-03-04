import { ARBITRUM } from '@/config/constants'
import { getPerpetualPairsInfo } from '@/utils/synthetics/getPerpetualPairsInfo'
import { getSwapPairsInfo } from '@/utils/synthetics/getSwapPairsInfo'
import { NextApiRequest, NextApiResponse } from 'next'

async function handleRequest(_req: NextApiRequest, res: NextApiResponse) {
  const currentNetwork = ARBITRUM
  try {
    const perpetualPairs = await getPerpetualPairsInfo(currentNetwork)
    const spotPairs = await getSwapPairsInfo(currentNetwork)

    res.status(200).json(perpetualPairs?.concat(spotPairs ?? []))
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
