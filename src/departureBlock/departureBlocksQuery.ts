import gql from 'graphql-tag'

export const departureBlocksQuery = gql`
  query departureBlocks($preInspectionId: String!) {
    departureBlocksForPreInspection(preInspectionId: $preInspectionId) {
      id
      dayType
      departures {
        id
        blockNumber
        direction
        journeyStartTime
        journeyEndTime
        routeId
      }
      equipment {
        id
        model
        operatorId
        registryDate
        registryNr
        type
        uniqueVehicleId
        vehicleId
        emissionClass
      }
      equipmentRegistryNumber
      operator {
        operatorId
        operatorName
      }
    }
  }
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
