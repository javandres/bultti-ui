import { MutationHookOptions, useMutation } from '@apollo/react-hooks'
import { DocumentNode } from 'graphql'
import { useMemo } from 'react'
import { pickGraphqlData } from './pickGraphqlData'
import { OperationVariables } from '@apollo/react-common'

export const useMutationData = <TData = any, TVariables = OperationVariables>(
  mutation: DocumentNode,
  options: MutationHookOptions<TData, TVariables> = {},
  pickData = ''
) => {
  const [mutationFn, { data, loading, error }] = useMutation<TData, TVariables>(mutation, options)
  const pickedData = useMemo(() => pickGraphqlData(data, pickData), [data, pickData])
  return [mutationFn, { data: pickedData, loading, error }]
}
