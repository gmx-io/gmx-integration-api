import {
  encodeAbiParameters,
  keccak256,
  parseAbiParameters,
  toBytes,
} from 'viem'

export function hashData(dataTypes: string[], dataValues: any[]) {
  const bytes = encodeAbiParameters(
    parseAbiParameters(dataTypes.join(', ')),
    dataValues
  )

  const hash = keccak256(toBytes(bytes))

  return hash
}

export function hashString(string: string) {
  return hashData(['string'], [string])
}
