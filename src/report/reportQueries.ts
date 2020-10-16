import { gql } from '@apollo/client'
import { OperatorBlockDepartureFragment } from '../departureBlock/blockDeparturesQuery'
import {
  ExecutionRequirementFragment,
  RequirementValueFragment,
} from '../executionRequirement/executionRequirementsQueries'

export const ReportFragment = gql`
  fragment ReportFragment on Report {
    description
    name
    title
    columnLabels
    reportType
    inspectionTypes
  }
`

export const reportsQuery = gql`
  query inspectionReports($inspectionType: InspectionType) {
    reports(inspectionType: $inspectionType) {
      ...ReportFragment
    }
  }
  ${ReportFragment}
`

export const DepartureFragment = gql`
  fragment DepartureFragment on Departure {
    _id: id
    departureId
    departureType
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
    departureId
    departureType
    dayType
    routeId
    direction
    terminalTime
    recoveryTime
    journeyStartTime
    journeyEndTime
    registryNr
    equipmentRotation
    blockNumber
    schemaId
    trackReason
  }
`

export const reportByName = gql`
  query getPreInspectionReport($reportName: String!, $inspectionId: String!) {
    inspectionReportByName(reportName: $reportName, inspectionId: $inspectionId) {
      ...ReportFragment
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
          equipmentRegistryDate
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
  ${ReportFragment}
  ${OperatorBlockDepartureFragment}
  ${DepartureFragment}
  ${ShortDepartureFragment}
  ${ExecutionRequirementFragment}
  ${RequirementValueFragment}
`
