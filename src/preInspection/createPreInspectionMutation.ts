import gql from 'graphql-tag'

export const createPreInspectionMutation = gql`
  mutation createPreInspection($preInspectionInput: PreInspectionInput!) {
    createPreInspection(preInspection: $preInspectionInput) {
      id
      createdAt
      startDate
      endDate
      operatorId
      status
      operator {
        id
        operatorId
        operatorName
      }
      season {
        id
        season
        startDate
        endDate
      }
    }
  }
`

export const updatePreInspectionMutation = gql`
  mutation updatePreInspection(
    $preInspectionId: String!
    $preInspectionInput: PreInspectionInput!
  ) {
    updatePreInspection(preInspectionId: $preInspectionId, preInspection: $preInspectionInput) {
      id
      createdAt
      startDate
      endDate
      operatorId
      status
      operator {
        id
        operatorId
        operatorName
      }
      season {
        id
        season
        startDate
        endDate
      }
    }
  }
`
