import gql from 'graphql-tag'
import { ProcurementUnitFragment } from '../procurementUnit/procurementUnitsQuery'
import { OperatorBlockDepartureFragment } from '../departureBlock/departureBlocksQuery'
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
        ... on ProcurementUnit {
          ...ProcurementUnitFragment
        }
        ... on Departure {
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
            ...OperatorBlockDepartureFragment
          }
          departureB {
            ...OperatorBlockDepartureFragment
          }
        }
      }
    }
  }
  ${ProcurementUnitFragment}
  ${OperatorBlockDepartureFragment}
  ${ExecutionRequirementFragment}
  ${RequirementValueFragment}
  ${EquipmentFragment}
`
