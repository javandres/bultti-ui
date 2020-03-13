import gql from 'graphql-tag'
import { EquipmentFragment } from './equipmentQuery'

export const createEquipmentCatalogueMutation = gql`
  mutation createEquipmentCatalogueMutation(
    $catalogue: EquipmentCatalogueInput!
    $operatorId: Int!
    $procurementUnitId: String!
  ) {
    createEquipmentCatalogue(
      equipmentCatalogue: $catalogue
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
