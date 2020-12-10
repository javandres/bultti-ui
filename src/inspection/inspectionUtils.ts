import { useCallback } from 'react'
import {
  InitialInspectionInput,
  Inspection,
  InspectionStatus,
  InspectionType,
  InspectionUserRelationType,
  Operator,
  Season,
  User,
} from '../schema-types'
import { pickGraphqlData } from '../util/pickGraphqlData'
import { useMutationData } from '../util/useMutationData'
import {
  createInspectionMutation,
  currentPreInspectionsByOperatorAndSeasonQuery,
  inspectionQuery,
  inspectionsByOperatorQuery,
  inspectionStatusSubscription,
  removeInspectionMutation,
} from './inspectionQueries'
import { useQueryData } from '../util/useQueryData'
import { useRefetch } from '../util/useRefetch'
import { navigateWithQueryString } from '../util/urlValue'
import { useStateValue } from '../state/useAppState'
import { orderBy } from 'lodash'

export function useInspectionById(inspectionId?: string) {
  let { data, loading, error, refetch: refetcher } = useQueryData<Inspection>(
    inspectionQuery,
    {
      skip: !inspectionId,
      notifyOnNetworkStatusChange: true,
      variables: {
        inspectionId: inspectionId,
      },
    },
    { document: inspectionStatusSubscription }
  )

  let refetch = useRefetch(refetcher, false)
  return { data, loading, error, refetch }
}

export function useCreateInspection(
  operator: Operator,
  season: Season,
  inspectionType: InspectionType
) {
  let [createInspection, { loading: createLoading }] = useMutationData(
    createInspectionMutation
  )

  // Initialize the form by creating a pre-inspection on the server and getting the ID.
  return useCallback(
    async (seasonId = season?.id) => {
      // A pre-inspection can be created when there is not one currently existing or loading
      if (operator && seasonId && !createLoading) {
        // InitialInspectionInput requires operator, season ID and inspection type.
        let inspectionInput: InitialInspectionInput = {
          operatorId: operator.id,
          seasonId,
          startDate: season.startDate,
          endDate: season.endDate,
          inspectionType,
        }

        let createResult = await createInspection({
          variables: {
            inspectionInput,
          },
        })

        let newInspection = pickGraphqlData(createResult.data)

        if (newInspection) {
          return newInspection
        } else {
          console.error(createResult.errors)
        }

        return null
      }
    },
    [season, operator, createLoading]
  )
}

export function useRemoveInspection(
  inspection: Inspection,
  afterRemove: () => unknown = () => {}
): [(inspection?: Inspection) => Promise<unknown>, { loading: boolean }] {
  let { operatorId, seasonId, inspectionType } = inspection

  let [removeInspection, { loading }] = useMutationData(removeInspectionMutation, {
    refetchQueries: [
      {
        query: currentPreInspectionsByOperatorAndSeasonQuery,
        variables: {
          operatorId,
          seasonId,
          inspectionType,
        },
      },
    ],
  })

  let execRemove = useCallback(async () => {
    let removeResult = await removeInspection({
      variables: {
        inspectionId: inspection.id,
      },
    })

    await afterRemove()

    return pickGraphqlData(removeResult.data) || false
  }, [removeInspection, inspection, afterRemove])

  return [execRemove, { loading }]
}

export function useEditInspection(inspectionType: InspectionType = InspectionType.Pre) {
  return useCallback(
    (inspection?: Inspection) => {
      let pathSegment = inspectionType === InspectionType.Pre ? 'pre' : 'post'

      if (inspection) {
        return navigateWithQueryString(`/${pathSegment}-inspection/edit/${inspection.id}`)
      }

      return navigateWithQueryString(`/${pathSegment}-inspection/edit`, { replace: true })
    },
    [inspectionType]
  )
}

export function useInspectionReports() {
  return useCallback(
    (inspectionId: string = '', inspectionType: InspectionType = InspectionType.Pre) => {
      let inspectionPath = inspectionType === InspectionType.Pre ? 'pre' : 'post'
      return navigateWithQueryString(`/${inspectionPath}-inspection/reports/${inspectionId}`)
    },
    []
  )
}

export function useFetchInspections(
  inspectionType: InspectionType,
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
        inspectionType,
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

export function getAllUpdatedBy(inspection?: Inspection): User[] {
  let userRelations = inspection?.userRelations || []
  let updatedRelations = userRelations.filter(
    (rel) => rel.relatedBy === InspectionUserRelationType.UpdatedBy
  )

  return orderBy(updatedRelations, 'updatedAt', 'desc').map((rel) => rel.user)
}

export function getCreatedBy(inspection?: Inspection): User | undefined {
  let userRelations = inspection?.userRelations || []
  let createdRelation = userRelations.find(
    (rel) => rel.relatedBy === InspectionUserRelationType.CreatedBy
  )

  return createdRelation ? createdRelation.user : undefined
}

export function getPublishedBy(inspection?: Inspection) {
  if (!inspection || inspection.status !== InspectionStatus.InProduction) {
    return undefined
  }

  let userRelations = inspection?.userRelations || []
  let createdRelation = userRelations.find(
    (rel) => rel.relatedBy === InspectionUserRelationType.PublishedBy
  )

  return createdRelation ? createdRelation.user : undefined
}

export function getInspectionStatusColor(inspection: Inspection) {
  if (inspection.status === InspectionStatus.Draft) {
    return 'var(--blue)'
  }

  if (inspection.status === InspectionStatus.Ready) {
    return 'var(--light-green)'
  }

  if (inspection.status === InspectionStatus.InReview) {
    return 'var(--yellow)'
  }

  if (inspection.status === InspectionStatus.InProduction) {
    return 'var(--green)'
  }

  return 'var(--light-grey)'
}

export function getInspectionTypeStrings(inspectionType: InspectionType) {
  let inspectionTypePrefix = inspectionType === InspectionType.Pre ? 'Ennakko' : 'Jälki'
  let inspectionTypePath = inspectionType === InspectionType.Pre ? 'pre' : 'post'

  return {
    prefix: inspectionTypePrefix,
    prefixLC: inspectionTypePrefix.toLocaleLowerCase(),
    path: inspectionTypePath,
  }
}
