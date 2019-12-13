import { DocumentNode } from 'graphql'
import { useMutation } from 'urql'
import { useCallback } from 'react'

export const useUploader = <T = any, V = object>(
  mutation: DocumentNode | string,
  variables
) => {
  const [state, execMutation] = useMutation<T, V>(mutation)

  const uploadFile = useCallback(
    (file, otherVariables = {}) => {
      const queryVars = { file, ...variables, ...otherVariables }
      return execMutation(queryVars)
    },
    [variables, execMutation]
  )

  return [uploadFile, state]
}
