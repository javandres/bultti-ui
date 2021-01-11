import { gql } from '@apollo/client'

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
      ...EquipmentFragment
    }
  }
  ${EquipmentFragment}
`

export const addEquipmentToCatalogueMutation = gql`
  mutation addEquipmentToCatalogueMutation(
    $equipmentId: String!
    $catalogueId: String!
    $quota: Float!
  ) {
    addEquipmentToCatalogue(
      equipmentId: $equipmentId
      catalogueId: $catalogueId
      quota: $quota
    ) {
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

export const addEquipmentToRequirementMutation = gql`
  mutation addEquipmentToRequirementMutation($equipmentId: String!, $requirementId: String!) {
    addEquipmentToExecutionRequirement(
      equipmentId: $equipmentId
      executionRequirementId: $requirementId
    ) {
      id
      equipmentQuotas {
        id
        meterRequirement
        percentageQuota
        equipment {
          ...EquipmentFragment
        }
      }
    }
  }
  ${EquipmentFragment}
`

export const addBatchEquipmentMutation = gql`
  mutation batchAddToEquipmentCatalogue($catalogueId: String!, $vehicleIds: [String!]!) {
    batchAddToEquipmentCatalogue(catalogueId: $catalogueId, vehicleIds: $vehicleIds) {
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

export const updateCatalogueEquipmentDataMutation = gql`
  mutation updateEquipmentInCatalogue($catalogueId: String!) {
    updateEquipmentInCatalogue(catalogueId: $catalogueId) {
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

export const updateEquipmentMutation = gql`
  mutation updateEquipmentFromCatalogue($equipmentId: String!) {
    updateEquipment(equipmentId: $equipmentId) {
      ...EquipmentFragment
    }
  }
  ${EquipmentFragment}
`

export const updateEquipmentCatalogueQuotaMutation = gql`
  mutation updateEquipmentCatalogueQuota(
    $equipmentId: String!
    $quota: Float!
    $quotaId: String!
  ) {
    updateEquipmentCatalogueQuota(
      equipmentId: $equipmentId
      quota: $quota
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
    $quota: Float!
    $quotaId: String!
  ) {
    updateEquipmentRequirementQuota(
      equipmentId: $equipmentId
      quota: $quota
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
    removeEquipmentFromCatalogue(equipmentId: $equipmentId, catalogueId: $catalogueId) {
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

export const removeRequirementEquipmentMutation = gql`
  mutation removeEquipmentFromRequirement($equipmentId: String!, $requirementId: String!) {
    removeEquipmentFromExecutionRequirement(
      equipmentId: $equipmentId
      executionRequirementId: $requirementId
    ) {
      id
      equipmentQuotas {
        id
        meterRequirement
        percentageQuota
        equipment {
          ...EquipmentFragment
        }
      }
    }
  }
  ${EquipmentFragment}
`
