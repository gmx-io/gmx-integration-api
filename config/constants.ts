import { Abi, Address } from 'viem'
import DataStore from '../abis/DataStore.json'
import SyntheticsReader from '../abis/SyntheticReader.json'
export const AVALANCHE = 43114
export const ARBITRUM = 42161
export const BOTANIX = 3637
export const AddressZero = '0x0000000000000000000000000000000000000000'

export const SUBGRAPHS_API_URLS: { [key: number | string]: string } = {
  [ARBITRUM]:
    'https://subgraph.satsuma-prod.com/9d997f2f923e/gmx/gmx-arbitrum-stats/api',
  [AVALANCHE]:
    'https://subgraph.satsuma-prod.com/9d997f2f923e/gmx/gmx-avalanche-stats/api',
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
    SyntheticsReader: '0x470fbC46bcC0f16532691Df360A07d8Bf5ee0789',
  },
  [AVALANCHE]: {
    DataStore: '0x2F0b22339414ADeD7D5F06f9D604c7fF5b2fe3f6',
    SyntheticsReader: '0x62Cb8740E6986B29dC671B2EB596676f60590A5B',
  },
  [BOTANIX]: {
    DataStore: '0xA23B81a89Ab9D7D89fF8fc1b5d8508fB75Cc094d',
    SyntheticsReader: '0x922766ca6234cD49A483b5ee8D86cA3590D0Fb0E',
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
