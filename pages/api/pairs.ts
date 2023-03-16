import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  response.status(200).json({
    hello: 'world',
  })
}
