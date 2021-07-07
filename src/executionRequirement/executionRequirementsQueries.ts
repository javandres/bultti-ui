import { gql } from '@apollo/client'
import { EquipmentFragment } from '../equipment/equipmentQuery'

export const RequirementValueFragment = gql`
  fragment RequirementValueFragment on PlannedEmissionClassRequirement {
    emissionClass
    kilometerRequirement
    kilometersFulfilled
    quotaRequirement
    quotaFulfilled
    equipmentCount
    equipmentCountFulfilled
    sanctionAmount
    sanctionThreshold
    classSanctionAmount
    cumulativeDifferencePercentage
    differencePercentage
  }
`

export const ObservedRequirementValueFragment = gql`
  fragment ObservedRequirementValueFragment on ObservedEmissionClassRequirement {
    id
    emissionClass
    kilometersRequired
    kilometersObserved
    quotaRequired
    quotaObserved
    equipmentCountRequired
    equipmentCountObserved
    sanctionAmount
    sanctionThreshold
    sanctionAmount
    sanctionablePercentage
    cumulativeDifferencePercentage
    differencePercentage
    differenceKilometers
    equipmentCountObserved
    equipmentCountRequired
  }
`

export const UnitExecutionRequirementFragment = gql`
  fragment UnitExecutionRequirementFragment on PlannedUnitExecutionRequirement {
    id
    kilometersRequired
    kilometersObserved
    operator {
      id
      operatorIds
      operatorName
    }
    area {
      id
      name
    }
  }
`

export const AreaExecutionRequirementFragment = gql`
  fragment AreaExecutionRequirementFragment on PlannedAreaExecutionRequirement {
    id
    kilometersRequired
    kilometersObserved
    operator {
      id
      operatorIds
      operatorName
    }
    area {
      id
      name
    }
  }
`

export const ObservedExecutionRequirementFragment = gql`
  fragment ObservedExecutionRequirementFragment on ObservedExecutionRequirement {
    id
    startDate
    endDate
    inspectionId
    operatorId
    kilometersObserved
    kilometersRequired
    area {
      id
      name
    }
    inspection {
      id
    }
    operator {
      id
      operatorIds
      operatorName
    }
  }
`

export const executionRequirementForProcurementUnitQuery = gql`
  query executionRequirementForProcurementUnit(
    $procurementUnitId: String!
    $inspectionId: String!
  ) {
    executionRequirementForProcurementUnit(
      procurementUnitId: $procurementUnitId
      inspectionId: $inspectionId
    ) {
      averageAgeWeighted
      averageAgeRequirement
      averageAgeWeightedFulfilled
      ...UnitExecutionRequirementFragment
      equipmentQuotas {
        id
        kilometerRequirement
        percentageQuota
        requirementOnly
        equipment {
          ...EquipmentFragment
        }
      }
      requirements {
        ...RequirementValueFragment
      }
    }
  }
  ${UnitExecutionRequirementFragment}
  ${EquipmentFragment}
  ${RequirementValueFragment}
`

export const executionRequirementsForAreaQuery = gql`
  query executionRequirementsByPreInspection($inspectionId: String!) {
    executionRequirementsForPreInspectionAreas(inspectionId: $inspectionId) {
      ...AreaExecutionRequirementFragment
      requirements {
        ...RequirementValueFragment
      }
      inspection {
        id
        inspectionErrors {
          type
          keys
          objectId
          referenceKeys
        }
      }
    }
  }
  ${AreaExecutionRequirementFragment}
  ${RequirementValueFragment}
`

export const observedExecutionRequirementsQuery = gql`
  query observedExecutionRequirements($postInspectionId: String!) {
    observedExecutionRequirements(postInspectionId: $postInspectionId) {
      ...ObservedExecutionRequirementFragment
      observedRequirements {
        ...ObservedRequirementValueFragment
      }
    }
  }
  ${ObservedExecutionRequirementFragment}
  ${ObservedRequirementValueFragment}
`

export const previewObservedRequirementQuery = gql`
  query previewObservedRequirement($requirementId: String!) {
    previewObservedRequirement(requirementId: $requirementId) {
      ...ObservedExecutionRequirementFragment
      observedRequirements {
        ...ObservedRequirementValueFragment
      }
    }
  }
  ${ObservedExecutionRequirementFragment}
  ${ObservedRequirementValueFragment}
`

export const createObservedExecutionRequirementsFromPreInspectionRequirementsMutation = gql`
  mutation createObservedExecutionRequirementsFromPreInspectionRequirements(
    $postInspectionId: String!
  ) {
    createObservedExecutionRequirementsFromPreInspectionRequirements(
      postInspectionId: $postInspectionId
    ) {
      ...ObservedExecutionRequirementFragment
      observedRequirements {
        ...ObservedRequirementValueFragment
      }
    }
  }
  ${ObservedExecutionRequirementFragment}
  ${ObservedRequirementValueFragment}
`

export const updateObservedExecutionRequirementValuesMutation = gql`
  mutation updateObservedExecutionRequirementValues(
    $requirementId: String!
    $updateValues: [ObservedRequirementValueInput!]!
  ) {
    updateObservedExecutionRequirementValues(
      requirementId: $requirementId
      updateValues: $updateValues
    ) {
      id
      observedRequirements {
        ...ObservedRequirementValueFragment
      }
    }
  }
  ${ObservedRequirementValueFragment}
`

export const createExecutionRequirementForProcurementUnitMutation = gql`
  mutation createExecutionRequirementsForProcurementUnit(
    $procurementUnitId: String!
    $inspectionId: String!
  ) {
    createExecutionRequirementsForProcurementUnit(
      procurementUnitId: $procurementUnitId
      inspectionId: $inspectionId
    ) {
      id
      kilometersRequired
      area {
        id
        name
      }
      operator {
        id
        operatorIds
        operatorName
      }
      equipmentQuotas {
        id
        kilometerRequirement
        percentageQuota
        requirementOnly
        equipmentId
        equipment {
          ...EquipmentFragment
        }
      }
    }
  }
  ${EquipmentFragment}
`

export const removeExecutionRequirementsFromPostInspectionMutation = gql`
  mutation removeObservedExecutionRequirements($postInspectionId: String!) {
    removeObservedExecutionRequirementsFromPreInspection(postInspectionId: $postInspectionId)
  }
`

export const refreshExecutionRequirementForProcurementUnitMutation = gql`
  mutation refreshExecutionRequirementsForPreInspection($executionRequirementId: String!) {
    refreshExecutionRequirementForProcurementUnit(
      executionRequirementId: $executionRequirementId
    ) {
      id
      kilometersRequired
      area {
        id
        name
      }
      operator {
        id
        operatorIds
        operatorName
      }
      equipmentQuotas {
        id
        kilometerRequirement
        percentageQuota
        equipmentId
        requirementOnly
        equipment {
          ...EquipmentFragment
        }
      }
    }
  }
  ${EquipmentFragment}
`

export const removeExecutionRequirementMutation = gql`
  mutation removeExecutionRequirement($requirementId: String!) {
    removeUnitExecutionRequirement(executionRequirementId: $requirementId)
  }
`

export const removeAllEquipmentFromExecutionRequirement = gql`
  mutation removeAllEquipmentFromRequirement($requirementId: String!) {
    removeAllEquipmentFromExecutionRequirement(executionRequirementId: $requirementId) {
      id
      equipmentQuotas {
        id
        percentageQuota
        equipment {
          ...EquipmentFragment
        }
      }
    }
  }
  ${EquipmentFragment}
`

export const weeklyMetersFromJoreMutation = gql`
  mutation updateWeeklyExecutionMetersFromSource(
    $executionRequirementId: String!
    $date: String!
  ) {
    updateWeeklyExecutionMetersFromSource(
      executionRequirementId: $executionRequirementId
      date: $date
    ) {
      id
      kilometersRequired
    }
  }
`

export const executionSchemaStatsQuery = gql`
  query executionSchemaStats($requirementId: String!) {
    executionSchemaStats(executionRequirementId: $requirementId) {
      id
      procurementUnitId
      executionRequirementId
      dayTypeEquipment {
        dayType
        equipmentCount
        kilometers
      }
      equipmentTypes {
        equipmentCount
        equipmentType
        kilometers
      }
    }
  }
`
