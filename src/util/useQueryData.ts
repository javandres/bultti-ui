import { OperationVariables, QueryHookOptions, useQuery } from '@apollo/client'
import { DocumentNode } from 'graphql'
import { pickGraphqlData } from './pickGraphqlData'
import { useMemo, useRef } from 'react'

const defaultOptions = {
  notifyOnNetworkStatusChange: true,
}

export const useQueryData = <TData = unknown, TVariables = OperationVariables>(
  query: DocumentNode,
  options: QueryHookOptions<TData, TVariables> & { pickData?: string } = {}
) => {
  // Merge default options with provided options
  let allOptions: QueryHookOptions<TData, TVariables> = {
    errorPolicy: 'all',
    ...defaultOptions,
    ...options,
  }

  // Get the pick argument if provided
  let pickData = options?.pickData || ''

  // Execute the Apollo hook
  let queryData = useQuery<TData, TVariables>(query, allOptions)

  let { loading, error, data = {} as TData, refetch, subscribeToMore = () => {} } =
    queryData || {}

  // Save the previous result here so we can show it while the query is refectched.
  let prevData = useRef(undefined)

  // Pick the result data from the returned data structure.
  // Return prevData if the result is not yet loaded.
  let pickedData = useMemo<TData>(() => {
    let resultData = pickGraphqlData(data, pickData)

    if (!resultData) {
      return prevData.current
    }

    prevData.current = resultData
    return resultData
  }, [data, pickData])

  return { data: pickedData, loading, error, refetch }
}
