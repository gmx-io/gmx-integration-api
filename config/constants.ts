import { Abi, Address } from 'viem'
import DataStore from '../abis/DataStore.json'
import SyntheticsReader from '../abis/SyntheticReader.json'
export const AVALANCHE = 43114
export const ARBITRUM = 42161
export const AddressZero = '0x0000000000000000000000000000000000000000'

export const SUBGRAPHS_API_URLS: { [key: number | string]: string } = {
  [ARBITRUM]:
    'https://subgraph.satsuma-prod.com/3b2ced13c8d9/gmx/gmx-arbitrum-stats/api',
  [AVALANCHE]:
    'https://api.thegraph.com/subgraphs/name/vipineth/gmx-stats-avax',
  chainlink: 'https://api.thegraph.com/subgraphs/name/deividask/chainlink',
}

export const currentPriceUrls: { [key: number]: string } = {
  [ARBITRUM]: 'https://gmx-server-mainnet.uw.r.appspot.com/prices',
  [AVALANCHE]: 'https://gmx-avax-server.uc.r.appspot.com/prices',
}

export const CONTRACTS: {
  [key: number]: { [key: string]: string }
} = {
  [ARBITRUM]: {
    DataStore: '0xFD70de6b91282D8017aA4E741e9Ae325CAb992d8',
    SyntheticsReader: '0xf60becbba223EEA9495Da3f606753867eC10d139',
  },
  [AVALANCHE]: {
    DataStore: '0x2F0b22339414ADeD7D5F06f9D604c7fF5b2fe3f6',
    SyntheticsReader: '0x73BA021ACF4Bb6741E82690DdB821e7936050f8C',
  },
}

export const CHAINLINK_CONTRACTS: { [key: string]: string } = {
  USDC: '0x789190466e21a8b78b8027866cbbdc151542a26c',
  'USDC.e': '0x789190466e21a8b78b8027866cbbdc151542a26c',
  USDT: '0x838a42bd3b727880ef27920acb637abeff2f73d4',
  DAI: '0xdec0a100ead1faa37407f0edc76033426cf90b82',
  FRAX: '0x61eb091ea16a32ea5b880d0b3d09d518c340d750',
}

export function getDataStoreContract(chainId: number) {
  const address = CONTRACTS[chainId].DataStore
  return {
    address: address as Address,
    abi: DataStore.abi as Abi,
  } as const
}

export function getSyntheticsReaderContract(chainId: number) {
  const address = CONTRACTS[chainId].SyntheticsReader
  return {
    address: address as Address,
    abi: SyntheticsReader.abi as Abi,
  } as const
}

export function getContractAddress(chainId: number, contract: string) {
  const address = CONTRACTS[chainId][contract]
  if (!address) return

  return address
}
