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
      area {
        id
        name
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
`

export const executionRequirementsByPreInspectionQuery = gql`
  query executionRequirementsByPreInspection($preInspectionId: String!) {
    executionRequirementsByPreInspection(preInspectionId: $preInspectionId) {
      id
      totalKilometers
      averageAgeWeighted
      averageAgeWeightedFulfilled
      totalKilometersFulfilled
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
