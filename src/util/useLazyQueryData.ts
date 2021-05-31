import {
  ApolloError,
  LazyQueryHookOptions,
  OperationVariables,
  QueryHookOptions,
  QueryLazyOptions,
  useLazyQuery,
} from '@apollo/client'
import { DocumentNode } from 'graphql'
import { pickGraphqlData } from './pickGraphqlData'
import { useCallback, useMemo } from 'react'

type QueryExecutor<TData, TVariables> = [
  (overrideOptions?: QueryLazyOptions<TVariables> | undefined) => void,
  {
    data: null | TData
    loading: boolean
    error?: ApolloError
    refetch?: (variables?: TVariables | undefined) => Promise<void>
    called: boolean
  }
]

export const useLazyQueryData = <
  TData extends Record<string, unknown> = Record<string, unknown>,
  TVariables = OperationVariables
>(
  query: DocumentNode,
  options: LazyQueryHookOptions<TData, TVariables> = {},
  pickData = ''
): QueryExecutor<TData, TVariables> => {
  let allOptions: QueryHookOptions<TData, TVariables> = {
    errorPolicy: 'all',
    nextFetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    ...options,
  }

  let queryHookArr = useLazyQuery<TData, TVariables>(query, allOptions)

  let [
    queryFn,
    { loading, error, data = {} as TData, refetch, called, networkStatus },
  ] = queryHookArr || [() => {}, {}]

  let execQuery = useCallback(
    async (options?: QueryLazyOptions<TVariables> | undefined): Promise<void> => {
      if (called && typeof refetch === 'function') {
        return refetch(options?.variables)?.then(() => undefined)
      }

      return queryFn(options)
    },
    [refetch, data, called, loading, networkStatus]
  )

  const pickedData = useMemo(() => pickGraphqlData(data, pickData), [data, pickData])

  return [execQuery, { data: pickedData, loading, error, called }]
}
