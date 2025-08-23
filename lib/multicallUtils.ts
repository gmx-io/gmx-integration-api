import type { Abi, PublicClient } from 'viem'

const MULTICALL_BATCH_SIZE = 50;
const DELAY_TIME_MS = 500

export type MulticallResult = {
  result?: unknown;
  status?: string;
  error?: string;
};

export type MulticallContractCall = {
  address: `0x${string}`,
  abi: Abi,
  functionName: string,
  args?: readonly unknown[]
}

export async function batchedMulticall<MulticallResult>(
  client: PublicClient,
  contracts: MulticallContractCall[],
  batchSize = MULTICALL_BATCH_SIZE,
  delayMs = DELAY_TIME_MS
): Promise<(MulticallResult | undefined)[]> {
  function chunkArray<T>(arr: MulticallContractCall[], size: number): MulticallContractCall[][] {
    const res: MulticallContractCall[][] = []
    for (let i = 0; i < arr.length; i += size) {
      res.push(arr.slice(i, i + size))
    }
    return res
  }

  const callChunks = chunkArray(contracts, batchSize)
  let results: (MulticallResult | undefined)[] = []
  for (const chunk of callChunks) {
    try {
      const chunkResults = await client.multicall({ contracts: chunk })
      results = results.concat(chunkResults as MulticallResult[])
    } catch (e) {
      results = results.concat(Array(chunk.length).fill(undefined))
    }
    await new Promise(res => setTimeout(res, delayMs))
  }
  return results
}