import {
  AdCoverSanctionsReport,
  BlockDeviationsReport,
  DangerousDefectSanctionsReport,
  DeadrunsReport,
  DefectiveEquipmentDepartureSanctionsReport,
  DepartureBlocksReport,
  DeviationsReport,
  EarlyTimingStopDeparturesReport,
  EmissionClassExecutionReport,
  EquipmentColorReport,
  EquipmentTypeReport,
  ExecutionRequirementsReport,
  ExtraBlockDeparturesReport,
  LateDeparturesReport,
  MissingBlockDeparturesReport,
  MissingEquipmentReport,
  ObservedEmissionClassExecutionReport,
  ObservedEquipmentColorReport,
  ObservedEquipmentTypeReport,
  ObservedExecutionRequirementsReport,
  ObservedOverAgeDeparturesReport,
  ObservedUnitExecutionReport,
  OperatorDeadrunsReport,
  OverAgeDeparturesReport,
  SanctionListReport,
  SanctionSummaryReport,
  TrackedDeparturesReport,
  UnitExecutionReport,
  UnobservedDeparturesReport,
} from '../schema-types'

export type ReportComponentProps<T = Record<string, unknown>> = {
  items: T[]
  columnLabels?: { [key: string]: string }
  testId?: string
}

export type ReportTypeByName = {
  blockDeviationsReport: BlockDeviationsReport
  deadrunsReport: DeadrunsReport
  departureBlocksReport: DepartureBlocksReport
  allDeviationsReport: DeviationsReport
  emissionClassExecutionReport: EmissionClassExecutionReport
  equipmentColorReport: EquipmentColorReport
  equipmentTypeReport: EquipmentTypeReport
  executionRequirementsReport: ExecutionRequirementsReport
  extraBlockDeparturesReport: ExtraBlockDeparturesReport
  missingBlockDeparturesReport: MissingBlockDeparturesReport
  missingEquipmentReport: MissingEquipmentReport
  operatorDeadrunsReport: OperatorDeadrunsReport
  overageDeparturesReport: OverAgeDeparturesReport
  trackedDeparturesReport: TrackedDeparturesReport
  unitExecutionReport: UnitExecutionReport
  earlyTimingStopDeparturesReport: EarlyTimingStopDeparturesReport
  observedLateDeparturesReport: LateDeparturesReport
  observedEmissionClassExecutionReport: ObservedEmissionClassExecutionReport
  observedEquipmentColorReport: ObservedEquipmentColorReport
  observedEquipmentTypeReport: ObservedEquipmentTypeReport
  observedExecutionRequirementsReport: ObservedExecutionRequirementsReport
  observedOverageDeparturesReport: ObservedOverAgeDeparturesReport
  observedUnitExecutionReport: ObservedUnitExecutionReport
  unobservedDeparturesReport: UnobservedDeparturesReport
  sanctionSummaryReport: SanctionSummaryReport
  sanctionListReport: SanctionListReport
  dangerousDefectSanctionsReport: DangerousDefectSanctionsReport
  adCoverSanctionsReport: AdCoverSanctionsReport
  defectiveEquipmentDepartureSanctionsReport: DefectiveEquipmentDepartureSanctionsReport
}
