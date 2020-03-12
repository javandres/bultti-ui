import gql from "graphql-tag"

export const seasonsQuery = gql`
  query Seasons($date: DateTime!) {
    seasons(date: $date) {
      id
      season
      startDate
      endDate
    }
  }
`
