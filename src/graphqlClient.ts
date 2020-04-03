import { ApolloClient } from 'apollo-client'
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'
import { GRAPHQL_PATH, SERVER_URL } from './constants'
import fragmentTypes from './fragmentTypes.json'
import { createUploadLink } from 'apollo-upload-client'

export const createGraphqlClient = async () => {
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
      )
    if (networkError) console.log(`[Network error]: ${networkError}`)
  })

  const httpLink = createUploadLink({
    uri: SERVER_URL + GRAPHQL_PATH,
    credentials: 'include',
  })

  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData: fragmentTypes,
  })

  return new ApolloClient({
    link: ApolloLink.from([errorLink, httpLink]),
    cache: new InMemoryCache({ fragmentMatcher }),
  })
}
