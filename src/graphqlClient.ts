import {
  ApolloClient,
  ApolloLink,
  defaultDataIdFromObject,
  InMemoryCache,
} from '@apollo/client'
import { onError } from '@apollo/link-error'
import { setContext } from '@apollo/link-context'
import { GRAPHQL_PATH, SERVER_URL } from './constants'
import { createUploadLink } from 'apollo-upload-client'
import introspection from './possibleTypes'
import { getAuthToken } from './util/authToken'

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

  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = getAuthToken()
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    }
  })

  const httpLink = createUploadLink({
    uri: SERVER_URL + GRAPHQL_PATH,
    credentials: 'include',
  })

  const cache = new InMemoryCache({
    addTypename: true,
    dataIdFromObject: (obj) => {
      let typename = obj?.__typename

      if ('id' in obj) {
        return obj?.id + '' + typename
      }

      if ('registryNr' in obj) {
        return obj.registryNr + '' + typename
      }

      return defaultDataIdFromObject(obj)
    },
    possibleTypes: introspection.possibleTypes,
  })

  return new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, httpLink]),
    cache,
  })
}
