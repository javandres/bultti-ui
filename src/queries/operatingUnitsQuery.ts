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
    }
  }
`
