import {
  ApolloError,
  MutationFunctionOptions,
  MutationHookOptions,
  OperationVariables,
  useMutation,
} from '@apollo/client'
import { DocumentNode, ExecutionResult } from 'graphql'
import { useCallback, useMemo, useState } from 'react'
import { pickGraphqlData } from './pickGraphqlData'
import { GraphQLError } from 'graphql/error/GraphQLError'
import { MutationFnType } from './useMutationData'

type Uploader<TData, TVariables> = [
  (
    file: File,
    overrideOptions?: MutationFunctionOptions<TData, TVariables>
  ) => Promise<ExecutionResult>,
  {
    data: null | TData
    loading: boolean
    error?: ApolloError
    called: boolean
    mutationFn: MutationFnType<TData, TVariables>
  }
]

export const useUploader = <TData = any, TVariables = OperationVariables>(
  mutation: DocumentNode,
  options: MutationHookOptions<TData, TVariables> = {},
  onUploadFinished?: (data?: TData, errors?: ReadonlyArray<GraphQLError>) => void
): Uploader<TData, TVariables> => {
  let [uploadError, setUploadError] = useState()

  let errorHandler = useCallback((err) => {
    setUploadError(err)
    return { data: null, error: err }
  }, [])

  const [mutationFn, { data, loading, error, called }] = useMutation<TData, TVariables>(
    mutation,
    { notifyOnNetworkStatusChange: true, ...options }
  )

  const uploadFile = useCallback(
    (file: File, overrideOptions = {}) => {
      let { variables: overrideVariables = {}, ...restOptions } = overrideOptions

      const queryOptions: MutationFunctionOptions<TData, TVariables> = {
        ...restOptions,
        variables: {
          ...(options?.variables || {}),
          ...overrideVariables,
          file,
        },
      }

      setUploadError(undefined)

      return mutationFn(queryOptions)
        .then((result) => {
          const uploadedData = pickGraphqlData(result.data)

          if (onUploadFinished) {
            onUploadFinished(uploadedData, result.errors)
          }

          return { data: uploadedData, error: (result?.errors || [])[0] }
        })
        .catch(errorHandler)
    },
    [options?.variables, errorHandler, mutationFn, onUploadFinished]
  )

  const pickedData = useMemo(() => pickGraphqlData(data), [data])

  return [
    uploadFile,
    { data: pickedData, loading, error: error || uploadError, called, mutationFn },
  ]
}
