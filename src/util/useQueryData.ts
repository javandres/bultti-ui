import {
  ApolloQueryResult,
  OperationVariables,
  QueryHookOptions,
  useQuery,
} from '@apollo/client'
import { DocumentNode } from 'graphql'
import { pickGraphqlData } from './pickGraphqlData'
import { useCallback, useMemo } from 'react'

const defaultOptions = {
  notifyOnNetworkStatusChange: true,
}

export const useQueryData = <TData extends {} = {}, TVariables = OperationVariables>(
  query: DocumentNode,
  options: QueryHookOptions<TData, TVariables> = {},
  pickData = ''
) => {
  let allOptions: QueryHookOptions<TData, TVariables> = {
    errorPolicy: 'all',
    ...defaultOptions,
    ...options,
  }

  let queryData = useQuery<TData, TVariables>(query, allOptions)
  let { loading, error, data = {} as TData, refetch, networkStatus } = queryData || {}

  let availableRefetch = useCallback(
    async (variables?: TVariables): Promise<ApolloQueryResult<TData>> => {
      if (refetch) {
        return refetch(variables)
      }

      return { data, loading, networkStatus }
    },
    [refetch, data, loading, networkStatus]
  )

  let pickedData = useMemo(() => pickGraphqlData(data, pickData), [data, pickData])
  return { data: pickedData, loading, error, refetch: availableRefetch }
}
