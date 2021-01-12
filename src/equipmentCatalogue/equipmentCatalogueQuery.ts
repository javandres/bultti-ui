import { gql } from '@apollo/client'
import { EquipmentFragment } from '../equipment/equipmentQuery'

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
      operatorId
      operator {
        id
        operatorId
        operatorName
      }
      equipmentQuotas {
        id
        percentageQuota
        catalogueStartDate
        catalogueEndDate
        equipmentId
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
        equipment {
          ...EquipmentFragment
        }
      }
    }
  }
  ${EquipmentFragment}
`

export const removeEquipmentCatalogueMutation = gql`
  mutation removeEquipmentCatalogue($catalogueId: String!) {
    removeEquipmentCatalogue(catalogueId: $catalogueId)
  }
`
