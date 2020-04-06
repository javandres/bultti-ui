import gql from 'graphql-tag'

export const EquipmentFragment = gql`
  fragment EquipmentFragment on Equipment {
    id
    model
    operatorId
    registryDate
    registryNr
    emissionClass
    exteriorColor
    vehicleId
    type
  }
`

export const searchEquipmentQuery = gql`
  query queryEquipmentFromSource($vehicleId: String, $registryNr: String, $operatorId: Int!) {
    queryEquipmentFromSource(
      operatorId: $operatorId
      vehicleId: $vehicleId
      registryNr: $registryNr
    ) {
      type
      exteriorColor
      model
      registryDate
      registryNr
      emissionClass
      vehicleId
      _exists
    }
  }
`

export const createEquipmentMutation = gql`
  mutation createEquipmentMutation(
    $operatorId: Int!
    $equipmentInput: EquipmentInput!
    $catalogueId: String!
  ) {
    createEquipment(
      operatorId: $operatorId
      equipment: $equipmentInput
      catalogueId: $catalogueId
    ) {
      ...EquipmentFragment
    }
  }
  ${EquipmentFragment}
`

export const updateEquipmentMutation = gql`
  mutation updateEquipmentFromCatalogue(
    $equipmentId: String!
    $equipmentInput: EquipmentInput!
    $quotaId: String!
  ) {
    updateEquipment(equipmentId: $equipmentId, equipment: $equipmentInput, quotaId: $quotaId) {
      ...EquipmentFragment
      equipmentCatalogueQuotas {
        id
        percentageQuota
        meterRequirement
      }
    }
  }
  ${EquipmentFragment}
`

export const removeEquipmentMutation = gql`
  mutation removeEquipmentFromCatalogue($equipmentId: String!, $catalogueId: String!) {
    removeEquipmentFromCatalogue(equipmentId: $equipmentId, catalogueId: $catalogueId)
  }
`
