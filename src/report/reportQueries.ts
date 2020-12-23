import { gql } from '@apollo/client'
import { reportQueryFragments } from './reportQueryFragments'

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

export const createReportQueryByName = (reportName: string) => {
  let dataFragmentName = `${reportName[0].toUpperCase() + reportName.substring(1)}Fragment`
  let dataFragment = reportQueryFragments[dataFragmentName]

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
