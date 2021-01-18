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
    rulesFile
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
      areaId
      area {
        id
        name
      }
      routes {
        routeId
      }
    }
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
  query contracts($operatorId: Int) {
    contracts(operatorId: $operatorId) {
      ...ContractFragment
    }
  }
  ${ContractFragment}
`

export const procurementUnitOptionsQuery = gql`
  query contractProcurementUnitOptions(
    $operatorId: Int!
    $startDate: BulttiDate!
    $endDate: BulttiDate!
  ) {
    contractProcurementUnitOptions(
      operatorId: $operatorId
      startDate: $startDate
      endDate: $endDate
    ) {
      id
      name
      startDate
      endDate
      routes
      areaName
      currentContracts {
        id
        startDate
        endDate
      }
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
