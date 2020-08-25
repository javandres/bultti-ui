import {
  ApolloError,
  MutationFunctionOptions,
  MutationHookOptions,
  OperationVariables,
  useMutation,
} from '@apollo/client'
import { DocumentNode, ExecutionResult } from 'graphql'
import { useEffect, useMemo } from 'react'
import { pickGraphqlData } from './pickGraphqlData'
import { merge } from 'lodash'
import { useStateValue } from '../state/useAppState'

export type MutationFnType<TData, TVariables> = (
  overrideOptions?: MutationFunctionOptions<TData, TVariables>
) => Promise<ExecutionResult>

type Mutator<TData, TVariables> = [
  MutationFnType<TData, TVariables>,
  { data: null | TData; loading: boolean; error?: ApolloError; called: boolean }
]

export const useMutationData = <TData = any, TVariables = OperationVariables>(
  mutation: DocumentNode,
  options: MutationHookOptions<TData, TVariables> = {},
  pickData = ''
): Mutator<TData, TVariables> => {
  let [errorMessage, setErrorMessage] = useStateValue('errorMessage')

  const [mutationFn, { data, loading, error, called }] = useMutation<TData, TVariables>(
    mutation,
    { errorPolicy: 'all', ...options }
  )
  const pickedData = useMemo(() => pickGraphqlData(data, pickData), [data, pickData])

  const execMutation = (mutatorOptions?: MutationFunctionOptions<TData, TVariables>) => {
    const finalOptions = merge({}, { variables: options.variables }, mutatorOptions)
    return mutationFn(finalOptions)
  }

  useEffect(() => {
    if (error && !errorMessage) {
      setErrorMessage(error.message)
    }
  }, [error, errorMessage])

  return [execMutation, { data: pickedData, loading, error, called }]
}
