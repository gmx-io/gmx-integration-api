import { hashData, hashString } from './hash'

export const OPEN_INTEREST_KEY = hashString('OPEN_INTEREST')

export function openInterestKey(
  market: string,
  collateralToken: string,
  isLong: boolean
) {
  return hashData(
    ['bytes32', 'address', 'address', 'bool'],
    [OPEN_INTEREST_KEY, market, collateralToken, isLong]
  )
}
