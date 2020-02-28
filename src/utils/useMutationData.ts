import { MutationHookOptions, useMutation } from '@apollo/react-hooks'
import { MutationFunctionOptions, OperationVariables } from '@apollo/react-common'
import { DocumentNode, ExecutionResult } from 'graphql'
import { useMemo } from 'react'
import { pickGraphqlData } from './pickGraphqlData'
import { ApolloError } from 'apollo-client'

type Mutator<TData, TVariables> = [
  (
    overrideOptions?: MutationFunctionOptions<TData, TVariables>
  ) => Promise<ExecutionResult<TData>>,
  { data: null | TData; loading: boolean; error?: ApolloError; called: boolean }
]

export const useMutationData = <TData = any, TVariables = OperationVariables>(
  mutation: DocumentNode,
  options: MutationHookOptions<TData, TVariables> = {},
  pickData = ''
): Mutator<TData, TVariables> => {
  const [mutationFn, { data, loading, error, called }] = useMutation<TData, TVariables>(
    mutation,
    options
  )
  const pickedData = useMemo(() => pickGraphqlData(data, pickData), [data, pickData])
  return [mutationFn, { data: pickedData, loading, error, called }]
}
