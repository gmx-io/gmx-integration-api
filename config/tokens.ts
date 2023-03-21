import { AddressZero, ARBITRUM, AVALANCHE } from './constants'
type Token = {
  name: string
  symbol: string
  decimals: number
  address: string
  isNative?: boolean
  isWrapped?: boolean
  baseSymbol?: string
  isStable?: boolean
  isShortable?: boolean
  isTempHidden?: boolean
}
export const TOKENS: { [key: number]: Token[] } = {
  [ARBITRUM]: [
    {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      isNative: true,
      isShortable: true,
    },
    {
      name: 'Wrapped Ethereum',
      symbol: 'WETH',
      decimals: 18,
      address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      isWrapped: true,
      baseSymbol: 'ETH',
    },
    {
      name: 'Bitcoin (WBTC)',
      symbol: 'BTC',
      decimals: 8,
      address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
      isShortable: true,
    },
    {
      name: 'Chainlink',
      symbol: 'LINK',
      decimals: 18,
      address: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4',
      isStable: false,
      isShortable: true,
    },
    {
      name: 'Uniswap',
      symbol: 'UNI',
      decimals: 18,
      address: '0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0',
      isStable: false,
      isShortable: true,
    },
    {
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
      isStable: true,
    },
    {
      name: 'Tether',
      symbol: 'USDT',
      decimals: 6,
      address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      isStable: true,
    },
    {
      name: 'Dai',
      symbol: 'DAI',
      decimals: 18,
      address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
      isStable: true,
    },
    {
      name: 'Frax',
      symbol: 'FRAX',
      decimals: 18,
      address: '0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F',
      isStable: true,
    },
    {
      name: 'Magic Internet Money',
      symbol: 'MIM',
      decimals: 18,
      address: '0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A',
      isStable: true,
      isTempHidden: true,
    },
  ],
  [AVALANCHE]: [
    {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18,
      address: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
      isNative: true,
      isShortable: true,
    },
    {
      name: 'Wrapped AVAX',
      symbol: 'WAVAX',
      decimals: 18,
      address: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
      isWrapped: true,
      baseSymbol: 'AVAX',
    },
    {
      name: 'Ethereum (WETH.e)',
      symbol: 'ETH',
      address: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB',
      decimals: 18,
      isShortable: true,
    },
    {
      name: 'Bitcoin (BTC.b)',
      symbol: 'BTC',
      address: '0x152b9d0FdC40C096757F570A51E494bd4b943E50',
      decimals: 8,
      isShortable: true,
    },
    {
      name: 'Bitcoin (WBTC.e)',
      symbol: 'WBTC',
      address: '0x50b7545627a5162F82A992c33b87aDc75187B218',
      decimals: 8,
      isShortable: true,
    },
    {
      name: 'USD Coin',
      symbol: 'USDC',
      address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
      decimals: 6,
      isStable: true,
    },
    {
      name: 'USD Coin (USDC.e)',
      symbol: 'USDC.e',
      address: '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664',
      decimals: 6,
      isStable: true,
    },
    {
      name: 'Magic Internet Money',
      symbol: 'MIM',
      address: '0x130966628846BFd36ff31a822705796e8cb8C18D',
      decimals: 18,
      isStable: true,
      isTempHidden: true,
    },
  ],
}

export function getPerpTokens(chainId: number) {
  return TOKENS[chainId].filter((token) => !token.isStable && !token.isWrapped)
}

export function getTokenBySymbol(chainId: number, symbol: string) {
  const token = TOKENS[chainId].find((token) => token.symbol === symbol)
  if (!token) {
    throw new Error(`Incorrect symbol "${symbol}" for chainId ${chainId}`)
  }
  return token
}

export function getTokenByAddress(chainId: number, address: string) {
  const token = TOKENS[chainId].find((token) => token.address === address)
  if (!token) {
    throw new Error(`Incorrect address "${address}" for chainId ${chainId}`)
  }
  return token
}

export function getSwapPairs(chainId: number) {
  const tokens = TOKENS[chainId].filter(
    (token) => !token.isNative && !token.isTempHidden
  )

  const uniquePairs = []
  for (let i = 0; i < tokens.length; i++) {
    for (let j = i + 1; j < tokens.length; j++) {
      uniquePairs.push([tokens[i].symbol, tokens[j].symbol])
    }
  }
  return uniquePairs
}

export function getNormalizedTokenSymbol(tokenSymbol: string) {
  if (['WBTC', 'WETH', 'WAVAX'].includes(tokenSymbol)) {
    return tokenSymbol.substr(1)
  } else if (tokenSymbol === 'BTC.b') {
    return 'BTC'
  }
  return tokenSymbol
}
