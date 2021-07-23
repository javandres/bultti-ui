import { gql } from '@apollo/client'

const OperatorDepartureBlocksFragment = gql`
  fragment OperatorDepartureBlocksFragment on OperatorBlockDeparture {
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
      ...OperatorDepartureBlocksFragment
    }
  }
  ${OperatorDepartureBlocksFragment}
`

export const saveDepartureBlocksMutation = gql`
  mutation saveDepartureBlocks($inspectionId: String!) {
    saveInspectionDepartureBlocks(inspectionId: $inspectionId) {
      ...OperatorDepartureBlocksFragment
    }
  }
  ${OperatorDepartureBlocksFragment}
`
