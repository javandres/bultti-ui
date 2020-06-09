import { gql } from '@apollo/client'
import { OperatorBlockDepartureFragment } from '../departureBlock/blockDeparturesQuery'
import {
  ExecutionRequirementFragment,
  RequirementValueFragment,
} from '../executionRequirement/executionRequirementsQueries'

export const reportsQuery = gql`
  query inspectionReports($inspectionType: InspectionType) {
    reports(inspectionType: $inspectionType) {
      id
      description
      name
      title
      columnLabels
      params
      reportType
      inspectionTypes
    }
  }
`

export const reportCreatorNamesQuery = gql`
  query reportCreatorNames {
    reportCreatorOptions {
      name
      inspectionTypes
    }
  }
`

export const DepartureFragment = gql`
  fragment DepartureFragment on Departure {
    id
    dayType
    blockNumber
    routeId
    direction
    routeLength
    journeyStartTime
    journeyEndTime
    registryNr
    equipmentRotation
    endStop
    isTrunkRoute
    equipmentTypeRequired
    plannedEquipmentType
    observedEquipmentType
    recoveryTime
    schemaUnitId: procurementUnitId
    schemaId
    trackReason
    terminalTime
    startStop
  }
`

export const ShortDepartureFragment = gql`
  fragment ShortDepartureFragment on Departure {
    dayType
    routeId
    direction
    journeyStartTime
    journeyEndTime
    registryNr
    equipmentRotation
    blockNumber
    schemaId
  }
`

export const reportByName = gql`
  query getPreInspectionReport(
    $reportName: String!
    $inspectionId: String!
    $inspectionType: InspectionType!
  ) {
    inspectionReportByName(
      inspectionId: $inspectionId
      inspectionType: $inspectionType
      reportName: $reportName
    ) {
      description
      name
      title
      params
      reportType
      columnLabels
      operator {
        id
        operatorId
        operatorName
      }
      season {
        id
        season
        startDate
        endDate
      }
      reportEntities {
        __typename
        ... on EmissionClassExecutionItem {
          id
          procurementUnitId
          class1
          class2
          class3
          class4
          class5
          class6
          class7
          class8
          class9
          class10
        }
        ... on Departure {
          ...DepartureFragment
          equipmentAge
          registryDate
        }
        ... on OperatorBlockDeparture {
          ...OperatorBlockDepartureFragment
        }
        ... on ExecutionRequirement {
          ...ExecutionRequirementFragment
          procurementUnitId
          requirements {
            ...RequirementValueFragment
          }
        }
        ... on MissingEquipment {
          blockNumber
          registryNr
        }
        ... on DeparturePair {
          id
          blockNumber
          deadrunStartStop
          deadrunEndStop
          deadrunMinutes
          deadrunPlannedBy
          departureA {
            ...ShortDepartureFragment
          }
          departureB {
            ...ShortDepartureFragment
          }
        }
      }
    }
  }
  ${OperatorBlockDepartureFragment}
  ${DepartureFragment}
  ${ShortDepartureFragment}
  ${ExecutionRequirementFragment}
  ${RequirementValueFragment}
`

export const modifyReportMutation = gql`
  mutation modifyReport($reportInput: ReportInput!) {
    modifyReport(reportInput: $reportInput) {
      id
      description
      name
      title
      columnLabels
      params
    }
  }
`
