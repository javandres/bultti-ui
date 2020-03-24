import { MutationHookOptions, useMutation } from '@apollo/react-hooks'
import { MutationFunctionOptions, OperationVariables } from '@apollo/react-common'
import { DocumentNode, ExecutionResult } from 'graphql'
import { useCallback, useMemo } from 'react'
import { pickGraphqlData } from './pickGraphqlData'
import { ApolloError } from 'apollo-client'
import { GraphQLError } from 'graphql/error/GraphQLError'

type Uploader<TData, TVariables> = [
  (
    file: File,
    overrideOptions?: MutationFunctionOptions<TData, TVariables>
  ) => Promise<ExecutionResult<TData>>,
  { data: null | TData; loading: boolean; error?: ApolloError; called: boolean }
]

export const useUploader = <TData = any, TVariables = OperationVariables>(
  mutation: DocumentNode,
  options: MutationHookOptions<TData, TVariables> = {},
  onUploadFinished?: (data?: TData, errors?: ReadonlyArray<GraphQLError>) => void
): Uploader<TData, TVariables> => {
  const [mutationFn, { data, loading, error, called }] = useMutation<TData, TVariables>(
    mutation,
    options
  )

  const uploadFile = useCallback(
    (file: File, overrideOptions = {}) => {
      const queryOptions: MutationFunctionOptions<TData, TVariables> = {
        ...overrideOptions,
        variables: {
          ...(options?.variables || {}),
          ...(overrideOptions?.variables || {}),
          file,
        },
      }

      return mutationFn(queryOptions).then((result) => {
        const uploadedData = pickGraphqlData(result.data)

        if (onUploadFinished) {
          onUploadFinished(uploadedData, result.errors)
        }

        return uploadedData
      })
    },
    [options?.variables, mutationFn, onUploadFinished]
  )

  const pickedData = useMemo(() => pickGraphqlData(data), [data])
  return [uploadFile, { data: pickedData, loading, error, called }]
}
