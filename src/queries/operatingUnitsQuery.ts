import gql from 'graphql-tag'

export const operatingUnitsQuery = gql`
  query operatingUnits($operatorId: String!, $startDate: Date!) {
    operatingUnits(operatorId: $operatorId, startDate: $startDate) {
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
