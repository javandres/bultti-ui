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
    }
  }
  ${ExecutionRequirementFragment}
  ${RequirementValueFragment}
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
