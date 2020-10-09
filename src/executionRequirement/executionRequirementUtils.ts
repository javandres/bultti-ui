import { useQueryData } from '../util/useQueryData'
import {
  baseExecutionRequirementsForPostInspectionQuery,
  executionRequirementsForAreaQuery,
} from './executionRequirementsQueries'
import { useRefetch } from '../util/useRefetch'
import { useMemo } from 'react'
import { ExecutionRequirement } from '../schema-types'
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

export function usePostInspectionBaseRequirements(inspectionId?: string) {
  let {
    data: executionRequirementsData,
    loading,
    refetch: refetchRequirements,
  } = useQueryData(baseExecutionRequirementsForPostInspectionQuery, {
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
