import {
  ApolloError,
  ApolloQueryResult,
  LazyQueryHookOptions,
  OperationVariables,
  QueryLazyOptions,
  useLazyQuery,
} from '@apollo/client'
import { DocumentNode } from 'graphql'
import { pickGraphqlData } from './pickGraphqlData'
import { useCallback, useMemo } from 'react'

type QueryExecutor<TData, TVariables> = [
  (
    overrideOptions?: QueryLazyOptions<TVariables> | undefined
  ) => Promise<void | ApolloQueryResult<TData>>,
  {
    data: null | TData
    loading: boolean
    error?: ApolloError
    refetch?: (variables?: TVariables | undefined) => Promise<ApolloQueryResult<TData>>
    called: boolean
  }
]

export const useLazyQueryData = <TData = any, TVariables = OperationVariables>(
  query: DocumentNode,
  options: LazyQueryHookOptions<TData, TVariables> = {},
  pickData = ''
): QueryExecutor<TData, TVariables> => {
  let queryHookArr = useLazyQuery<TData, TVariables>(query, options)
  let [queryFn, { loading, error, data, refetch, called, networkStatus }] = queryHookArr || [
    () => {},
    {},
  ]

  let availableRefetch = useCallback(
    async (variables?: TVariables): Promise<ApolloQueryResult<TData>> => {
      if (refetch) {
        return refetch(variables)
      }

      return { data, loading, networkStatus }
    },
    [refetch, data, loading, networkStatus]
  )

  let execLazyQuery = useCallback(
    (options?: QueryLazyOptions<TVariables> | undefined) => {
      if (called) {
        return availableRefetch(options?.variables)
      }

      return Promise.resolve(queryFn(options))
    },
    [queryFn, availableRefetch, called]
  )

  const pickedData = useMemo(() => pickGraphqlData(data, pickData), [data, pickData])
  return [
    execLazyQuery,
    { data: pickedData, loading, error, refetch: availableRefetch, called },
  ]
}
