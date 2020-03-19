import { LazyQueryHookOptions, QueryLazyOptions, useLazyQuery } from '@apollo/react-hooks'
import { DocumentNode } from 'graphql'
import { pickGraphqlData } from './pickGraphqlData'
import { OperationVariables } from '@apollo/react-common'
import { useMemo } from 'react'
import { ApolloError, ApolloQueryResult } from 'apollo-client'

type QueryExecutor<TData, TVariables> = [
  (overrideOptions?: QueryLazyOptions<TVariables> | undefined) => void,
  {
    data: null | TData
    loading: boolean
    error?: ApolloError
    refetch: (variables?: TVariables | undefined) => Promise<ApolloQueryResult<TData>>
  }
]

export const useLazyQueryData = <TData = any, TVariables = OperationVariables>(
  query: DocumentNode,
  options: LazyQueryHookOptions<TData, TVariables> = {},
  pickData = ''
): QueryExecutor<TData, TVariables> => {
  const [queryFn, { loading, error, data, refetch }] = useLazyQuery<TData, TVariables>(
    query,
    options
  )
  const pickedData = useMemo(() => pickGraphqlData(data, pickData), [data, pickData])
  return [queryFn, { data: pickedData, loading, error, refetch }]
}
