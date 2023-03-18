import { NextApiRequest, NextApiResponse } from 'next'
import { AVALANCHE } from '../../../config/constants'
import getPairs from '../../../utils/getPairs'

async function handleRequest(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = await getPairs(AVALANCHE)
    res.status(200).json(data)
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
