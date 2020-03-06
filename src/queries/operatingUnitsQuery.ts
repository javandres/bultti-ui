import gql from 'graphql-tag'

export const operatingUnitsQuery = gql`
  query operatingUnits($operatorId: String!, $startDate: Date!) {
    operatingUnits(operatorId: $operatorId, startDate: $startDate) {
      id
      operatingUnitId
      operatorId
      routes {
        length
        routeId
      }
      endDate
      operationEndDate
      operationStartDate
      startDate
      operatingArea
      weeklyExecutionMeters
      equipmentCatalogues {
        id
        operatorId
        startDate
        endDate
        operatingUnitId
        equipment {
          id
          make
          model
          operatorId
          percentageQuota
          registryDate
          registryNr
          co2
          emissionClass
          exteriorColor
          vehicleId
          type
        }
      }
    }
  }
`

export const operatingUnitQuery = gql`
  query operatingUnit($operatorId: String!, $operatingUnitId: String!, $startDate: Date!) {
    operatingUnit(
      operatorId: $operatorId
      operatingUnitId: $operatingUnitId
      startDate: $startDate
    ) {
      id
      operatorId
      routes {
        length
        routeId
      }
      endDate
      operationEndDate
      operationStartDate
      startDate
      operatingArea
      weeklyExecutionMeters
    }
  }
`
