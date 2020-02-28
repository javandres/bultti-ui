import gql from 'graphql-tag'

export const createPreInspectionMutation = gql`
  mutation createPreInspection {
    createPreInspection {
      id
      createdAt
      createdBy
      status
    }
  }
`
