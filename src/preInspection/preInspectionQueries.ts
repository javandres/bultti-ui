import { gql } from '@apollo/client'

export const preInspectionFragment = gql`
  fragment PreInspectionFragment on PreInspection {
    id
    createdAt
    startDate
    endDate
    minStartDate
    version
    operatorId
    seasonId
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

export const currentPreInspectionsByOperatorAndSeasonQuery = gql`
  query currentPreInspectionsByOperatorAndSeason($operatorId: Int!, $seasonId: String!) {
    currentPreInspectionsByOperatorAndSeason(operatorId: $operatorId, seasonId: $seasonId) {
      ...PreInspectionFragment
    }
  }
  ${preInspectionFragment}
`

export const preInspectionsByOperatorQuery = gql`
  query preInspectionsByOperator($operatorId: Int!) {
    preInspectionsByOperator(operatorId: $operatorId) {
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
    updatePreInspection(
      preInspectionId: $preInspectionId
      preInspection: $preInspectionInput
    ) {
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
