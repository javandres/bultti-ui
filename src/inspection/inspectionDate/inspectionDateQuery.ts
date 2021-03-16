import { gql } from '@apollo/client'

export const InspectionDateFragment = gql`
  fragment InspectionDateFragment on InspectionDate {
    id
    startDate
    endDate
    hfpDataStatus
    inspections {
      id
    }
  }
`

export const allInspectionDatesQuery = gql`
  query allInspectionDates {
    allInspectionDates {
      ...InspectionDateFragment
    }
  }
  ${InspectionDateFragment}
`

export const getObservedInspectionDatesQuery = gql`
  query getObservedInspectionDates($seasonId: String!) {
    getObservedInspectionDates(seasonId: $seasonId) {
      ...InspectionDateFragment
    }
  }
  ${InspectionDateFragment}
`

export const createInspectionDateMutation = gql`
  mutation createInspectionDate($inspectionDateInput: InspectionDateInput!) {
    createInspectionDate(inspectionDate: $inspectionDateInput) {
      ...InspectionDateFragment
    }
  }
  ${InspectionDateFragment}
`

export const removeInspectionDateMutation = gql`
  mutation removeInspectionDate($id: String!) {
    removeInspectionDate(id: $id)
  }
`
