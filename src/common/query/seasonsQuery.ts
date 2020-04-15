import gql from 'graphql-tag'

export const seasonQuery = gql`
  query season($seasonId: String!) {
    season(seasonId: $seasonId) {
      id
      season
      startDate
      endDate
    }
  }
`

export const seasonsQuery = gql`
  query seasons($date: BulttiDate!) {
    seasons(date: $date) {
      id
      season
      startDate
      endDate
    }
  }
`
