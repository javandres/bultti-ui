import { gql } from '@apollo/client'

const DepartureBlocksFragment = gql`
  fragment DepartureBlocksFragment on OperatorBlockDeparture {
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
