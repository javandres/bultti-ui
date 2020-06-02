import { gql } from '@apollo/client'

const UserFragment = gql`
  fragment UserFragment on User {
    id
    email
    hslIdGroups
    name
    operatorIds
    organisation
    role
  }
`

export const loginMutation = gql`
  mutation login($authorizationCode: String!, $isTest: Boolean) {
    login(authorizationCode: $authorizationCode, isTest: $isTest)
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
