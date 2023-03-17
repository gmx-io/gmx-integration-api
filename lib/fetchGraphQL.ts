import { request } from 'graphql-request'

async function fetchGraphQL<T = any>(
  endpoint: string,
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  try {
    const data = await request<T>(endpoint, query, variables)
    return data
  } catch (error) {
    console.error('GraphQL request failed:', error)
    throw new Error('GraphQL request failed')
  }
}

export default fetchGraphQL
