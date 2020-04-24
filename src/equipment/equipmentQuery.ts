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
    uniqueVehicleId
    hasInfoSystems
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
    $catalogueId: String
    $executionRequirementId: String
  ) {
    createEquipment(
      operatorId: $operatorId
      equipment: $equipmentInput
      catalogueId: $catalogueId
      executionRequirementId: $executionRequirementId
    ) {
      ...EquipmentFragment
      equipmentCatalogueQuotas {
        id
        percentageQuota
        equipmentCatalogueId
        equipmentId
      }
      executionRequirementQuotas {
        id
        percentageQuota
        meterRequirement
        executionRequirementId
        equipmentId
      }
    }
  }
  ${EquipmentFragment}
`

export const updateEquipmentMutation = gql`
  mutation updateEquipmentFromCatalogue($equipmentId: String!, $equipmentInput: EquipmentInput!) {
    updateEquipment(equipmentId: $equipmentId, equipment: $equipmentInput) {
      ...EquipmentFragment
      equipmentCatalogueQuotas {
        id
        percentageQuota
      }
      executionRequirementQuotas {
        id
        meterRequirement
        percentageQuota
      }
    }
  }
  ${EquipmentFragment}
`

export const updateEquipmentCatalogueQuotaMutation = gql`
  mutation updateEquipmentCatalogueQuota(
    $equipmentId: String!
    $equipmentInput: EquipmentInput!
    $quotaId: String!
  ) {
    updateEquipmentCatalogueQuota(
      equipmentId: $equipmentId
      equipment: $equipmentInput
      quotaId: $quotaId
    ) {
      ...EquipmentFragment
      equipmentCatalogueQuotas {
        id
        percentageQuota
      }
    }
  }
  ${EquipmentFragment}
`

export const updateEquipmentRequirementQuotaMutation = gql`
  mutation updateEquipmentRequirementQuota(
    $equipmentId: String!
    $equipmentInput: EquipmentInput!
    $quotaId: String!
  ) {
    updateEquipmentRequirementQuota(
      equipmentId: $equipmentId
      equipment: $equipmentInput
      quotaId: $quotaId
    ) {
      ...EquipmentFragment
      executionRequirementQuotas {
        id
        meterRequirement
        percentageQuota
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
