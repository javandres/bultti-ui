import gql from 'graphql-tag'
import { EquipmentFragment } from '../equipmentCatalogue/equipmentQuery'

export const executionRequirementsByProcurementUnitQuery = gql`
  query executionRequirementsByProcurementUnit($procurementUnitId: String!, $startDate: String!) {
    executionRequirementForProcurementUnit(
      procurementUnitId: $procurementUnitId
      startDate: $startDate
    ) {
      totalKilometers
      averageAgeWeighted
      area {
        id
        name
      }
      procurementUnit {
        id
      }
      requirements {
        emissionClass
        kilometerRequirement
        quotaRequirement
        equipmentCount
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
