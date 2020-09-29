import { gql } from '@apollo/client'
import { EquipmentFragment } from '../equipment/equipmentQuery'

export const ProcurementUnitFragment = gql`
  fragment ProcurementUnitFragment on ProcurementUnit {
    id
    procurementUnitId
    operatorId
    startDate
    endDate
    weeklyMeters
    weeklyKilometers
    medianAgeRequirement
    area {
      id
      name
    }
    routes {
      length
      routeId
    }
    currentContracts {
      id
      operatorId
      createdAt
      updatedAt
      description
      startDate
      endDate
    }
  }
`

export const procurementUnitsQuery = gql`
  query procurementUnitsByOperator(
    $operatorId: Int!
    $startDate: BulttiDate!
    $endDate: BulttiDate!
  ) {
    procurementUnitsByOperator(
      operatorId: $operatorId
      startDate: $startDate
      endDate: $endDate
    ) {
      ...ProcurementUnitFragment
    }
  }
  ${ProcurementUnitFragment}
`

export const procurementUnitQuery = gql`
  query procurementUnit($procurementUnitId: String!) {
    procurementUnit(procurementUnitId: $procurementUnitId) {
      ...ProcurementUnitFragment
      equipmentCatalogues {
        id
        operatorId
        startDate
        endDate
        procurementUnitId
        operator {
          id
          operatorId
          operatorName
        }
        equipmentQuotas {
          id
          percentageQuota
          equipment {
            ...EquipmentFragment
          }
        }
      }
    }
  }
  ${ProcurementUnitFragment}
  ${EquipmentFragment}
`

export const updateProcurementUnitMutation = gql`
  mutation updateProcurementUnit(
    $updatedData: ProcurementUnitEditInput!
    $procurementUnitId: String!
  ) {
    updateProcurementUnit(
      procurementUnit: $updatedData
      procurementUnitId: $procurementUnitId
    ) {
      ...ProcurementUnitFragment
    }
  }
  ${ProcurementUnitFragment}
`

export const weeklyMetersFromJoreMutation = gql`
  mutation updateWeeklyMetersFromSource($procurementUnitId: String!, $startDate: String!) {
    updateWeeklyMetersFromSource(
      procurementUnitId: $procurementUnitId
      startDate: $startDate
    ) {
      id
      weeklyMeters
      weeklyKilometers
    }
  }
`
