import gql from 'graphql-tag'

export const seasonsQuery = gql`
  query Seasons {
    seasons {
      id
      season
      year
      dateBegin
      dateEnd
    }
  }
`
