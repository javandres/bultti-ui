import { gql } from '@apollo/client'

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
    fragment ObservedUnitExecutionFragment on ObservedUnitExecutionReportData {
      id
      averageAgeWeightedObserved
      procurementUnitId
      totalKilometersObserved
      totalKilometersRequired
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
}
