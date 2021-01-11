import {
  ApolloClient,
  ApolloLink,
  defaultDataIdFromObject,
  InMemoryCache,
  split,
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { setContext } from '@apollo/client/link/context'
import { GRAPHQL_PATH, SERVER_URL } from './constants'
import { createUploadLink } from 'apollo-upload-client'
import introspection from './possibleTypes'
import { getAuthToken } from './util/authToken'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'

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

  const wsLink = new WebSocketLink({
    uri: SERVER_URL.replace('http', 'ws') + GRAPHQL_PATH,
    options: {
      reconnect: true,
      connectionParams: () => ({
        authToken: getAuthToken(),
      }),
    },
  })

  const httpLink = createUploadLink({
    uri: SERVER_URL + GRAPHQL_PATH,
    credentials: 'include',
  })

  let cacheMerge = (existing, incoming) => {
    return incoming
  }

  const cache = new InMemoryCache({
    addTypename: true,
    typePolicies: {
      Query: {
        fields: {
          currentInspectionsByOperatorAndSeason: {
            merge: cacheMerge,
          },
          availableDayTypes: {
            merge: cacheMerge,
          },
          observedExecutionRequirements: {
            merge: cacheMerge,
          },
        },
      },
      Inspection: {
        fields: {
          inspectionErrors: {
            merge: cacheMerge,
          },
        },
      },
      EquipmentCatalogue: {
        fields: {
          equipmentQuotas: {
            merge: cacheMerge,
          },
        },
      },
      ExecutionRequirement: {
        fields: {
          equipmentQuotas: {
            merge: cacheMerge,
          },
        },
      },
      User: {
        fields: {
          inspectionRelations: {
            merge: cacheMerge,
          },
        },
      },
      ProcurementUnit: {
        fields: {
          routes: {
            merge: cacheMerge,
          },
        },
      },
      Contract: {
        fields: {
          procurementUnits: {
            merge: cacheMerge,
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

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query)

      return (
        definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
      )
    },
    wsLink,
    httpLink
  )

  return new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, splitLink]),
    cache,
  })
}
