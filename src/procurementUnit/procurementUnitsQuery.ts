import gql from 'graphql-tag'
import { EquipmentFragment } from '../equipmentCatalogue/equipmentQuery'

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
  }
`

export const procurementUnitsQuery = gql`
  query procurementUnitsByOperator($operatorId: Int!, $startDate: BulttiDateTime!) {
    procurementUnitsByOperator(operatorId: $operatorId, date: $startDate) {
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
        equipmentQuotas {
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
    updateProcurementUnit(procurementUnit: $updatedData, procurementUnitId: $procurementUnitId) {
      ...ProcurementUnitFragment
    }
  }
  ${ProcurementUnitFragment}
`

export const weeklyMetersFromJOREMutation = gql`
  mutation updateWeeklyMetersFromSource($procurementUnitId: String!) {
    updateWeeklyMetersFromSource(procurementUnitId: $procurementUnitId) {
      id
      weeklyMeters
      weeklyKilometers
    }
  }
`
