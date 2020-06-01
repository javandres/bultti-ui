import { gql } from '@apollo/client'

export const inspectionFragment = gql`
  fragment InspectionFragment on Inspection {
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
    userRelations {
      id
      createdAt
      updatedAt
      relatedBy
      user {
        id
        email
        name
        organisation
        role
      }
    }
  }
`

export const inspectionQuery = gql`
  query inspectionById($inspectionId: String!) {
    inspection(inspectionId: $inspectionId) {
      ...InspectionFragment
    }
  }
  ${inspectionFragment}
`

export const currentPreInspectionsByOperatorAndSeasonQuery = gql`
  query currentPreInspectionsByOperatorAndSeason($operatorId: Int!, $seasonId: String!) {
    currentPreInspectionsByOperatorAndSeason(operatorId: $operatorId, seasonId: $seasonId) {
      ...InspectionFragment
    }
  }
  ${inspectionFragment}
`

export const inspectionsByOperatorQuery = gql`
  query inspectionsByOperator($operatorId: Int!) {
    inspectionsByOperator(operatorId: $operatorId) {
      ...InspectionFragment
    }
  }
  ${inspectionFragment}
`

export const createPreInspectionMutation = gql`
  mutation createPreInspection($inspectionInput: InitialPreInspectionInput!) {
    createPreInspection(inspection: $inspectionInput) {
      ...InspectionFragment
    }
  }
  ${inspectionFragment}
`

export const updatePreInspectionMutation = gql`
  mutation updatePreInspection($inspectionId: String!, $inspectionInput: PreInspectionInput!) {
    updatePreInspection(inspectionId: $inspectionId, inspection: $inspectionInput) {
      ...InspectionFragment
    }
  }
  ${inspectionFragment}
`

export const publishPreInspectionMutation = gql`
  mutation publishPreInspection($inspectionId: String!) {
    publishPreInspection(inspectionId: $inspectionId) {
      ...InspectionFragment
    }
  }
  ${inspectionFragment}
`

export const removePreInspectionMutation = gql`
  mutation removePreInspection($inspectionId: String!) {
    removePreInspection(inspectionId: $inspectionId)
  }
`
