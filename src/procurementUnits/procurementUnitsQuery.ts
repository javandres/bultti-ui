import gql from 'graphql-tag'
import { EquipmentFragment } from './equipmentQuery'

export const ProcurementUnitFragment = gql`
  fragment ProcurementUnitFragment on ProcurementUnit {
    id
    procurementUnitId
    operatorId
    operationEndDate
    operationStartDate
    startDate
    endDate
    weeklyMeters
    weeklyKilometers
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
  query procurementUnits($operatorId: Int!, $startDate: DateTime!) {
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
