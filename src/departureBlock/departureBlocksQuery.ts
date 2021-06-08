import { gql } from '@apollo/client'

const DepartureBlocksFragment = gql`
  fragment DepartureBlocksFragment on OperatorBlockDeparture {
    id
    blockNumber
    dayType
    registryNr
    vehicleId
    journeyStartTime
    journeyEndTime
    procurementUnitId
    routeId
    direction
    routeLength
  }
`

export const departureBlocksQuery = gql`
  query previewDepartureBlocks($inspectionId: String!) {
    inspectionDepartureBlocks(inspectionId: $inspectionId) {
      ...DepartureBlocksFragment
    }
  }
  ${DepartureBlocksFragment}
`

export const saveDepartureBlocksMutation = gql`
  mutation saveDepartureBlocks($inspectionId: String!) {
    saveInspectionDepartureBlocks(inspectionId: $inspectionId) {
      ...DepartureBlocksFragment
    }
  }
  ${DepartureBlocksFragment}
`
