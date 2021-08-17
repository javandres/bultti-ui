import { useCallback } from 'react'
import {
  InitialInspectionInput,
  Inspection,
  InspectionStatus,
  InspectionType,
  InspectionUserRelationType,
  Operator,
  PostInspection,
  PreInspection,
  Season,
  User,
  UserRole,
} from '../schema-types'
import { pickGraphqlData } from '../util/pickGraphqlData'
import { useMutationData } from '../util/useMutationData'
import {
  createInspectionMutation,
  currentInspectionsByOperatorAndSeasonQuery,
  inspectionQuery,
  inspectionsByOperatorQuery,
  removeInspectionMutation,
} from './inspectionQueries'
import { useQueryData } from '../util/useQueryData'
import { useRefetch } from '../util/useRefetch'
import { useStateValue } from '../state/useAppState'
import { orderBy } from 'lodash'
import { text } from '../util/translate'
import { operatorIsValid } from '../common/input/SelectOperator'
import { isObjectLike } from '../util/isObjectLike'
import { useNavigate } from '../util/urlValue'
import { hasAccessRights } from '../util/userRoles'

export function useInspectionById(inspectionId: string) {
  let {
    data,
    loading,
    error,
    refetch: refetcher,
  } = useQueryData<Inspection>(inspectionQuery, {
    skip: !inspectionId,
    notifyOnNetworkStatusChange: true,
    variables: {
      inspectionId: inspectionId,
    },
  })

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
      if (operatorIsValid(operator) && seasonId && !createLoading) {
        // InitialInspectionInput requires operator, season ID and inspection type.
        let inspectionInput: InitialInspectionInput = {
          inspectionType,
          operatorId: operator.id,
          seasonId,
          startDate: season.startDate,
          endDate: season.endDate,
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
    [season, operator, createLoading, inspectionType]
  )
}

export function useRemoveInspection(
  inspection: Inspection
): [() => Promise<unknown>, { loading: boolean }] {
  let [removeInspection, { loading }] = useMutationData(removeInspectionMutation, {
    refetchQueries: [
      'inspectionsByOperatorQuery',
      'currentInspectionsByOperatorAndSeasonQuery',
    ],
  })

  let execRemove = useCallback(async () => {
    let removeResult = await removeInspection({
      variables: {
        inspectionId: inspection.id,
      },
    })

    return pickGraphqlData(removeResult.data) || false
  }, [removeInspection, inspection])

  return [execRemove, { loading }]
}

export function useNavigateToInspection(inspectionType: InspectionType = InspectionType.Pre) {
  let navigate = useNavigate()

  return useCallback(
    (inspection?: Inspection) => {
      let pathSegment = getInspectionTypeStrings(inspectionType).path

      if (inspection) {
        return navigate.push(`/${pathSegment}-inspection/edit/${inspection.id}`)
      }

      return navigate.push(`/${pathSegment}-inspection/edit`)
    },
    [inspectionType, navigate]
  )
}

export function useNavigateToInspectionReports() {
  let navigate = useNavigate()

  return useCallback(
    (inspectionId: string = '', inspectionType: InspectionType = InspectionType.Pre) => {
      let inspectionPath = inspectionType === InspectionType.Pre ? 'pre' : 'post'
      return navigate.push(`/${inspectionPath}-inspection/reports/${inspectionId}`)
    },
    [navigate]
  )
}

export function useFetchInspections(
  inspectionType: InspectionType,
  operator?: Operator
): [{ inspections: Inspection[]; operator: Operator | undefined }, boolean, () => unknown] {
  var [globalOperator] = useStateValue('globalOperator')

  let queryOperator = operator || globalOperator || undefined

  let {
    data: inspectionsData,
    loading,
    refetch,
  } = useQueryData<Inspection>(inspectionsByOperatorQuery, {
    skip: !operatorIsValid(queryOperator),
    notifyOnNetworkStatusChange: true,
    variables: {
      operatorId: queryOperator?.id,
      inspectionType,
    },
  })

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

export function getAllUpdatedByUsers(inspection?: Inspection): User[] {
  let userRelations = inspection?.userRelations || []
  let updatedRelations = userRelations.filter(
    (rel) => rel.relatedBy === InspectionUserRelationType.UpdatedBy
  )

  return orderBy(updatedRelations, 'updatedAt', 'desc').map((rel) => rel.user)
}

export function getCreatedByUser(inspection?: Inspection): User | undefined {
  let userRelations = inspection?.userRelations || []
  let createdRelation = userRelations.find(
    (rel) => rel.relatedBy === InspectionUserRelationType.CreatedBy
  )

  return createdRelation ? createdRelation.user : undefined
}

export function getInspectionStatusColor(inspectionStatus?: InspectionStatus) {
  if (inspectionStatus === InspectionStatus.Draft) {
    return 'var(--blue)'
  }

  if (inspectionStatus === InspectionStatus.Sanctionable) {
    return 'var(--light-blue)'
  }

  if (inspectionStatus === InspectionStatus.InReview) {
    return 'var(--yellow)'
  }

  if (inspectionStatus === InspectionStatus.InProduction) {
    return 'var(--green)'
  }

  // Processing
  return 'var(--light-grey)'
}

export function getInspectionStatusName(inspectionStatus: InspectionStatus) {
  return text('inspection_state_' + inspectionStatus)
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

export function isPreInspection(inspection: unknown): inspection is PreInspection {
  return isObjectLike(inspection) && inspection.inspectionType === InspectionType.Pre
}

export function isPostInspection(inspection: unknown): inspection is PostInspection {
  return isObjectLike(inspection) && inspection.inspectionType === InspectionType.Post
}

export function useCanOpenInspection({
  inspectionType,
  inspectionStatus,
  operatorId,
}: {
  inspectionType: InspectionType
  inspectionStatus?: InspectionStatus
  operatorId: number
}): boolean {
  const [user] = useStateValue('user')

  let allowedRoles: 'all' | UserRole[] = []
  if (inspectionStatus === InspectionStatus.Draft) {
    if (inspectionType === InspectionType.Pre) {
      allowedRoles = [UserRole.Admin, UserRole.Operator]
    } else {
      allowedRoles = [UserRole.Admin]
    }
  } else {
    allowedRoles = 'all'
  }

  return hasAccessRights({
    user,
    allowedRoles,
    operatorId,
  })
}

export function useCanEditInspection({
  inspectionType,
  operatorId,
}: {
  inspectionType: InspectionType
  operatorId?: number
}): boolean {
  const [user] = useStateValue('user')

  let allowedRoles: UserRole[] = []

  if (inspectionType === InspectionType.Pre) {
    allowedRoles = [UserRole.Admin, UserRole.Operator]
  } else {
    allowedRoles = [UserRole.Admin]
  }

  return hasAccessRights({
    user,
    allowedRoles,
    operatorId,
  })
}

interface InspectionPeriodObj {
  inspectionStartDate?: string | null
  inspectionEndDate?: string | null
}

export function didInspectionPeriodChange(
  inspectionA: InspectionPeriodObj,
  inspectionB: InspectionPeriodObj
) {
  return (
    inspectionA.inspectionStartDate &&
    inspectionB.inspectionStartDate &&
    inspectionA.inspectionStartDate !== inspectionB.inspectionStartDate
  )
}
