import gql from 'graphql-tag'

export const executionRequirementsByProcurementUnitQuery = gql`
  query executionRequirementsByProcurementUnit($procurementUnitId: String!, $startDate: String!) {
    executionRequirementsByProcurementUnit(
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
        kilometersFulfilled
        quotaFulfilled
        differencePercentage
        cumulativeDifferencePercentage
        equipmentCount
      }
    }
  }
`

export const executionRequirementsByPreInspectionQuery = gql`
  query executionRequirementsByPreInspection($preInspectionId: String!) {
    executionRequirementsByPreInspection(preInspectionId: $preInspectionId) {
      totalKilometers
      averageAgeWeighted
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
      }
    }
  }
`
