import { useQueryData } from '../util/useQueryData'
import {
  executionRequirementsForAreaQuery,
  observedExecutionRequirementsQuery,
} from './executionRequirementsQueries'
import { useRefetch } from '../util/useRefetch'
import { useMemo } from 'react'
import { ExecutionRequirement, ObservedExecutionRequirement } from '../schema-types'
import { orderBy } from 'lodash'

export function usePreInspectionAreaRequirements(inspectionId?: string) {
  let {
    data: executionRequirementsData,
    loading,
    refetch: refetchRequirements,
  } = useQueryData(executionRequirementsForAreaQuery, {
    notifyOnNetworkStatusChange: true,
    skip: !inspectionId,
    variables: {
      inspectionId,
    },
  })

  let refetch = useRefetch(refetchRequirements)

  let areaExecutionRequirements = useMemo<ExecutionRequirement[]>(
    () => (!executionRequirementsData ? [] : orderBy(executionRequirementsData, 'area.id')),
    [executionRequirementsData]
  )

  return { data: areaExecutionRequirements, loading, refetch }
}

export function useObservedRequirements(inspectionId?: string) {
  let {
    data: executionRequirementsData,
    loading,
    refetch: refetchRequirements,
  } = useQueryData(observedExecutionRequirementsQuery, {
    notifyOnNetworkStatusChange: true,
    skip: !inspectionId,
    variables: {
      postInspectionId: inspectionId,
    },
  })

  let refetch = useRefetch(refetchRequirements)

  let observedRequirements = useMemo<ObservedExecutionRequirement[]>(
    () => (!executionRequirementsData ? [] : orderBy(executionRequirementsData, 'area.id')),
    [executionRequirementsData]
  )

  return { data: observedRequirements, loading, refetch }
}
