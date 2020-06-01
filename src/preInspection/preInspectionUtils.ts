import { useCallback } from 'react'
import { InitialPreInspectionInput, Operator, Inspection } from '../schema-types'
import { pickGraphqlData } from '../util/pickGraphqlData'
import { useMutationData } from '../util/useMutationData'
import {
  createPreInspectionMutation,
  inspectionQuery,
  inspectionsByOperatorQuery,
  removePreInspectionMutation,
} from './preInspectionQueries'
import { useQueryData } from '../util/useQueryData'
import { useRefetch } from '../util/useRefetch'
import { navigateWithQueryString } from '../util/urlValue'
import { useStateValue } from '../state/useAppState'

export function usePreInspectionById(inspectionId?: string) {
  let { data, loading, error, refetch: refetcher } = useQueryData<Inspection>(
    inspectionQuery,
    {
      skip: !inspectionId,
      notifyOnNetworkStatusChange: true,
      variables: {
        inspectionId: inspectionId,
      },
    }
  )

  let refetch = useRefetch(refetcher, false)
  return { data, loading, error, refetch }
}

export function useCreatePreInspection(operator, season) {
  let [createPreInspection, { loading: createLoading }] = useMutationData(
    createPreInspectionMutation
  )

  // Initialize the form by creating a pre-inspection on the server and getting the ID.
  return useCallback(
    async (seasonId = season?.id) => {
      // A pre-inspection can be created when there is not one currently existing or loading
      if (operator && seasonId && !createLoading) {
        // InitialPreInspectionInput requires operator and season ID.
        let inspectionInput: InitialPreInspectionInput = {
          operatorId: operator.id,
          seasonId,
          startDate: season.startDate,
          endDate: season.endDate,
        }

        let createResult = await createPreInspection({
          variables: {
            inspectionInput,
          },
        })

        let newPreInspection = pickGraphqlData(createResult.data)

        if (newPreInspection) {
          return newPreInspection
        } else {
          console.error(createResult.errors)
        }

        return null
      }
    },
    [season, operator, createLoading]
  )
}

export function useRemovePreInspection(
  afterRemove: () => unknown = () => {}
): [(inspection?: Inspection) => Promise<unknown>, { loading: boolean }] {
  let [removePreInspection, { loading }] = useMutationData(removePreInspectionMutation)

  let execRemove = useCallback(
    async (inspection?: Inspection) => {
      if (inspection) {
        await removePreInspection({
          variables: {
            inspectionId: inspection.id,
          },
        })

        await afterRemove()
      }
    },
    [removePreInspection, afterRemove]
  )

  return [execRemove, { loading }]
}

export function useEditPreInspection(inspectionId = '') {
  return useCallback(
    (altInspectionId = '') => {
      let useId = inspectionId || altInspectionId || ''

      if (!useId) {
        return navigateWithQueryString(`/pre-inspection/edit`, { replace: true })
      }

      return navigateWithQueryString(`/pre-inspection/edit/${useId}`)
    },
    [inspectionId]
  )
}

export function usePreInspectionReports(inspectionId: string = '') {
  return useCallback(
    (altInspectionId?: string) => {
      let useId = inspectionId || altInspectionId || ''
      return navigateWithQueryString(`/pre-inspection/reports/${useId}`)
    },
    [inspectionId]
  )
}

export function usePreInspections(
  operator?: Operator
): [{ inspections: Inspection[]; operator: Operator | undefined }, boolean, () => unknown] {
  var [globalOperator] = useStateValue('globalOperator')

  let queryOperator = operator || globalOperator || undefined

  let { data: inspectionsData, loading, refetch } = useQueryData<Inspection>(
    inspectionsByOperatorQuery,
    {
      skip: !queryOperator,
      notifyOnNetworkStatusChange: true,
      variables: {
        operatorId: queryOperator?.operatorId,
      },
    }
  )

  let inspections = !!inspectionsData && Array.isArray(inspectionsData) ? inspectionsData : []

  let queueRefetch = useRefetch(refetch)

  return [
    {
      inspections,
      operator: queryOperator,
    },
    loading,
    queueRefetch,
  ]
}
