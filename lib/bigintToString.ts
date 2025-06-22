// Recursive function for big int conversions to string for JSON serialisation.
export function bigintToString(obj: any): any {
  if (typeof obj === 'bigint') return obj.toString()

  if (Array.isArray(obj)) return obj.map(bigintToString)

  if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, bigintToString(v)])
    )
  }

  return obj
}