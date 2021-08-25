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

const defaultOptions = {
  notifyOnNetworkStatusChange: true,
}

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
    ...defaultOptions,
    ...options,
  }

  let queryHookArr = useLazyQuery<TData, TVariables>(query, allOptions)

  let [
    queryFn,
    { loading, error, data = {} as TData, refetch, called, networkStatus },
  ] = queryHookArr || [() => {}, {}]

  let availableRefetch = useCallback(
    async (variables?: TVariables): Promise<void> => {
      if (refetch) {
        return refetch(variables).then(() => undefined)
      }

      return queryFn({ variables })
    },
    [refetch, data, loading, networkStatus]
  )

  const pickedData = useMemo(() => pickGraphqlData(data, pickData), [data, pickData])

  return [queryFn, { data: pickedData, loading, error, refetch: availableRefetch, called }]
}
