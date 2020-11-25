import { gql } from '@apollo/client'
import { OperatorBlockDepartureFragment } from '../departureBlock/blockDeparturesQuery'
import {
  ExecutionRequirementFragment,
  ObservedExecutionRequirementFragment,
  RequirementValueFragment,
} from '../executionRequirement/executionRequirementsQueries'
import { EquipmentFragment } from '../equipment/equipmentQuery'

export const ReportFragment = gql`
  fragment ReportFragment on Report {
    description
    name
    title
    columnLabels
    reportType
    inspectionTypes
    filteredCount
    filters {
      field
      filterValue
    }
    page {
      page
      pageSize
    }
    pages
    sort {
      column
      order
    }
    totalCount
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
    isNextDay
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
    isNextDay
    registryNr
    equipmentRotation
    blockNumber
    schemaId
    trackReason
  }
`

export const ObservedDepartureFragment = gql`
  fragment ObservedDepartureFragment on ObservedDeparture {
    id
    departureId
    postInspectionId
    postInspectionId
    journeyStartTime
    journeyEndTime
    departureIsNextDay
    arrivalIsNextDay
    isOriginStop
    isTimingStop
    isDestinationStop
    departureTime
    departureDateTime
    observedDepartureDateTime
    arrivalTime
    arrivalDateTime
    observedArrivalDateTime
    stopId
    originStopId
    terminalTime
    recoveryTime
    routeId
    direction
    routeLength
    dayType
    plannedEquipmentType
    equipmentTypeRequired
    plannedRegistryNr
    observedRegistryNr
    equipmentRotation
    isTrunkRoute
    allowedOverAge
    blockNumber
    schemaId
    schemaUnitId: procurementUnitId
    observedEquipment {
      ...EquipmentFragment
    }
    observedEquipmentId
    trackReason
  }
  ${EquipmentFragment}
`

export const reportByName = gql`
  query getPreInspectionReport(
    $reportName: String!
    $inspectionId: String!
    $page: InputPageConfig
    $filters: [InputFilterConfig!]
    $sort: [InputSortConfig!]
  ) {
    inspectionReportByName(
      reportName: $reportName
      inspectionId: $inspectionId
      page: $page
      filters: $filters
      sort: $sort
    ) {
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
        ... on ObservedDeparture {
          ...ObservedDepartureFragment
        }
        ... on OperatorBlockDeparture {
          ...OperatorBlockDepartureFragment
        }
        ... on ObservedExecutionRequirement {
          ...ObservedExecutionRequirementFragment
          observedRequirements {
            id
            kilometersObserved
            kilometersRequired
            averageAgeWeightedObserved
            averageAgeWeightedRequired
            cumulativeDifferencePercentage
            differencePercentage
            emissionClass
            equipmentCountObserved
            equipmentCountRequired
            quotaObserved
            quotaRequired
            sanctionablePercentage
            sanctionAmount
            sanctionThreshold
          }
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
        ... on ObservedUnitExecutionItem {
          id
          procurementUnitId
          totalKilometersRequired
          totalKilometersObserved
          averageAgeWeightedObserved
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
  ${ObservedDepartureFragment}
  ${ObservedExecutionRequirementFragment}
`
