import { useQueryData } from '../util/useQueryData'
import {
  executionRequirementsForAreaQuery,
  observedExecutionRequirementsQuery,
} from './executionRequirementsQueries'
import { useRefetch } from '../util/useRefetch'
import { useMemo } from 'react'
import {
  ObservedExecutionRequirement,
  PlannedAreaExecutionRequirement,
  PlannedUnitExecutionRequirement,
} from '../schema-types'
import { orderBy } from 'lodash'

export function usePreInspectionAreaRequirements(inspectionId?: string) {
  let {
    data: executionRequirementsData,
    loading,
    refetch: refetchRequirements,
  } = useQueryData<PlannedAreaExecutionRequirement[]>(executionRequirementsForAreaQuery, {
    notifyOnNetworkStatusChange: true,
    skip: !inspectionId,
    variables: {
      inspectionId,
    },
  })

  let refetch = useRefetch(refetchRequirements)

  let areaExecutionRequirements = useMemo<PlannedAreaExecutionRequirement[]>(
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
  } = useQueryData<ObservedExecutionRequirement[]>(observedExecutionRequirementsQuery, {
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

export enum RequirementsTableLayout {
  BY_VALUES,
  BY_EMISSION_CLASS,
}

export const emissionClassLayoutColumnLabels = {
  'unit': 'Yksikkö',
  '1': 'Euro 3',
  '2': 'Euro 4',
  '3': 'Euro 3 CNG',
  '4': 'Euro 5',
  '5': 'EEV Di',
  '6': 'EEV eteho.',
  '7': 'EEV CNG',
  '8': 'Euro 6',
  '9': 'Euro 6 eteho.',
  '10': 'Sähkö',
  'total': 'Yhteensä',
}
