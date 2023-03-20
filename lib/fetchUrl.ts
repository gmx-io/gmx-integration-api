export async function fetchUrl(
  url: string,
  options: RequestInit = {}
): Promise<any> {
  try {
    const response = await fetch(url, options)
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error fetching ${url}: ${error.message}`)
      throw error
    }
    throw new Error(`Unknown error: ${error}`)
  }
}
