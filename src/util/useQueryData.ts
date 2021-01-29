import {
  ApolloQueryResult,
  OperationVariables,
  QueryHookOptions,
  useQuery,
} from '@apollo/client'
import { DocumentNode } from 'graphql'
import { pickGraphqlData } from './pickGraphqlData'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { merge } from 'lodash'

const defaultOptions = {
  notifyOnNetworkStatusChange: true,
}

export const useQueryData = <TData extends {} = any, TVariables = OperationVariables>(
  query: DocumentNode,
  options: QueryHookOptions<TData, TVariables> & { pickData?: string } = {},
  subscriber?: { document: DocumentNode; variables?: TVariables }
) => {
  // Merge default options with provided options
  let allOptions: QueryHookOptions<TData, TVariables> = {
    errorPolicy: 'all',
    ...defaultOptions,
    ...options,
  }

  // Get the pick argument if provided
  let pickData = options?.pickData || ''

  // Execute the Apollo hook
  let queryData = useQuery<TData, TVariables>(query, allOptions)

  let {
    loading,
    error,
    data = {} as TData,
    refetch,
    networkStatus,
    subscribeToMore = () => {},
  } = queryData || {}

  // Sometimes refetch is unset after fast refresh (in development), so this ensures it is always callable.
  let availableRefetch = useCallback(
    async (variables?: TVariables): Promise<ApolloQueryResult<TData>> => {
      if (refetch) {
        return refetch(variables)
      }

      return { data, loading, networkStatus }
    },
    [refetch, data, loading, networkStatus]
  )

  // Special treatment when a subscriber is provided
  useEffect(() => {
    if (subscriber) {
      let { document, variables = allOptions.variables } = subscriber

      // Automatically subscribe to more
      subscribeToMore({
        document,
        variables,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) {
            return prev
          }

          return merge({ ...prev }, subscriptionData.data)
        },
      })
    }
  }, [subscriber, subscribeToMore])

  // Save the previous result here so we can show it while the query is refectched.
  let prevData = useRef(undefined)

  // Pick the result data from the returned data structure.
  // Return prevData if the result is not yet loaded.
  let pickedData = useMemo<TData>(() => {
    let resultData = pickGraphqlData(data, pickData)

    if (!resultData) {
      return prevData.current
    }

    prevData.current = resultData
    return resultData
  }, [data, pickData])

  return { data: pickedData, loading, error, refetch: availableRefetch }
}
