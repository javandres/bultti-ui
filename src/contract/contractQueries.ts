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
    startDate
    endDate
    createdAt
    updatedAt
    operatorId
    operator {
      id
      operatorId
      operatorName
    }
    procurementUnits {
      id
      procurementUnitId
      startDate
      endDate
      weeklyKilometers
      areaId
      area {
        id
        name
      }
      routes {
        length
        routeId
      }
    }
    userRelations {
      ...ContractUserRelationFragment
    }
    rules {
      name
      type
      value
      description
      condition
      options
      category
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
  query contracts($operatorId: Int) {
    contracts(operatorId: $operatorId) {
      ...ContractFragment
    }
  }
  ${ContractFragment}
`

export const procurementUnitOptionsQuery = gql`
  query contractProcurementUnitOptions($operatorId: Int!, $date: BulttiDate!) {
    contractProcurementUnitOptions(operatorId: $operatorId, date: $date) {
      id
      name
      startDate
      endDate
      routes
      medianAgeRequirement
      areaName
      currentContractId
      currentContractStart
      currentContractEnd
    }
  }
`

export const defaultContractRulesQuery = gql`
  query defaultContractRules {
    defaultContractRules {
      name
      category
      condition
      description
      options
      type
      value
    }
  }
`

export const modifyContractMutation = gql`
  mutation modifyContract($contractInput: ContractInput!) {
    modifyContract(contractInput: $contractInput) {
      ...ContractFragment
    }
  }
  ${ContractFragment}
`

export const createContractMutation = gql`
  mutation createContract($contractInput: ContractInput!) {
    createContract(contractInput: $contractInput) {
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
