import { gql } from '@apollo/client'
import { UserFragment } from '../common/query/authQueries'

export const ContractUserRelationFragment = gql`
  fragment ContractUserRelationFragment on ContractUserRelation {
    id
    createdAt
    updatedAt
    relatedBy
    subscribed
    contract {
      id
    }
    user {
      ...UserFragment
    }
  }
  ${UserFragment}
`

export const ContractFragment = gql`
  fragment ContractFragment on Contract {
    id
    description
    createdAt
    updatedAt
    rulesFile
    userRelations {
      ...ContractUserRelationFragment
    }
    rules {
      name
      value
      condition
      category
      code
    }
  }
  ${ContractUserRelationFragment}
`

export const contractQuery = gql`
  query contract($contractId: String!) {
    contract(contractId: $contractId) {
      ...ContractFragment
    }
  }
  ${ContractFragment}
`

export const contractsQuery = gql`
  query contracts {
    contracts {
      ...ContractFragment
    }
  }
  ${ContractFragment}
`

export const contractOptionsQuery = gql`
  query contracts {
    contracts {
      id
      description
      createdAt
      updatedAt
    }
  }
`

export const modifyContractMutation = gql`
  mutation modifyContract($file: Upload, $contractInput: ContractInput!) {
    modifyContract(file: $file, contractInput: $contractInput) {
      ...ContractFragment
    }
  }
  ${ContractFragment}
`

export const createContractMutation = gql`
  mutation createContract($file: Upload!, $contractInput: ContractInput!) {
    createContract(file: $file, contractInput: $contractInput) {
      ...ContractFragment
    }
  }
  ${ContractFragment}
`

export const contractUserRelationsQuery = gql`
  query contractUserRelations($contractId: String!) {
    contractUserRelations(contractId: $contractId) {
      ...ContractUserRelationFragment
    }
  }
  ${ContractUserRelationFragment}
`

export const toggleContractUserSubscription = gql`
  mutation toggleContractUserSubscribed($contractId: String!, $userId: String!) {
    toggleContractUserSubscribed(contractId: $contractId, userId: $userId) {
      ...ContractUserRelationFragment
    }
  }
  ${ContractUserRelationFragment}
`

export const removeContractMutation = gql`
  mutation removeContract($contractId: String!) {
    removeContract(contractId: $contractId)
  }
`
