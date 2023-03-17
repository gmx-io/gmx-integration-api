import { GraphQLClient } from 'graphql-request'

function getGraphqlClient(endpoint: string) {
  return new GraphQLClient(endpoint)
}

async function fetchGraphQL<T = any>(
  url: string,
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  try {
    const client = getGraphqlClient(url)
    const data = await client.request<T>(query, variables)
    return data
  } catch (error) {
    console.error('GraphQL request failed:', error)
    throw new Error('GraphQL request failed')
  }
}

export default fetchGraphQL
