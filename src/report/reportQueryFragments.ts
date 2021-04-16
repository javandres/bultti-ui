import { gql } from '@apollo/client'

/**
 * This file contains GraphQL fragments for all report data items. Common fields can be
 * extracted into strings and reused in many fragments.
 *
 * The name of the fragment should be the capitalized name of the report and appended with
 * "Fragment". The report names are listed in reportNames.ts in the server repo.
 */

let departureReportBaseFragment = `
id
dayType
direction
journeyEndTime
journeyStartTime
routeId
trackReason
`

let observedDepartureReportBaseFragment = `
${departureReportBaseFragment}
date
observedArrivalTime
observedDepartureTime
sanctionAmount
sanctionedKilometers
`

let emissionClassExecutionBaseFragment = `
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
`

let departurePairBaseFragment = `
id
dayType
aRouteId
aDirection
aJourneyStartTime
aJourneyEndTime
aOriginStop
aDestinationStop
aTerminalTime
aRecoveryTime
bRouteId
bDirection
bJourneyStartTime
bJourneyEndTime
bOriginStop
bDestinationStop
bTerminalTime
bRecoveryTime
blockNumber
equipmentRotation
schemaId
deadrunMinutes
deadrunPlannedBy
`

// The keys should match the capitalized reportName + 'Fragment'.
// Example: report name 'trackedDepartures' becomes fragment name 'TrackedDeparturesFragment'
export const reportQueryFragments = {
  TrackedDeparturesFragment: gql`
    fragment TrackedDeparturesFragment on TrackedDeparturesReportData {
      ${departureReportBaseFragment}      
    }
  `,
  EmissionClassExecutionFragment: gql`
    fragment EmissionClassExecutionFragment on EmissionClassExecutionReportData {
      ${emissionClassExecutionBaseFragment}
    }
  `,
  ObservedEmissionClassExecutionFragment: gql`
    fragment ObservedEmissionClassExecutionFragment on ObservedEmissionClassExecutionReportData {
      ${emissionClassExecutionBaseFragment}
    }
  `,
  ObservedUnitExecutionFragment: gql`
    fragment ObservedUnitExecutionFragment on ObservedUnitExecution {
      id
      procurementUnitId
      totalKilometersObserved
      totalUnitKilometers
      averageAgeWeightedObserved
      sanctionAmount
      sanctionedKilometers
    }
  `,
  ObservedLateDeparturesFragment: gql`
    fragment ObservedLateDeparturesFragment on LateDeparturesReportData {
      ${observedDepartureReportBaseFragment}
      journeyKilometers
      observedLateArrivalSeconds
      observedLateDepartureSeconds
      procurementUnitId
      registryNr
    }
  `,
  ObservedOverageDeparturesFragment: gql`
    fragment ObservedOverageDeparturesFragment on ObservedOverAgeDeparturesReportData {
      ${observedDepartureReportBaseFragment}
      registryNr
      procurementUnitId
      observedEquipmentAge
      overAgeType
      journeyKilometers
    }
  `,
  ObservedDeviationsFragment: gql`
    fragment ObservedDeviationsFragment on ObservedDeviationsReportData {
      ${observedDepartureReportBaseFragment}
      registryNr
      terminalTime
      recoveryTime
      observedOverlapSeconds
    }
  `,
  ObservedEquipmentColorFragment: gql`
    fragment ObservedEquipmentColorFragment on ObservedEquipmentColorReportData {
      ${observedDepartureReportBaseFragment}
      registryNr
      observedExteriorColor
      journeyKilometers
      procurementUnitId
    }
  `,
  ObservedEquipmentTypeFragment: gql`
    fragment ObservedEquipmentTypeFragment on ObservedEquipmentTypeReportData {
      ${observedDepartureReportBaseFragment}
      registryNr
      journeyKilometers
      procurementUnitId
      equipmentTypeRequired
      observedEquipmentType
      plannedEquipmentType
    }
  `,
  ObservedExecutionRequirementsFragment: gql`
    fragment ObservedExecutionRequirementsFragment on ObservedExecutionRequirementsReportData {
      id
      operatorId
      areaName
      startDate
      endDate
      totalKilometersRequired
      totalKilometersObserved
      observedRequirements {
        id
        emissionClass
        kilometersRequired
        quotaRequired
        kilometersObserved
        quotaObserved
        differencePercentage
        cumulativeDifferencePercentage
        equipmentCountRequired
        equipmentCountObserved
        sanctionThreshold
        sanctionablePercentage
        sanctionAmount
      }
    }
  `,
  EarlyTimingStopDeparturesFragment: gql`
    fragment EarlyTimingStopDeparturesFragment on EarlyTimingStopDeparturesReportData {
      ${departureReportBaseFragment}
      date
      stopId
      procurementUnitId
      plannedDepartureTime
      observedDepartureTime
      observedDepartureDifferenceSeconds
      journeyKilometers
    }
  `,
  BlockDeviationsFragment: gql`
    fragment BlockDeviationsFragment on DeviationsReportData {
      ${departureReportBaseFragment}
      overlapSeconds
      overlapPlannedBy
      registryNr
    }
  `,
  AllDeviationsFragment: gql`
    fragment AllDeviationsFragment on DeviationsReportData {
      ${departureReportBaseFragment}
      overlapSeconds
      overlapPlannedBy
      registryNr
    }
  `,
  DeadrunsFragment: gql`
    fragment DeadrunsFragment on DeadrunsReportData {
      ${departurePairBaseFragment}
    }
  `,
  OperatorDeadrunsFragment: gql`
    fragment OperatorDeadrunsFragment on DeadrunsReportData {
      ${departurePairBaseFragment}
    }
  `,
  DepartureBlocksFragment: gql`
    fragment DepartureBlocksFragment on DepartureBlocksReportData {
      id
      dayType
      routeId
      direction
      journeyStartTime
      journeyEndTime
      blockNumber
      journeyType
      registryNr
      vehicleId
    }
  `,
  EquipmentColorFragment: gql`
    fragment EquipmentColorFragment on EquipmentColorReportData {
      ${departureReportBaseFragment}
      registryNr
      equipmentExteriorColor
    }
  `,
  EquipmentTypeFragment: gql`
    fragment EquipmentTypeFragment on EquipmentTypeReportData {
      ${departureReportBaseFragment}
      registryNr
      plannedEquipmentType
      observedEquipmentType
      equipmentTypeRequired
    }
  `,
  ExecutionRequirementsFragment: gql`
    fragment ExecutionRequirementsFragment on ExecutionRequirementsReportData {
      id
      operatorId
      areaName
      totalKilometers
      totalKilometersFulfilled
      averageAgeWeighted
      averageAgeWeightedFulfilled
      requirements {
        emissionClass
        kilometerRequirement
        kilometersFulfilled
        quotaRequirement
        quotaFulfilled
        equipmentCount
        equipmentCountFulfilled
        averageAgeWeightedFulfilled
        differencePercentage
        cumulativeDifferencePercentage
        sanctionAmount
        sanctionThreshold
        classSanctionAmount
      }
    }
  `,
  ExtraBlockDeparturesFragment: gql`
    fragment ExtraBlockDeparturesFragment on ExtraBlockDeparturesReportData {
      ${departureReportBaseFragment}
    }
  `,
  MissingBlockDeparturesFragment: gql`
    fragment MissingBlockDeparturesFragment on MissingBlockDeparturesReportData {
      ${departureReportBaseFragment}
    }
  `,
  MissingEquipmentFragment: gql`
    fragment MissingEquipmentFragment on MissingEquipmentReportData {
      id
      registryNr
      vehicleId
      blockNumber
    }
  `,
  OverageDeparturesFragment: gql`
    fragment OverageDeparturesFragment on OverAgeDeparturesReportData {
      ${departureReportBaseFragment}
      registryNr
      overAgeType
      observedEquipmentAge
    }
  `,
  UnitExecutionFragment: gql`
    fragment UnitExecutionFragment on UnitExecutionReportData {
      id
      procurementUnitId
      totalKilometers
      totalKilometersFulfilled
      averageAgeMax
      averageAgeRequired
      averageAgeWeighted
      averageAgeWeightedFulfilled
    }
  `,
  UnobservedDeparturesFragment: gql`
    fragment UnobservedDeparturesFragment on UnobservedDeparturesReportData {
      ${departureReportBaseFragment}
      journeyKilometers
      procurementUnitId
      blockNumber
      date
    }
  `,
  SanctionSummaryFragment: gql`
    fragment SanctionSummaryFragment on SanctionSummaryReportData {
      id
      procurementUnitId
      areaName
      averageAgeWeightedObserved
      sanctionAmount
      sanctionReason
      sanctionAmountRatio
      sanctionedKilometers
    }
  `,
}
