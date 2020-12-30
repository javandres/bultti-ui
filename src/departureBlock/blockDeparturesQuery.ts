import { gql } from '@apollo/client'

export const availableDayTypesQuery = gql`
  query availableDayTypes($inspectionId: String!) {
    availableDayTypes(inspectionId: $inspectionId)
  }
`

export const uploadDepartureBlocksMutation = gql`
  mutation uploadDepartureBlocks(
    $file: Upload
    $dayTypes: [String!]!
    $inspectionId: String!
  ) {
    createBlockDeparturesFromFile(
      file: $file
      dayTypes: $dayTypes
      inspectionId: $inspectionId
    )
  }
`

export const removeDepartureBlocks = gql`
  mutation removeDepartureBlocksForDayTypes($dayTypes: [String!]!, $inspectionId: String!) {
    removeDepartureBlocksForDayTypes(dayTypes: $dayTypes, inspectionId: $inspectionId)
  }
`
