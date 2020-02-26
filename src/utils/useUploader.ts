import { DocumentNode, ExecutionResult } from 'graphql'
import { useCallback, useMemo } from 'react'
import { MutationHookOptions, useMutation } from '@apollo/react-hooks'
import { pickGraphqlData } from './pickGraphqlData'
import { OperationVariables } from '@apollo/react-common'
import { ApolloError } from 'apollo-client'

type Uploader<TData> = [
  (file: File, overrideOptions: {}) => Promise<ExecutionResult<TData>>,
  { data: null | TData; loading: boolean; error?: ApolloError }
]

export const useUploader = <TData = any, TVariables = OperationVariables>(
  mutation: DocumentNode,
  options: MutationHookOptions<TData, TVariables> = {},
  pickData = ''
): Uploader<TData> => {
  const [mutationFn, { data, loading, error }] = useMutation<TData, TVariables>(
    mutation,
    options
  )

  const uploadFile = useCallback(
    (file: File, overrideOptions = {}) => {
      const queryOptions = {
        ...overrideOptions,
        variables: {
          ...(options?.variables || {}),
          ...(overrideOptions?.variables || {}),
          file,
        },
      }
      return mutationFn(queryOptions)
    },
    [options?.variables, mutationFn]
  )

  const pickedData = useMemo(() => pickGraphqlData(data, pickData), [data, pickData])
  return [uploadFile, { data: pickedData, loading, error }]
}
