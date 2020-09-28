import { gql } from '@apollo/client'
import { UserFragment } from '../common/query/authQueries'

export const inspectionFragment = gql`
  fragment InspectionFragment on Inspection {
    id
    name
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
    inspectionErrors {
      keys
      objects
      referenceKeys
      type
    }
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
      subscribed
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
  mutation submitInspection(
    $inspectionId: String!
    $startDate: BulttiDate!
    $endDate: BulttiDate!
  ) {
    submitInspection(inspectionId: $inspectionId, startDate: $startDate, endDate: $endDate) {
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

export const inspectionUserRelationsQuery = gql`
  query inspectionUserRelations($inspectionId: String!) {
    inspectionUserRelations(inspectionId: $inspectionId) {
      id
      createdAt
      updatedAt
      relatedBy
      subscribed
      inspection {
        id
      }
      user {
        ...UserFragment
      }
    }
  }
  ${UserFragment}
`

export const toggleUserInspectionSubscription = gql`
  mutation InspectionUserSubscribed($inspectionId: String!, $userId: String!) {
    toggleInspectionUserSubscribed(inspectionId: $inspectionId, userId: $userId) {
      id
      createdAt
      updatedAt
      relatedBy
      subscribed
      inspection {
        id
      }
      user {
        id
      }
    }
  }
`

export const removeInspectionMutation = gql`
  mutation removeInspection($inspectionId: String!) {
    removeInspection(inspectionId: $inspectionId)
  }
`
