import gql from 'graphql-tag'

export const createPreInspectionMutation = gql`  
  mutation createPreInspection($preInspectionInput: PreInspectionInput!) {
    createPreInspection(preInspection: $preInspectionInput) {
      id
      createdAt
      startDate
      endDate
      operatorId
      productionStart
      productionEnd
      season {
        id
        season
      }
      status
    }
  }
`
