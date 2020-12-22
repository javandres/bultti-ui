import { gql } from '@apollo/client'

export const TrackedDeparturesFragment = gql`
  fragment TrackedDeparturesFragment on TrackedDeparturesData {
    id
    dayType
    direction
    journeyEndTime
    journeyStartTime
    routeId
    trackReason
  }
`

let fragments = {
  TrackedDeparturesFragment: TrackedDeparturesFragment,
}

export const reportsQuery = gql`
  query inspectionReports($inspectionType: InspectionType!) {
    reports(inspectionType: $inspectionType) {
      name
      title
      description
      inspectionType
    }
  }
`

export const createReportQueryByName = (
  reportName: string,
  dataFragmentName: keyof typeof fragments
) => {
  let dataFragment = fragments[dataFragmentName]

  return gql`
    query ${reportName}Report(
      $inspectionId: String!
      $page: InputPageConfig
      $filters: [InputFilterConfig!]
      $sort: [InputSortConfig!]
    ) {
      ${reportName}Report(
        inspectionId: $inspectionId
        page: $page
        filters: $filters
        sort: $sort
      ) {
        description
        name
        title
        columnLabels
        reportType
        inspectionType
        totalCount
        filteredCount
        pages
        operatorId
        seasonId
        showSanctioned
        showUnsanctioned
        filters {
          field
          filterValue
        }
        page {
          page
          pageSize
        }
        sort {
          column
          order
        }
        reportData {
        ...${dataFragmentName}
        }
      }
    }
    ${dataFragment}
  `
}
