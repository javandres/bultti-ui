import gql from 'graphql-tag'

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
      }
    }
  }
`
