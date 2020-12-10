import { gql } from '@apollo/client'
import { EquipmentFragment } from '../equipment/equipmentQuery'

export const OperatorBlockDepartureFragment = gql`
  fragment OperatorBlockDepartureFragment on OperatorBlockDeparture {
    id
    blockNumber
    direction
    journeyStartTime
    journeyEndTime
    routeId
    routeLength
    registryNr
    dayType
    schemaUnitId: procurementUnitId
  }
`

export const availableDayTypesQuery = gql`
  query availableDayTypes($inspectionId: String!) {
    availableDayTypes(inspectionId: $inspectionId)
  }
`

export const blockDeparturesQuery = gql`
  query blockDepartures($inspectionId: String!) {
    blockDeparturesForPreInspection(inspectionId: $inspectionId) {
      id
      dayType
      blockNumber
      registryNr
      vehicleId
      direction
      routeId
      journeyStartTime
      journeyEndTime
      journeyType
      routeLength
      equipmentId
      operatorId
    }
  }
  ${EquipmentFragment}
`

export const uploadDepartureBlocksMutation = gql`
  mutation uploadDepartureBlocks(
    $file: Upload
    $dayTypes: [String!]!
    $inspectionId: String!
  ) {
    createBlockDeparturesFromFile(
      file: $file
      dayTypes: $dayTypes
      inspectionId: $inspectionId
    ) {
      id
      dayType
    }
  }
`

export const removeDepartureBlocks = gql`
  mutation removeDepartureBlocksForDayTypes($dayTypes: [String!]!, $inspectionId: String!) {
    removeDepartureBlocksForDayTypes(dayTypes: $dayTypes, inspectionId: $inspectionId)
  }
`
