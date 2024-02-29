import { Chain, createPublicClient, http } from 'viem'
import { arbitrum, avalanche } from 'viem/chains'
import { ARBITRUM, AVALANCHE } from '../config/constants'

const NETWORK_CLIENT_MAP: Record<number, Chain> = {
  [ARBITRUM]: arbitrum,
  [AVALANCHE]: avalanche,
}

export function getClient(chainId: number) {
  const network = NETWORK_CLIENT_MAP[chainId]
  return createPublicClient({
    batch: {
      multicall: true,
    },
    chain: network,
    transport: http(),
  })
}
