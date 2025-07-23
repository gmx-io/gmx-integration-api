import { Chain, PublicClient, createPublicClient, http } from 'viem'
import { arbitrum, avalanche } from 'viem/chains'
import { ARBITRUM, AVALANCHE, BOTANIX } from '../config/constants'

const ARBITRUM_RPC_URL = process.env.ARBITRUM_RPC_URL || "https://arbitrum-one-rpc.publicnode.com"
const AVALANCHE_RPC_URL = process.env.AVALANCHE_RPC_URL || avalanche.rpcUrls.default.http[0]

const NETWORK_CLIENT_MAP: Record<number, Chain> = {
  [ARBITRUM]: {
    ...arbitrum,
    rpcUrls: {
      ...arbitrum.rpcUrls,
      default: {http: [ARBITRUM_RPC_URL]}
    }
  },
  [AVALANCHE]: { 
    ...avalanche,
    rpcUrls: {
      ...avalanche.rpcUrls,
      default: {http: [AVALANCHE_RPC_URL]}
    }
  },
  [BOTANIX]: {
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 516999
      }
    },
    id: 3_637,
    name: 'Botanix',
    nativeCurrency: {name: 'Bitcoin', symbol:'nBTC', decimals: 9},
    rpcUrls: {
      default: {http: ['https://rpc.botanixlabs.com']}
    }
  },
}

export function getClient(chainId: number) : PublicClient {
  const network = NETWORK_CLIENT_MAP[chainId]
  return createPublicClient({
    batch: {
      multicall: true,
    },
    chain: network,
    transport: http(),
  })
}
