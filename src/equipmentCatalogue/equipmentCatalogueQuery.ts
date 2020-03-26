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

export const updateEquipmentFromDepartures = gql`
  mutation populateCatalogueFromDepartures($preInspectionId: String!, $catalogueId: String!) {
    populateCatalogueFromDepartures(preInspectionId: $preInspectionId, catalogueId: $catalogueId) {
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
