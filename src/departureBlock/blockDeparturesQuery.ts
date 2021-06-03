import { gql } from '@apollo/client'

export const previewDepartureBlocksQuery = gql`
  query previewDepartureBlocks($inspectionId: String!) {
    previewInspectionDepartureBlocks(inspectionId: $inspectionId) {
      id
      blockNumber
      dayType
      direction
      equipmentId
      inspectionId
      journeyStartTime
      journeyEndTime
      journeyType
      operatorId
      procurementUnitId
      registryNr
      routeId
      routeLength
      vehicleId
    }
  }
`
