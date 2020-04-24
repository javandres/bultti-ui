import gql from 'graphql-tag'
import { EquipmentFragment } from '../equipment/equipmentQuery'

export const DepartureFragment = gql`
  fragment DepartureFragment on Departure {
    id
    blockNumber
    direction
    journeyStartTime
    journeyEndTime
    routeId
    routeLength
    equipmentRegistryNumber
    dayTypes
  }
`

export const departureBlocksQuery = gql`
  query departureBlocks($preInspectionId: String!) {
    departureBlocksForPreInspection(preInspectionId: $preInspectionId) {
      id
      dayType
      blockNumber
      equipmentRegistryNumber
      departures {
        ...DepartureFragment
      }
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
  ${DepartureFragment}
  ${EquipmentFragment}
`

export const uploadDepartureBlocksMutation = gql`
  mutation uploadDepartureBlocks($file: Upload, $dayTypes: [DayType!]!, $inspectionId: String!) {
    createDepartureBlockFromFile(file: $file, dayTypes: $dayTypes, preInspectionId: $inspectionId) {
      id
      dayType
    }
  }
`

export const removeDepartureBlocks = gql`
  mutation removeDepartureBlocksForDayTypes($dayTypes: [DayType!]!, $preInspectionId: String!) {
    removeDepartureBlocksForDayTypes(dayTypes: $dayTypes, preInspectionId: $preInspectionId)
  }
`
