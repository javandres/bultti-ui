import gql from 'graphql-tag'
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

export const executionRequirementForProcurementUnitQuery = gql`
  query executionRequirementForProcurementUnit(
    $procurementUnitId: String!
    $preInspectionId: String!
  ) {
    executionRequirementForProcurementUnit(
      procurementUnitId: $procurementUnitId
      preInspectionId: $preInspectionId
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

export const executionRequirementsByAreaQuery = gql`
  query executionRequirementsByPreInspection($preInspectionId: String!) {
    executionRequirementsForPreInspectionAreas(preInspectionId: $preInspectionId) {
      ...ExecutionRequirementFragment
      requirements {
        ...RequirementValueFragment
      }
    }
  }
  ${ExecutionRequirementFragment}
  ${RequirementValueFragment}
`

export const createExecutionRequirementsForPreInspectionMutation = gql`
  mutation createExecutionRequirementsForPreInspection($preInspectionId: String!) {
    createExecutionRequirementsForPreInspection(preInspectionId: $preInspectionId) {
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
      requirements {
        ...RequirementValueFragment
      }
      procurementUnitRequirements {
        id
        area {
          id
          name
        }
        equipmentQuotas {
          equipment {
            ...EquipmentFragment
          }
          meterRequirement
          percentageQuota
        }
      }
    }
  }
  ${EquipmentFragment}
  ${RequirementValueFragment}
`

export const createExecutionRequirementForProcurementUnitMutation = gql`
  mutation createExecutionRequirementsForPreInspection(
    $procurementUnitId: String!
    $preInspectionId: String!
  ) {
    createExecutionRequirementsForProcurementUnit(
      procurementUnitId: $procurementUnitId
      preInspectionId: $preInspectionId
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
    removeExecutionRequirement(executionRequirementId: $requirementId)
  }
`

export const removeRequirementEquipmentMutation = gql`
  mutation removeEquipmentFromRequirement($equipmentId: String!, $requirementId: String!) {
    removeEquipmentFromExecutionRequirement(
      equipmentId: $equipmentId
      executionRequirementId: $requirementId
    )
  }
`

export const removeAllEquipmentFromExecutionRequirement = gql`
  mutation removeAllEquipmentFromRequirement($requirementId: String!) {
    removeAllEquipmentFromExecutionRequirement(executionRequirementId: $requirementId) {
      id
      equipmentQuotas {
        id
        percentageQuota
      }
    }
  }
`
