import gql from 'graphql-tag'

export const operatingUnitsQuery = gql`
  query operatingUnits($operatorId: String!) {
    operatingUnits(operatorId: $operatorId) {
      id
      operatorId
      routeIds
      operator {
        id
        name
      }
    }
  }
`
