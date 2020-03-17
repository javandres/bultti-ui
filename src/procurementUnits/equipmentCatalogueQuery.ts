import gql from 'graphql-tag'
import { EquipmentFragment } from './equipmentQuery'

export const createEquipmentCatalogueMutation = gql`
  mutation createEquipmentCatalogueMutation(
    $catalogueData: EquipmentCatalogueInput!
    $operatorId: Int!
    $procurementUnitId: String!
  ) {
    createEquipmentCatalogue(
      equipmentCatalogue: $catalogueData
      operatorId: $operatorId
      procurementUnitId: $procurementUnitId
    ) {
      id
      startDate
      endDate
      equipmentQuotas {
        percentageQuota
        equipment {
          ...EquipmentFragment
        }
      }
    }
  }
  ${EquipmentFragment}
`

export const updateEquipmentCatalogueMutation = gql`
  mutation updateEquipmentCatalogueMutation(
    $catalogueData: EquipmentCatalogueInput!
    $catalogueId: String!
  ) {
    updateEquipmentCatalogue(equipmentCatalogue: $catalogueData, catalogueId: $catalogueId) {
      id
      startDate
      endDate
    }
  }
`
