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
  // Uppercase the first letter and add Fragment to the end to get the fragment name of the report.
  let dataFragmentName = `${
    reportName[0].toUpperCase() + reportName.substring(1)
  }Fragment` as keyof typeof reportQueryFragments

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
        id
        description
        name
        title
        columnLabels
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
        rows {
        ...${dataFragmentName}
        }
      }
    }
    ${dataFragment}
  `
}
