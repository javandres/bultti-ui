import { gql } from '@apollo/client'

export const inspectionFragment = gql`
  fragment InspectionFragment on Inspection {
    id
    createdAt
    startDate
    endDate
    inspectionStartDate
    inspectionEndDate
    minStartDate
    version
    operatorId
    seasonId
    status
    inspectionType
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
  query currentInspectionsByOperatorAndSeason(
    $operatorId: Int!
    $seasonId: String!
    $inspectionType: InspectionType!
  ) {
    currentInspectionsByOperatorAndSeason(
      operatorId: $operatorId
      seasonId: $seasonId
      inspectionType: $inspectionType
    ) {
      ...InspectionFragment
    }
  }
  ${inspectionFragment}
`

export const inspectionsByOperatorQuery = gql`
  query inspectionsByOperator($operatorId: Int!, $inspectionType: InspectionType!) {
    inspectionsByOperator(operatorId: $operatorId, inspectionType: $inspectionType) {
      ...InspectionFragment
    }
  }
  ${inspectionFragment}
`

export const createInspectionMutation = gql`
  mutation createInspection($inspectionInput: InitialInspectionInput!) {
    createInspection(inspection: $inspectionInput) {
      ...InspectionFragment
    }
  }
  ${inspectionFragment}
`

export const updateInspectionMutation = gql`
  mutation updateInspection($inspectionId: String!, $inspectionInput: InspectionInput!) {
    updateInspection(inspectionId: $inspectionId, inspection: $inspectionInput) {
      ...InspectionFragment
    }
  }
  ${inspectionFragment}
`

export const submitInspectionMutation = gql`
  mutation submitInspection($inspectionId: String!) {
    submitInspection(inspectionId: $inspectionId) {
      ...InspectionFragment
    }
  }
  ${inspectionFragment}
`

export const publishInspectionMutation = gql`
  mutation publishInspection($inspectionId: String!) {
    publishInspection(inspectionId: $inspectionId) {
      ...InspectionFragment
    }
  }
  ${inspectionFragment}
`

export const rejectInspectionMutation = gql`
  mutation rejectInspection($inspectionId: String!) {
    rejectInspection(inspectionId: $inspectionId) {
      ...InspectionFragment
    }
  }
  ${inspectionFragment}
`

export const removeInspectionMutation = gql`
  mutation removeInspection($inspectionId: String!) {
    removeInspection(inspectionId: $inspectionId)
  }
`
