import gql from "graphql-tag"

export const seasonsQuery = gql`
  query Seasons($date: Date!) {
    seasons(date: $date) {
      id
      season
      startDate
      endDate
    }
  }
`
