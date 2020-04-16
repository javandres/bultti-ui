import gql from 'graphql-tag'
import { EquipmentFragment } from '../equipment/equipmentQuery'

export const executionRequirementForProcurementUnitQuery = gql`
  query executionRequirementForProcurementUnit(
    $procurementUnitId: String!
    $preInspectionId: String!
  ) {
    executionRequirementForProcurementUnit(
      procurementUnitId: $procurementUnitId
      preInspectionId: $preInspectionId
    ) {
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
      equipmentQuotas {
        id
        meterRequirement
        percentageQuota
        equipment {
          ...EquipmentFragment
        }
      }
      requirements {
        emissionClass
        kilometerRequirement
        kilometersFulfilled
        quotaRequirement
        quotaFulfilled
        equipmentCount
        equipmentCountFulfilled
      }
    }
  }
  ${EquipmentFragment}
`

export const executionRequirementsByPreInspectionQuery = gql`
  query executionRequirementsByPreInspection($preInspectionId: String!) {
    executionRequirementsByArea(preInspectionId: $preInspectionId) {
      id
      totalKilometers
      averageAgeWeighted
      averageAgeWeightedFulfilled
      totalKilometersFulfilled
      operator {
        id
        operatorId
        operatorName
      }
      area {
        id
        name
      }
      requirements {
        emissionClass
        kilometerRequirement
        quotaRequirement
        kilometersFulfilled
        quotaFulfilled
        differencePercentage
        cumulativeDifferencePercentage
        equipmentCount
        equipmentCountFulfilled
      }
    }
  }
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
