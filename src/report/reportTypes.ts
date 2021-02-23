import {
  BlockDeviationsReport,
  DeadrunsReport,
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
  TrackedDeparturesReport,
  UnitExecutionReport,
  UnobservedDeparturesReport,
} from '../schema-types'

export type ReportComponentProps<T = {}> = {
  items: T[]
  columnLabels?: { [key: string]: string }
}

export type ReportType = 'list' | 'executionRequirement' | 'observedExecutionRequirement'

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
}
