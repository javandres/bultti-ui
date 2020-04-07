import gql from 'graphql-tag'

export const preInspectionFragment = gql`
  fragment PreInspectionFragment on PreInspection {
    id
    createdAt
    startDate
    endDate
    version
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
  query preInspectionById($preInspectionId: String!) {
    preInspection(preInspectionId: $preInspectionId) {
      ...PreInspectionFragment
    }
  }
  ${preInspectionFragment}
`

export const preInspectionsByOperatorAndSeasonQuery = gql`
  query preInspectionsByOperatorAndSeason($operatorId: Int!, $seasonId: String!) {
    preInspectionsByOperatorAndSeason(operatorId: $operatorId, seasonId: $seasonId) {
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

export const publishPreInspectionMutation = gql`
  mutation publishPreInspection($preInspectionId: String!) {
    publishPreInspection(preInspectionId: $preInspectionId) {
      ...PreInspectionFragment
    }
  }
  ${preInspectionFragment}
`

export const removePreInspectionMutation = gql`
  mutation removePreInspection($preInspectionId: String!) {
    removePreInspection(preInspectionId: $preInspectionId)
  }
`
