export function isSameStr(a: string, b: string) {
  return a.toLowerCase() === b.toLowerCase()
}

export function getFundingPerHour(
  fundingRatePerSeconds?: bigint,
  longsPayShorts?: boolean
) {
  if (!fundingRatePerSeconds) {
    return 0
  }

  const fundingPerHour = Number(
    Number(fundingRatePerSeconds * BigInt(100) * BigInt(3600)) / 1e30
  )
  if (longsPayShorts) {
    return fundingPerHour
  }
  return fundingPerHour * -1
}
