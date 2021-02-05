import {
  ApolloError,
  ApolloQueryResult,
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

const defaultOptions = {
  notifyOnNetworkStatusChange: true,
}

export const useLazyQueryData = <TData extends {} = {}, TVariables = OperationVariables>(
  query: DocumentNode,
  options: LazyQueryHookOptions<TData, TVariables> = {},
  pickData = ''
): QueryExecutor<TData, TVariables> => {
  let allOptions: QueryHookOptions<TData, TVariables> = {
    errorPolicy: 'all',
    ...defaultOptions,
    ...options,
  }
  let queryHookArr = useLazyQuery<TData, TVariables>(query, allOptions)

  let [
    queryFn,
    { loading, error, data = {} as TData, refetch, called, networkStatus },
  ] = queryHookArr || [() => {}, {}]

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
