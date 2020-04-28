import gql from 'graphql-tag'
import { ProcurementUnitFragment } from '../procurementUnit/procurementUnitsQuery'
import { DepartureFragment } from '../departureBlock/departureBlocksQuery'
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
  query getPreInspectionReport($reportName: String!, $inspectionId: String!) {
    preInspectionReportByName(preInspectionId: $inspectionId, reportName: $reportName) {
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
          ...DepartureFragment
        }
        ... on ExecutionRequirement {
          ...ExecutionRequirementFragment
          operator {
            id
            operatorId
            operatorName
          }
          area {
            id
            name
          }
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
  ${DepartureFragment}
  ${ExecutionRequirementFragment}
  ${RequirementValueFragment}
  ${EquipmentFragment}
`
