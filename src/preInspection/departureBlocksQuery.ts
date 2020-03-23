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
        variant
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
