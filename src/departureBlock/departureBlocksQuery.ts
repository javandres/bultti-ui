import gql from 'graphql-tag'
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
  }
`

export const departureBlocksQuery = gql`
  query departureBlocks($preInspectionId: String!) {
    blockDeparturesForPreInspection(preInspectionId: $preInspectionId) {
      id
      dayType
      blockNumber
      registryNr
      direction
      routeId
      journeyStartTime
      journeyEndTime
      journeyType
      routeLength
      startDate
      endDate
      equipment {
        ...EquipmentFragment
      }
      operator {
        id
        operatorId
        operatorName
      }
    }
  }
  ${EquipmentFragment}
`

export const uploadDepartureBlocksMutation = gql`
  mutation uploadDepartureBlocks(
    $file: Upload
    $dayTypes: [DayType!]!
    $inspectionId: String!
  ) {
    createBlockDeparturesFromFile(
      file: $file
      dayTypes: $dayTypes
      preInspectionId: $inspectionId
    ) {
      id
      dayType
    }
  }
`

export const removeDepartureBlocks = gql`
  mutation removeDepartureBlocksForDayTypes(
    $dayTypes: [DayType!]!
    $preInspectionId: String!
  ) {
    removeDepartureBlocksForDayTypes(dayTypes: $dayTypes, preInspectionId: $preInspectionId)
  }
`
