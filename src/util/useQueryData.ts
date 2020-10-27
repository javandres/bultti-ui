import {
  ApolloQueryResult,
  OperationVariables,
  QueryHookOptions,
  useQuery,
} from '@apollo/client'
import { DocumentNode } from 'graphql'
import { pickGraphqlData } from './pickGraphqlData'
import { useCallback, useEffect, useMemo } from 'react'
import { merge } from 'lodash'

const defaultOptions = {
  notifyOnNetworkStatusChange: true,
}

export const useQueryData = <TData extends {} = {}, TVariables = OperationVariables>(
  query: DocumentNode,
  options: QueryHookOptions<TData, TVariables> & { pickData?: string } = {},
  subscriber?: { document: DocumentNode; variables?: TVariables }
) => {
  let allOptions: QueryHookOptions<TData, TVariables> = {
    errorPolicy: 'all',
    ...defaultOptions,
    ...options,
  }

  let pickData = options?.pickData || ''

  let queryData = useQuery<TData, TVariables>(query, allOptions)
  let { loading, error, data = {} as TData, refetch, networkStatus, subscribeToMore } =
    queryData || {}

  let availableRefetch = useCallback(
    async (variables?: TVariables): Promise<ApolloQueryResult<TData>> => {
      if (refetch) {
        return refetch(variables)
      }

      return { data, loading, networkStatus }
    },
    [refetch, data, loading, networkStatus]
  )

  useEffect(() => {
    if (subscriber) {
      let { document, variables = allOptions.variables } = subscriber

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

  let pickedData = useMemo(() => pickGraphqlData(data, pickData), [data, pickData])
  return { data: pickedData, loading, error, refetch: availableRefetch }
}
