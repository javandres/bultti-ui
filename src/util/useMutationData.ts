import {
  MutationHookOptions,
  useMutation,
  MutationFunctionOptions,
  OperationVariables,
  ApolloError,
} from '@apollo/client'
import { DocumentNode, ExecutionResult } from 'graphql'
import { useMemo } from 'react'
import { pickGraphqlData } from './pickGraphqlData'
import { merge } from 'lodash'

type Mutator<TData, TVariables> = [
  (overrideOptions?: MutationFunctionOptions<TData, TVariables>) => Promise<ExecutionResult>,
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

  const execMutation = (mutatorOptions?: MutationFunctionOptions<TData, TVariables>) => {
    const finalOptions = merge({}, { variables: options.variables }, mutatorOptions)
    return mutationFn(finalOptions)
  }

  return [execMutation, { data: pickedData, loading, error, called }]
}
