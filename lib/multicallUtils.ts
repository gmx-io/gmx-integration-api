
const MULTICALL_BATCH_SIZE = 50;

export async function batchedMulticall<T>(
  client: any,
  contracts: any[],
  batchSize = MULTICALL_BATCH_SIZE
  // ,
  // delayMs = 500
): Promise<T[]> {
  function chunkArray<T>(arr: T[], size: number): T[][] {
    const res: T[][] = []
    for (let i = 0; i < arr.length; i += size) {
      res.push(arr.slice(i, i + size))
    }
    return res
  }

  const callChunks = chunkArray(contracts, batchSize)
  let results: T[] = []
  for (const chunk of callChunks) {
    try {
      const chunkResults = await client.multicall({ contracts: chunk })
      results = results.concat(chunkResults as T[])
    } catch (e) {
      results = results.concat(Array(chunk.length).fill(undefined))
    }
    // await new Promise(res => setTimeout(res, delayMs))
  }
  return results
}