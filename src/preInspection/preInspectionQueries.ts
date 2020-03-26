import gql from 'graphql-tag'

export const preInspectionFragment = gql`
  fragment PreInspectionFragment on PreInspection {
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
    updatedAt
    createdAt
    createdBy {
      id
      name
      organisation
      email
    }
  }
`

export const preInspectionQuery = gql`
  query preInspectionByOperatorAndSeason($operatorId: Int!, $seasonId: String!) {
    preInspectionByOperatorAndSeason(operatorId: $operatorId, seasonId: $seasonId) {
      ...PreInspectionFragment
    }
  }
  ${preInspectionFragment}
`

export const createPreInspectionMutation = gql`
  mutation createPreInspection($preInspectionInput: InitialPreInspectionInput!) {
    createPreInspection(preInspection: $preInspectionInput) {
      ...PreInspectionFragment
    }
  }
  ${preInspectionFragment}
`

export const updatePreInspectionMutation = gql`
  mutation updatePreInspection(
    $preInspectionId: String!
    $preInspectionInput: PreInspectionInput!
  ) {
    updatePreInspection(preInspectionId: $preInspectionId, preInspection: $preInspectionInput) {
      ...PreInspectionFragment
    }
  }
  ${preInspectionFragment}
`
