import { gql } from '@apollo/client'
import { UserFragment } from '../common/query/authQueries'
import { InspectionType } from '../schema-types'
import { DocumentNode } from 'graphql'
import { lowerCase } from 'lodash'

function createInspectionQuery(
  queryFn: (
    prefix: string,
    capitalizedPrefix: string,
    inspectionType: InspectionType
  ) => DocumentNode
) {
  return (inspectionType: InspectionType) => {
    let inspectionTypePrefix = inspectionType === InspectionType.Pre ? 'Pre' : 'Post'
    return queryFn(lowerCase(inspectionTypePrefix), inspectionTypePrefix, inspectionType)
  }
}

export const CommonInspectionFields = `
id
inspectionType
name
createdAt
updatedAt
startDate
endDate
inspectionStartDate
inspectionEndDate
version
status
minStartDate
operatorId
seasonId
operator {
  id
  operatorName
}
season {
  id
  season
  startDate
  endDate
}
`

export const lightInspectionFragment = createInspectionQuery(
  (prefix, capitalizedPrefix) => gql`
  fragment Light${capitalizedPrefix}InspectionFragment on ${capitalizedPrefix}Inspection {
    ${CommonInspectionFields}
  }
`
)

export const inspectionFragment = createInspectionQuery(
  (prefix, capitalizedPrefix, inspectionType: InspectionType) => gql`
  fragment ${capitalizedPrefix}InspectionFragment on ${capitalizedPrefix}Inspection {
    ${CommonInspectionFields}
    ${
      inspectionType === InspectionType.Post
        ? `
      linkedInspectionUpdateAvailable
      linkedInspections {
        inspection {
          id
          startOfWeek
          ...LightPreInspectionFragment
        }
      }
    `
        : ''
    }
    inspectionErrors {
      keys
      objectId
      referenceKeys
      type
    }
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
  ${inspectionType === InspectionType.Post ? lightInspectionFragment(InspectionType.Pre) : ''}
`
)

export const inspectionQuery = createInspectionQuery(
  (prefix, capitalizedPrefix, inspectionType) => gql`
  query ${prefix}InspectionById($inspectionId: String!) {
    ${prefix}Inspection(inspectionId: $inspectionId) {
      ...${capitalizedPrefix}InspectionFragment
    }
  }
  ${inspectionFragment(inspectionType)}
  ${inspectionType === InspectionType.Post ? lightInspectionFragment(InspectionType.Pre) : ''}
`
)

export const anyInspectionQuery = gql`
  query anyInspectionById($inspectionId: String!) {
    anyInspectionById(inspectionId: $inspectionId) {
      ... on PreInspection {
        ...PreInspectionFragment
      }
      ... on PostInspection {
        ...PostInspectionFragment
      }
    }
  }
  ${inspectionFragment(InspectionType.Pre)}
  ${inspectionFragment(InspectionType.Post)}
`

export const currentInspectionsByOperatorAndSeasonQuery = createInspectionQuery(
  (prefix, capitalizedPrefix, inspectionType) => gql`
  query current${capitalizedPrefix}InspectionsByOperatorAndSeason(
    $operatorId: Int!
    $seasonId: String!
  ) {
    current${capitalizedPrefix}InspectionsByOperatorAndSeason(
      operatorId: $operatorId
      seasonId: $seasonId
    ) {
      ...Light${capitalizedPrefix}InspectionFragment
    }
  }
  ${lightInspectionFragment(inspectionType)}
`
)

export const inspectionsByOperatorQuery = createInspectionQuery(
  (prefix, capitalizedPrefix, inspectionType) => gql`
  query ${prefix}InspectionsByOperator($operatorId: Int!) {
    ${prefix}InspectionsByOperator(operatorId: $operatorId) {
      ...Light${capitalizedPrefix}InspectionFragment
    }
  }
  ${lightInspectionFragment(inspectionType)}
`
)

export const inspectionsTimelineByOperatorQuery = gql`
  query inspectionsTimeline($operatorId: Int!, $inspectionType: InspectionType!) {
    inspectionsTimeline(operatorId: $operatorId, inspectionType: $inspectionType) {
      id
      inspectionStartDate
      inspectionEndDate
      operatorName
      seasonId
      version
    }
  }
`

export const initInspectionContractUnitMap = gql`
  mutation initInspectionContractUnitMap($inspectionId: String!) {
    initInspectionContractUnitMap(inspectionId: $inspectionId)
  }
`

export const createInspectionMutation = createInspectionQuery(
  (prefix, capitalizedPrefix, inspectionType) => gql`
  mutation create${capitalizedPrefix}Inspection($inspectionInput: InitialInspectionInput!) {
    create${capitalizedPrefix}Inspection(inspection: $inspectionInput) {
      ...${capitalizedPrefix}InspectionFragment
    }
  }
  ${inspectionFragment(inspectionType)}
`
)

export const updateInspectionMutation = createInspectionQuery(
  (prefix, capitalizedPrefix, inspectionType) => gql`
  mutation update${capitalizedPrefix}Inspection($inspectionId: String!, $inspectionInput: InspectionInput!) {
    update${capitalizedPrefix}Inspection(inspectionId: $inspectionId, inspection: $inspectionInput) {
      ...${capitalizedPrefix}InspectionFragment
    }
  }
  ${inspectionFragment(inspectionType)}
`
)

export const updateLinkedInspectionsMutation = gql`
  mutation updateLinkedInspections($inspectionId: String!) {
    updateLinkedInspection(inspectionId: $inspectionId) {
      ...PostInspectionFragment
    }
  }
  ${inspectionFragment(InspectionType.Post)}
`

export const submitInspectionMutation = createInspectionQuery(
  (prefix, capitalizedPrefix, inspectionType) => gql`
  mutation submit${capitalizedPrefix}Inspection(
    $inspectionId: String!
    $startDate: BulttiDate!
    $endDate: BulttiDate!
  ) {
    submit${capitalizedPrefix}Inspection(inspectionId: $inspectionId, startDate: $startDate, endDate: $endDate) {
      ...${capitalizedPrefix}InspectionFragment
    }
  }
  ${inspectionFragment(inspectionType)}
`
)

export const makePostInspectionSanctionableMutation = gql`
  mutation postInspectionSanctionable($inspectionId: String!) {
    inspectionSanctionable(inspectionId: $inspectionId) {
      ...PostInspectionFragment
    }
  }
  ${inspectionFragment(InspectionType.Post)}
`

export const publishInspectionMutation = createInspectionQuery(
  (prefix, capitalizedPrefix, inspectionType) => gql`
  mutation publish${capitalizedPrefix}Inspection($inspectionId: String!) {
    publish${capitalizedPrefix}Inspection(inspectionId: $inspectionId) {
      ...${capitalizedPrefix}InspectionFragment
    }
  }
  ${inspectionFragment(inspectionType)}
`
)

export const rejectInspectionMutation = createInspectionQuery(
  (prefix, capitalizedPrefix, inspectionType) => gql`
  mutation reject${capitalizedPrefix}Inspection($inspectionId: String!) {
    reject${capitalizedPrefix}Inspection(inspectionId: $inspectionId) {
      ...${capitalizedPrefix}InspectionFragment
    }
  }
  ${inspectionFragment(inspectionType)}
`
)

export const inspectionUserRelationsQuery = gql`
  query inspectionUserRelations($inspectionId: String!) {
    inspectionUserRelations(inspectionId: $inspectionId) {
      id
      createdAt
      updatedAt
      relatedBy
      subscribed
      preInspection {
        id
      }
      postInspection {
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
      preInspection {
        id
      }
      postInspection {
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

// This returns an abbreviated InspectionStatusUpdate object masquerading
// as an Inspection to facilitate easier Apollo cache updates.
export const inspectionStatusSubscription = gql`
  subscription inspectionStatus($inspectionId: String!) {
    inspectionStatus(inspectionId: $inspectionId) {
      id
      status
      startDate
      endDate
      inspectionStartDate
      inspectionEndDate
      version
    }
  }
`

export const inspectionErrorSubscription = gql`
  subscription inspectionError($inspectionId: String!) {
    inspectionError(inspectionId: $inspectionId) {
      id
      status
      errorType
      message
    }
  }
`
