import {
  ApolloClient,
  ApolloLink,
  defaultDataIdFromObject,
  InMemoryCache,
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { setContext } from '@apollo/client/link/context'
import { GRAPHQL_PATH, SERVER_URL } from './constants'
import { createUploadLink } from 'apollo-upload-client'
import introspection from './possibleTypes'
import { getAuthToken } from './util/authToken'

export const createGraphqlClient = (onAuthError: () => unknown = () => {}) => {
  const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
    let authenticationError = false

    if (graphQLErrors) {
      graphQLErrors.forEach((err) => {
        let { message, extensions } = err
        let code = extensions?.code || 'Server'

        if (code === 'UNAUTHENTICATED') {
          authenticationError = true
        }

        console.log(`[${code} error]: ${message}`)
      })
    }

    if (operation.getContext()?.response?.status === 401) {
      authenticationError = true
    }

    if (authenticationError) {
      onAuthError()
    }
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
    typePolicies: {
      Query: {
        fields: {
          availableDayTypes: {
            merge(existing, incoming) {
              return incoming
            },
          },
        },
      },
      Inspection: {
        fields: {
          inspectionErrors: {
            merge(existing, incoming) {
              return incoming
            },
          },
        },
      },
      EquipmentCatalogue: {
        fields: {
          equipmentCatalogues: {
            merge(existing, incoming) {
              return incoming
            },
          },
        },
      },
    },
    dataIdFromObject: (obj, context) => {
      let typename = obj?.__typename

      if ('id' in obj) {
        return obj?.id + '' + typename
      }

      if ('registryNr' in obj) {
        return obj.registryNr + '' + typename
      }

      return defaultDataIdFromObject(obj, context)
    },
    possibleTypes: introspection.possibleTypes,
  })

  return new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, httpLink]),
    cache,
  })
}
