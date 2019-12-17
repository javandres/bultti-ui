import { DocumentNode } from 'graphql'
import { useCallback, useMemo } from 'react'
import { MutationHookOptions, useMutation } from '@apollo/react-hooks'
import { pickGraphqlData } from './pickGraphqlData'
import { OperationVariables } from '@apollo/react-common'

export const useUploader = <TData = any, TVariables = OperationVariables>(
  mutation: DocumentNode,
  options: MutationHookOptions<TData, TVariables> = {},
  pickData = ''
): [any, {data: any, loading: boolean, error: any}] => {
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
