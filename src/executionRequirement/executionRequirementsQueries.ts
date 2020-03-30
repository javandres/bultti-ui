import gql from 'graphql-tag'

export const executionRequirementsByProcurementUnitQuery = gql`
  query executionRequirementsByProcurementUnit($procurementUnitId: String!, $startDate: String!) {
    executionRequirementsByProcurementUnit(
      procurementUnitId: $procurementUnitId
      startDate: $startDate
    ) {
      area {
        id
        name
      }
      procurementUnit {
        id
      }
      requirements {
        emissionClass
        totalKilometers
        kilometerRequirement
        quotaRequirement
        kilometersFulfilled
        quotaFulfilled
        differencePercentage
        cumulativeDifferencePercentage
        averageAgeWeighted
      }
    }
  }
`

export const executionRequirementsByPreInspectionQuery = gql`
  query executionRequirementsByPreInspection($preInspectionId: String!) {
    executionRequirementsByPreInspection(preInspectionId: $preInspectionId) {
      area {
        id
        name
      }
      requirements {
        emissionClass
        totalKilometers
        kilometerRequirement
        quotaRequirement
        kilometersFulfilled
        quotaFulfilled
        differencePercentage
        cumulativeDifferencePercentage
        averageAgeWeighted
      }
    }
  }
`
