import { gql } from '@apollo/client'
import { EquipmentFragment } from '../equipment/equipmentQuery'

export const ProcurementUnitFragment = gql`
  fragment ProcurementUnitFragment on ProcurementUnit {
    id
    procurementUnitId
    operatorId
    startDate
    endDate
    maximumAverageAge
    maximumAverageAgeWithOptions(startDate: $startDate)
    optionMaxAgeIncreaseMethod
    optionPeriodStart
    optionsUsed
    area {
      id
      name
    }
    routes {
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
  query procurementUnit(
    $procurementUnitId: String!
    $startDate: BulttiDate!
    $endDate: BulttiDate!
  ) {
    procurementUnit(
      procurementUnitId: $procurementUnitId
      startDate: $startDate
      endDate: $endDate
    ) {
      ...ProcurementUnitFragment
      equipmentCatalogues {
        id
        operatorId
        startDate
        endDate
        procurementUnitId
        operator {
          id
          operatorIds
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

// The IDE doesn't understand that the $startDate is used in the
// fragment and marks it as an error due to being unused.
// noinspection GraphQLSchemaValidation
export const updateProcurementUnitMutation = gql`
  mutation updateProcurementUnit(
    $updatedData: ProcurementUnitEditInput!
    $procurementUnitId: String!
    # Must have startDate for the calculated maximum average age.
    $startDate: BulttiDate!
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
