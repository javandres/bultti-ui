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
        id
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

export const removeAllEquipmentFromCatalogueMutation = gql`
  mutation removeAllEquipmentFromCatalogue($catalogueId: String!) {
    removeAllEquipmentFromCatalogue(catalogueId: $catalogueId) {
      id
      equipmentQuotas {
        id
        percentageQuota
      }
    }
  }
`
