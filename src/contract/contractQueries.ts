import { gql } from '@apollo/client'

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
      id
      relatedBy
      createdAt
      updatedAt
      user {
        id
        email
      }
    }
    rules {
      name
      type
      value
      description
    }
  }
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