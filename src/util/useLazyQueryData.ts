import { LazyQueryHookOptions, QueryLazyOptions, useLazyQuery } from '@apollo/react-hooks'
import { DocumentNode } from 'graphql'
import { pickGraphqlData } from './pickGraphqlData'
import { OperationVariables } from '@apollo/react-common'
import { useCallback, useMemo } from 'react'
import { ApolloError, ApolloQueryResult } from 'apollo-client'

type QueryExecutor<TData, TVariables> = [
  (
    overrideOptions?: QueryLazyOptions<TVariables> | undefined
  ) => Promise<void | ApolloQueryResult<TData>>,
  {
    data: null | TData
    loading: boolean
    error?: ApolloError
    refetch: (variables?: TVariables | undefined) => Promise<ApolloQueryResult<TData>>
    called: boolean
  }
]

export const useLazyQueryData = <TData = any, TVariables = OperationVariables>(
  query: DocumentNode,
  options: LazyQueryHookOptions<TData, TVariables> = {},
  pickData = ''
): QueryExecutor<TData, TVariables> => {
  let queryHookArr = useLazyQuery<TData, TVariables>(query, options)
  let [queryFn, { loading, error, data, refetch, called }] = queryHookArr || [() => {}, {}]

  let execLazyQuery = useCallback(
    (options?: QueryLazyOptions<TVariables> | undefined) => {
      if (called) {
        return refetch(options?.variables)
      }

      return Promise.resolve(queryFn(options))
    },
    [queryFn, refetch, called]
  )

  const pickedData = useMemo(() => pickGraphqlData(data, pickData), [data, pickData])
  return [execLazyQuery, { data: pickedData, loading, error, refetch, called }]
}
