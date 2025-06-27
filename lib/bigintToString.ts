// Recursive function for big int conversions to string for JSON serialisation.
export function bigintToString(obj: any): any {
  if (typeof obj === 'bigint') return obj.toString()

  if (Array.isArray(obj)) return obj.map(bigintToString)

  if (obj !== null && typeof obj === 'object' && Object.getPrototypeOf(obj) === Object.prototype) {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, bigintToString(v)])
    )
  }

  return obj
}