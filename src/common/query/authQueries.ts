import { gql } from '@apollo/client'

export const UserFragment = gql`
  fragment UserFragment on User {
    id
    email
    hslIdGroups
    name
    operatorIds
    organisation
    role
    inspectionRelations {
      id
      preInspection {
        id
      }
      postInspection {
        id
      }
    }
  }
`

export const loginMutation = gql`
  mutation login($authorizationCode: String!, $isTest: Boolean, $role: String) {
    login(authorizationCode: $authorizationCode, isTest: $isTest, role: $role)
  }
`

export const logoutMutation = gql`
  mutation logout {
    logout
  }
`

export const modifyUserMutation = gql`
  mutation modifyUser($userInput: UserInput!) {
    modifyUser(userInput: $userInput) {
      ...UserFragment
    }
  }
  ${UserFragment}
`

export const currentUserQuery = gql`
  query currentUser {
    currentUser {
      ...UserFragment
    }
  }
  ${UserFragment}
`
