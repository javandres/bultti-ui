import { gql } from '@apollo/client'
import { EquipmentFragment } from '../equipment/equipmentQuery'

export const RequirementValueFragment = gql`
  fragment RequirementValueFragment on ExecutionRequirementValue {
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
  fragment ObservedRequirementValueFragment on ObservedExecutionValue {
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
    averageAgeWeightedObserved
    equipmentCountObserved
    equipmentCountRequired
  }
`

export const ExecutionRequirementFragment = gql`
  fragment ExecutionRequirementFragment on ExecutionRequirement {
    id
    totalKilometers
    totalKilometersFulfilled
    averageAgeWeighted
    averageAgeWeightedFulfilled
    operator {
      id
      operatorId
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
    averageAgeWeightedObserved
    averageAgeWeightedRequired
    totalKilometersObserved
    totalKilometersRequired
    area {
      id
      name
    }
    inspection {
      id
    }
    operator {
      id
      operatorId
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
      ...ExecutionRequirementFragment
      equipmentQuotas {
        id
        meterRequirement
        percentageQuota
        equipment {
          ...EquipmentFragment
        }
      }
      requirements {
        ...RequirementValueFragment
      }
    }
  }
  ${ExecutionRequirementFragment}
  ${EquipmentFragment}
  ${RequirementValueFragment}
`

export const executionRequirementsForAreaQuery = gql`
  query executionRequirementsByPreInspection($inspectionId: String!) {
    executionRequirementsForPreInspectionAreas(inspectionId: $inspectionId) {
      ...ExecutionRequirementFragment
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
  ${ExecutionRequirementFragment}
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
      area {
        id
        name
      }
      operator {
        id
        operatorId
        operatorName
      }
      equipmentQuotas {
        id
        meterRequirement
        percentageQuota
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
  mutation($postInspectionId: String!) {
    removeObservedExecutionRequirementsFromPreInspection(postInspectionId: $postInspectionId)
  }
`

export const refreshExecutionRequirementForProcurementUnitMutation = gql`
  mutation refreshExecutionRequirementsForPreInspection($executionRequirementId: String!) {
    refreshExecutionRequirementForProcurementUnit(
      executionRequirementId: $executionRequirementId
    ) {
      id
      area {
        id
        name
      }
      operator {
        id
        operatorId
        operatorName
      }
      equipmentQuotas {
        id
        meterRequirement
        percentageQuota
        equipmentId
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
    removeExecutionRequirement(executionRequirementId: $requirementId) {
      id
      equipmentQuotas {
        id
        meterRequirement
        percentageQuota
        equipment {
          ...EquipmentFragment
        }
      }
    }
  }
`

export const removeAllEquipmentFromExecutionRequirement = gql`
  mutation removeAllEquipmentFromRequirement($requirementId: String!) {
    removeAllEquipmentFromExecutionRequirement(executionRequirementId: $requirementId) {
      id
      equipmentQuotas {
        id
        meterRequirement
        percentageQuota
        equipment {
          ...EquipmentFragment
        }
      }
    }
  }
`
