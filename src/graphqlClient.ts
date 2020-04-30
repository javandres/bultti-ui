import { ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client'
import { onError } from '@apollo/link-error'
import { GRAPHQL_PATH, SERVER_URL } from './constants'
import { createUploadLink } from 'apollo-upload-client'
import introspection from './possibleTypes'

export const createGraphqlClient = async () => {
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      )
    if (networkError) console.log(`[Network error]: ${networkError}`)
  })

  const httpLink = createUploadLink({
    uri: SERVER_URL + GRAPHQL_PATH,
    credentials: 'include',
  })

  const cache = new InMemoryCache({
    possibleTypes: introspection.possibleTypes,
  })

  return new ApolloClient({
    link: ApolloLink.from([errorLink, httpLink]),
    cache,
  })
}
