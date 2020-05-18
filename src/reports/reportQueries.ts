import { gql } from '@apollo/client'
import { ProcurementUnitFragment } from '../procurementUnit/procurementUnitsQuery'
import { OperatorBlockDepartureFragment } from '../departureBlock/blockDeparturesQuery'
import {
  ExecutionRequirementFragment,
  RequirementValueFragment,
} from '../executionRequirement/executionRequirementsQueries'
import { EquipmentFragment } from '../equipment/equipmentQuery'

export const availablePreInspectionReportsQuery = gql`
  query preInspectionAvailableReports($preInspectionId: String!) {
    availablePreInspectionReports(preInspectionId: $preInspectionId) {
      description
      name
      reportType
      title
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
    operatorOrder
    plannedEquipmentType
    recoveryTime
    schemaUnitId: procurementUnitId
    schemaId
    schemaOrder
    trackReason
    terminalTime
    startStop
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
        ... on ProcurementUnit {
          ...ProcurementUnitFragment
        }
        ... on Departure {
          ...DepartureFragment
        }
        ... on OperatorBlockDeparture {
          ...OperatorBlockDepartureFragment
        }
        ... on ExecutionRequirement {
          ...ExecutionRequirementFragment
          requirements {
            ...RequirementValueFragment
          }
        }
        ... on Equipment {
          ...EquipmentFragment
        }
        ... on DeparturePair {
          departureA {
            ...DepartureFragment
          }
          departureB {
            ...DepartureFragment
          }
        }
      }
    }
  }
  ${ProcurementUnitFragment}
  ${OperatorBlockDepartureFragment}
  ${DepartureFragment}
  ${ExecutionRequirementFragment}
  ${RequirementValueFragment}
  ${EquipmentFragment}
`
