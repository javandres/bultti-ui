export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: string;
  /** A Date string in YYYY-MM-DD format. The timezone is assumed to be Europe/Helsinki. */
  BulttiDate: string;
  /** The `Upload` scalar type represents a file upload. */
  Upload: string;
};

export type Inspection = PostInspection | PreInspection;

export type BlockDeviationsReport = {
  __typename?: 'BlockDeviationsReport';
  columnLabels: Scalars['String'];
  description: Scalars['String'];
  filteredCount: Scalars['Int'];
  filters?: Maybe<Array<FilterConfig>>;
  id: Scalars['String'];
  inspectionId: Scalars['String'];
  name: Scalars['String'];
  operatorId: Scalars['Float'];
  responseId: Scalars['String'];
  rows: Array<DeviationsReportData>;
  seasonId: Scalars['String'];
  showSanctioned?: Maybe<Scalars['Boolean']>;
  showUnsanctioned?: Maybe<Scalars['Boolean']>;
  sort?: Maybe<Array<SortConfig>>;
  title: Scalars['String'];
  totalCount: Scalars['Int'];
};

export type Contract = {
  __typename?: 'Contract';
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  endDate: Scalars['BulttiDate'];
  id: Scalars['ID'];
  operator: Operator;
  operatorId?: Maybe<Scalars['Int']>;
  procurementUnits: Array<ProcurementUnit>;
  rules?: Maybe<Array<ContractRule>>;
  rulesFile?: Maybe<Scalars['String']>;
  startDate: Scalars['BulttiDate'];
  updatedAt: Scalars['DateTime'];
  userRelations: Array<ContractUserRelation>;
};

export type ContractRule = {
  __typename?: 'ContractRule';
  category: Scalars['String'];
  code?: Maybe<Scalars['String']>;
  condition?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  value: Scalars['String'];
};

export type ContractUserRelation = {
  __typename?: 'ContractUserRelation';
  contract: Contract;
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  relatedBy: ContractUserRelationType;
  subscribed: Scalars['Boolean'];
  updatedAt: Scalars['DateTime'];
  user: User;
};

export type DayTypeEquipmentStat = {
  __typename?: 'DayTypeEquipmentStat';
  dayType: Scalars['String'];
  equipmentCount: Scalars['Int'];
  kilometers: Scalars['Float'];
};

export type DeadrunsReport = {
  __typename?: 'DeadrunsReport';
  columnLabels: Scalars['String'];
  description: Scalars['String'];
  filteredCount: Scalars['Int'];
  filters?: Maybe<Array<FilterConfig>>;
  id: Scalars['String'];
  inspectionId: Scalars['String'];
  name: Scalars['String'];
  operatorId: Scalars['Float'];
  responseId: Scalars['String'];
  rows: Array<DeadrunsReportData>;
  seasonId: Scalars['String'];
  showSanctioned?: Maybe<Scalars['Boolean']>;
  showUnsanctioned?: Maybe<Scalars['Boolean']>;
  sort?: Maybe<Array<SortConfig>>;
  title: Scalars['String'];
  totalCount: Scalars['Int'];
};

export type DeadrunsReportData = {
  __typename?: 'DeadrunsReportData';
  aDestinationStop: Scalars['String'];
  aDirection: Scalars['String'];
  aJourneyEndTime: Scalars['String'];
  aJourneyStartTime: Scalars['String'];
  aOriginStop: Scalars['String'];
  aRecoveryTime: Scalars['Float'];
  aRouteId: Scalars['String'];
  aTerminalTime: Scalars['Float'];
  bDestinationStop: Scalars['String'];
  bDirection: Scalars['String'];
  bJourneyEndTime: Scalars['String'];
  bJourneyStartTime: Scalars['String'];
  bOriginStop: Scalars['String'];
  bRecoveryTime: Scalars['Float'];
  bRouteId: Scalars['String'];
  bTerminalTime: Scalars['Float'];
  blockNumber?: Maybe<Scalars['String']>;
  dayType: Scalars['String'];
  deadrunMinutes: Scalars['Int'];
  deadrunPlannedBy: Scalars['String'];
  equipmentRotation?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  schemaId?: Maybe<Scalars['String']>;
};

export type DepartureBlockFile = {
  __typename?: 'DepartureBlockFile';
  blockFile: Scalars['String'];
  dayType: Scalars['String'];
  operatorId: Scalars['Int'];
};

export type DepartureBlocksReport = {
  __typename?: 'DepartureBlocksReport';
  columnLabels: Scalars['String'];
  description: Scalars['String'];
  filteredCount: Scalars['Int'];
  filters?: Maybe<Array<FilterConfig>>;
  id: Scalars['String'];
  inspectionId: Scalars['String'];
  name: Scalars['String'];
  operatorId: Scalars['Float'];
  responseId: Scalars['String'];
  rows: Array<DepartureBlocksReportData>;
  seasonId: Scalars['String'];
  showSanctioned?: Maybe<Scalars['Boolean']>;
  showUnsanctioned?: Maybe<Scalars['Boolean']>;
  sort?: Maybe<Array<SortConfig>>;
  title: Scalars['String'];
  totalCount: Scalars['Int'];
};

export type DepartureBlocksReportData = {
  __typename?: 'DepartureBlocksReportData';
  blockNumber: Scalars['String'];
  dayType: Scalars['String'];
  direction: Scalars['String'];
  id: Scalars['ID'];
  journeyEndTime: Scalars['String'];
  journeyStartTime: Scalars['String'];
  journeyType: Scalars['String'];
  registryNr?: Maybe<Scalars['String']>;
  routeId: Scalars['String'];
  vehicleId?: Maybe<Scalars['String']>;
};

export type DeviationsReport = {
  __typename?: 'DeviationsReport';
  columnLabels: Scalars['String'];
  description: Scalars['String'];
  filteredCount: Scalars['Int'];
  filters?: Maybe<Array<FilterConfig>>;
  id: Scalars['String'];
  inspectionId: Scalars['String'];
  name: Scalars['String'];
  operatorId: Scalars['Float'];
  responseId: Scalars['String'];
  rows: Array<DeviationsReportData>;
  seasonId: Scalars['String'];
  showSanctioned?: Maybe<Scalars['Boolean']>;
  showUnsanctioned?: Maybe<Scalars['Boolean']>;
  sort?: Maybe<Array<SortConfig>>;
  title: Scalars['String'];
  totalCount: Scalars['Int'];
};

export type DeviationsReportData = {
  __typename?: 'DeviationsReportData';
  dayType: Scalars['String'];
  direction: Scalars['String'];
  id: Scalars['ID'];
  journeyEndTime: Scalars['String'];
  journeyStartTime: Scalars['String'];
  overlapPlannedBy?: Maybe<Scalars['String']>;
  overlapSeconds: Scalars['Float'];
  recoveryTime: Scalars['Float'];
  registryNr?: Maybe<Scalars['String']>;
  routeId: Scalars['String'];
  terminalTime: Scalars['Float'];
  trackReason: TrackReason;
};

export type EarlyTimingStopDeparturesReport = {
  __typename?: 'EarlyTimingStopDeparturesReport';
  columnLabels: Scalars['String'];
  description: Scalars['String'];
  filteredCount: Scalars['Int'];
  filters?: Maybe<Array<FilterConfig>>;
  id: Scalars['String'];
  inspectionId: Scalars['String'];
  name: Scalars['String'];
  operatorId: Scalars['Float'];
  responseId: Scalars['String'];
  rows: Array<EarlyTimingStopDeparturesReportData>;
  seasonId: Scalars['String'];
  showSanctioned?: Maybe<Scalars['Boolean']>;
  showUnsanctioned?: Maybe<Scalars['Boolean']>;
  sort?: Maybe<Array<SortConfig>>;
  title: Scalars['String'];
  totalCount: Scalars['Int'];
};

export type EarlyTimingStopDeparturesReportData = {
  __typename?: 'EarlyTimingStopDeparturesReportData';
  date: Scalars['String'];
  dayType: Scalars['String'];
  direction: Scalars['String'];
  id: Scalars['ID'];
  journeyEndTime: Scalars['String'];
  journeyKilometers: Scalars['Float'];
  journeyStartTime: Scalars['String'];
  observedDepartureDifferenceSeconds: Scalars['Int'];
  observedDepartureTime: Scalars['String'];
  plannedDepartureTime: Scalars['String'];
  procurementUnitId: Scalars['String'];
  routeId: Scalars['String'];
  sanctionAmount?: Maybe<Scalars['Float']>;
  sanctionedKilometers?: Maybe<Scalars['Float']>;
  stopId: Scalars['String'];
  trackReason: TrackReason;
};

export type EmissionClassExecutionReport = {
  __typename?: 'EmissionClassExecutionReport';
  columnLabels: Scalars['String'];
  description: Scalars['String'];
  filteredCount: Scalars['Int'];
  filters?: Maybe<Array<FilterConfig>>;
  id: Scalars['String'];
  inspectionId: Scalars['String'];
  name: Scalars['String'];
  operatorId: Scalars['Float'];
  responseId: Scalars['String'];
  rows: Array<EmissionClassExecutionReportData>;
  seasonId: Scalars['String'];
  showSanctioned?: Maybe<Scalars['Boolean']>;
  showUnsanctioned?: Maybe<Scalars['Boolean']>;
  sort?: Maybe<Array<SortConfig>>;
  title: Scalars['String'];
  totalCount: Scalars['Int'];
};

export type EmissionClassExecutionReportData = {
  __typename?: 'EmissionClassExecutionReportData';
  class1?: Maybe<Scalars['Float']>;
  class10?: Maybe<Scalars['Float']>;
  class2?: Maybe<Scalars['Float']>;
  class3?: Maybe<Scalars['Float']>;
  class4?: Maybe<Scalars['Float']>;
  class5?: Maybe<Scalars['Float']>;
  class6?: Maybe<Scalars['Float']>;
  class7?: Maybe<Scalars['Float']>;
  class8?: Maybe<Scalars['Float']>;
  class9?: Maybe<Scalars['Float']>;
  id: Scalars['ID'];
  procurementUnitId?: Maybe<Scalars['String']>;
};

export type Equipment = {
  __typename?: 'Equipment';
  approvedOverage: Scalars['Boolean'];
  emissionClass: Scalars['Int'];
  equipmentCatalogueQuotas: Array<EquipmentCatalogueQuota>;
  executionRequirementQuotas: Array<ExecutionRequirementQuota>;
  exteriorColor: Scalars['String'];
  hasInfoSystems: Scalars['Boolean'];
  id: Scalars['ID'];
  model?: Maybe<Scalars['String']>;
  operator: Operator;
  operatorId: Scalars['Int'];
  option: Scalars['Boolean'];
  registryDate: Scalars['BulttiDate'];
  registryNr: Scalars['String'];
  type: Scalars['String'];
  vehicleId: Scalars['String'];
};

export type EquipmentCatalogue = {
  __typename?: 'EquipmentCatalogue';
  endDate: Scalars['String'];
  equipmentCatalogueId: Scalars['String'];
  equipmentQuotas: Array<EquipmentCatalogueQuota>;
  id: Scalars['ID'];
  operator: Operator;
  operatorId: Scalars['Int'];
  procurementUnit: ProcurementUnit;
  procurementUnitId: Scalars['String'];
  startDate: Scalars['String'];
};

export type EquipmentCatalogueQuota = {
  __typename?: 'EquipmentCatalogueQuota';
  catalogueEndDate: Scalars['BulttiDate'];
  catalogueStartDate: Scalars['BulttiDate'];
  equipment?: Maybe<Equipment>;
  equipmentCatalogue?: Maybe<EquipmentCatalogue>;
  equipmentCatalogueId: Scalars['String'];
  equipmentId: Scalars['String'];
  id: Scalars['ID'];
  percentageQuota: Scalars['Float'];
};

export type EquipmentColorReport = {
  __typename?: 'EquipmentColorReport';
  columnLabels: Scalars['String'];
  description: Scalars['String'];
  filteredCount: Scalars['Int'];
  filters?: Maybe<Array<FilterConfig>>;
  id: Scalars['String'];
  inspectionId: Scalars['String'];
  name: Scalars['String'];
  operatorId: Scalars['Float'];
  responseId: Scalars['String'];
  rows: Array<EquipmentColorReportData>;
  seasonId: Scalars['String'];
  showSanctioned?: Maybe<Scalars['Boolean']>;
  showUnsanctioned?: Maybe<Scalars['Boolean']>;
  sort?: Maybe<Array<SortConfig>>;
  title: Scalars['String'];
  totalCount: Scalars['Int'];
};

export type EquipmentColorReportData = {
  __typename?: 'EquipmentColorReportData';
  dayType: Scalars['String'];
  direction: Scalars['String'];
  equipmentExteriorColor: Scalars['String'];
  id: Scalars['ID'];
  journeyEndTime: Scalars['String'];
  journeyStartTime: Scalars['String'];
  registryNr: Scalars['String'];
  routeId: Scalars['String'];
  trackReason: TrackReason;
};

export type EquipmentTypeReport = {
  __typename?: 'EquipmentTypeReport';
  columnLabels: Scalars['String'];
  description: Scalars['String'];
  filteredCount: Scalars['Int'];
  filters?: Maybe<Array<FilterConfig>>;
  id: Scalars['String'];
  inspectionId: Scalars['String'];
  name: Scalars['String'];
  operatorId: Scalars['Float'];
  responseId: Scalars['String'];
  rows: Array<EquipmentTypeReportData>;
  seasonId: Scalars['String'];
  showSanctioned?: Maybe<Scalars['Boolean']>;
  showUnsanctioned?: Maybe<Scalars['Boolean']>;
  sort?: Maybe<Array<SortConfig>>;
  title: Scalars['String'];
  totalCount: Scalars['Int'];
};

export type EquipmentTypeReportData = {
  __typename?: 'EquipmentTypeReportData';
  dayType: Scalars['String'];
  direction: Scalars['String'];
  equipmentTypeRequired: Scalars['Boolean'];
  id: Scalars['ID'];
  journeyEndTime: Scalars['String'];
  journeyStartTime: Scalars['String'];
  observedEquipmentType: Scalars['String'];
  plannedEquipmentType: Scalars['String'];
  registryNr: Scalars['String'];
  routeId: Scalars['String'];
  trackReason: TrackReason;
};

export type EquipmentTypeStat = {
  __typename?: 'EquipmentTypeStat';
  equipmentCount: Scalars['Int'];
  equipmentType: Scalars['String'];
  kilometers: Scalars['Float'];
};

export type ExecutionRequirementQuota = {
  __typename?: 'ExecutionRequirementQuota';
  equipment: Equipment;
  equipmentId: Scalars['String'];
  executionRequirement: PlannedUnitExecutionRequirement;
  executionRequirementId: Scalars['String'];
  id: Scalars['ID'];
  meterRequirement: Scalars['Float'];
  percentageQuota: Scalars['Float'];
  requirementOnly: Scalars['Boolean'];
};

export type ExecutionRequirementsReport = {
  __typename?: 'ExecutionRequirementsReport';
  columnLabels: Scalars['String'];
  description: Scalars['String'];
  filteredCount: Scalars['Int'];
  filters?: Maybe<Array<FilterConfig>>;
  id: Scalars['String'];
  inspectionId: Scalars['String'];
  name: Scalars['String'];
  operatorId: Scalars['Float'];
  responseId: Scalars['String'];
  rows: Array<ExecutionRequirementsReportData>;
  seasonId: Scalars['String'];
  showSanctioned?: Maybe<Scalars['Boolean']>;
  showUnsanctioned?: Maybe<Scalars['Boolean']>;
  sort?: Maybe<Array<SortConfig>>;
  title: Scalars['String'];
  totalCount: Scalars['Int'];
};

export type ExecutionRequirementsReportData = {
  __typename?: 'ExecutionRequirementsReportData';
  areaName: Scalars['String'];
  averageAgeRequirement?: Maybe<Scalars['Float']>;
  averageAgeWeighted?: Maybe<Scalars['Float']>;
  averageAgeWeightedFulfilled?: Maybe<Scalars['Float']>;
  id: Scalars['ID'];
  operatorId: Scalars['Int'];
  requirements: Array<PlannedEmissionClassRequirement>;
  totalKilometers: Scalars['Float'];
  totalKilometersFulfilled: Scalars['Float'];
};

export type ExecutionSchemaStats = {
  __typename?: 'ExecutionSchemaStats';
  dayTypeEquipment: Array<DayTypeEquipmentStat>;
  equipmentTypes: Array<EquipmentTypeStat>;
  executionRequirementId: Scalars['String'];
  id: Scalars['String'];
  procurementUnitId: Scalars['String'];
};

export type ExtraBlockDeparturesReport = {
  __typename?: 'ExtraBlockDeparturesReport';
  columnLabels: Scalars['String'];
  description: Scalars['String'];
  filteredCount: Scalars['Int'];
  filters?: Maybe<Array<FilterConfig>>;
  id: Scalars['String'];
  inspectionId: Scalars['String'];
  name: Scalars['String'];
  operatorId: Scalars['Float'];
  responseId: Scalars['String'];
  rows: Array<ExtraBlockDeparturesReportData>;
  seasonId: Scalars['String'];
  showSanctioned?: Maybe<Scalars['Boolean']>;
  showUnsanctioned?: Maybe<Scalars['Boolean']>;
  sort?: Maybe<Array<SortConfig>>;
  title: Scalars['String'];
  totalCount: Scalars['Int'];
};

export type ExtraBlockDeparturesReportData = {
  __typename?: 'ExtraBlockDeparturesReportData';
  dayType: Scalars['String'];
  direction: Scalars['String'];
  id: Scalars['ID'];
  journeyEndTime: Scalars['String'];
  journeyStartTime: Scalars['String'];
  routeId: Scalars['String'];
  trackReason: TrackReason;
};

export type FilterConfig = {
  __typename?: 'FilterConfig';
  field: Scalars['String'];
  filterValue: Scalars['String'];
};

export type HfpDateProgress = {
  __typename?: 'HfpDateProgress';
  date: Scalars['BulttiDate'];
  progress: Scalars['Int'];
};

export type HfpDateStatus = {
  __typename?: 'HfpDateStatus';
  date: Scalars['BulttiDate'];
  status: HfpStatus;
};

export type InspectionDate = {
  __typename?: 'InspectionDate';
  endDate: Scalars['BulttiDate'];
  hfpDataStatus: HfpStatus;
  id: Scalars['ID'];
  inspections?: Maybe<Array<PostInspection>>;
  startDate: Scalars['BulttiDate'];
};

export type InspectionErrorUpdate = {
  __typename?: 'InspectionErrorUpdate';
  errorType: Scalars['String'];
  id: Scalars['ID'];
  message: Scalars['String'];
  status: InspectionStatus;
};

export type InspectionStatusUpdate = {
  __typename?: 'InspectionStatusUpdate';
  endDate?: Maybe<Scalars['BulttiDate']>;
  id: Scalars['ID'];
  inspectionEndDate: Scalars['BulttiDate'];
  inspectionStartDate: Scalars['BulttiDate'];
  startDate?: Maybe<Scalars['BulttiDate']>;
  status: InspectionStatus;
  version: Scalars['Int'];
};

export type InspectionTimelineItem = {
  __typename?: 'InspectionTimelineItem';
  id: Scalars['ID'];
  inspectionEndDate: Scalars['BulttiDate'];
  inspectionStartDate: Scalars['BulttiDate'];
  operatorName: Scalars['String'];
  seasonId: Scalars['String'];
  version: Scalars['Int'];
};

export type InspectionUserRelation = {
  __typename?: 'InspectionUserRelation';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  postInspection?: Maybe<PostInspection>;
  preInspection?: Maybe<PreInspection>;
  relatedBy: InspectionUserRelationType;
  subscribed: Scalars['Boolean'];
  updatedAt: Scalars['DateTime'];
  user: User;
};

export type LateDeparturesReport = {
  __typename?: 'LateDeparturesReport';
  columnLabels: Scalars['String'];
  description: Scalars['String'];
  filteredCount: Scalars['Int'];
  filters?: Maybe<Array<FilterConfig>>;
  id: Scalars['String'];
  inspectionId: Scalars['String'];
  name: Scalars['String'];
  operatorId: Scalars['Float'];
  responseId: Scalars['String'];
  rows: Array<LateDeparturesReportData>;
  seasonId: Scalars['String'];
  showSanctioned?: Maybe<Scalars['Boolean']>;
  showUnsanctioned?: Maybe<Scalars['Boolean']>;
  sort?: Maybe<Array<SortConfig>>;
  title: Scalars['String'];
  totalCount: Scalars['Int'];
};

export type LateDeparturesReportData = {
  __typename?: 'LateDeparturesReportData';
  date: Scalars['String'];
  dayType: Scalars['String'];
  direction: Scalars['String'];
  id: Scalars['ID'];
  journeyEndTime: Scalars['String'];
  journeyKilometers: Scalars['Float'];
  journeyStartTime: Scalars['String'];
  observedArrivalTime: Scalars['DateTime'];
  observedDepartureTime: Scalars['DateTime'];
  observedLateArrivalSeconds: Scalars['Float'];
  observedLateDepartureSeconds: Scalars['Float'];
  procurementUnitId: Scalars['String'];
  registryNr: Scalars['String'];
  routeId: Scalars['String'];
  sanctionAmount?: Maybe<Scalars['Float']>;
  sanctionedKilometers?: Maybe<Scalars['Float']>;
  trackReason: TrackReason;
};

export type LinkedInspectionForWeek = {
  __typename?: 'LinkedInspectionForWeek';
  id: Scalars['String'];
  inspection: PreInspection;
  startOfWeek: Scalars['String'];
};

export type MissingBlockDeparturesReport = {
  __typename?: 'MissingBlockDeparturesReport';
  columnLabels: Scalars['String'];
  description: Scalars['String'];
  filteredCount: Scalars['Int'];
  filters?: Maybe<Array<FilterConfig>>;
  id: Scalars['String'];
  inspectionId: Scalars['String'];
  name: Scalars['String'];
  operatorId: Scalars['Float'];
  responseId: Scalars['String'];
  rows: Array<MissingBlockDeparturesReportData>;
  seasonId: Scalars['String'];
  showSanctioned?: Maybe<Scalars['Boolean']>;
  showUnsanctioned?: Maybe<Scalars['Boolean']>;
  sort?: Maybe<Array<SortConfig>>;
  title: Scalars['String'];
  totalCount: Scalars['Int'];
};

export type MissingBlockDeparturesReportData = {
  __typename?: 'MissingBlockDeparturesReportData';
  dayType: Scalars['String'];
  direction: Scalars['String'];
  id: Scalars['ID'];
  journeyEndTime: Scalars['String'];
  journeyStartTime: Scalars['String'];
  routeId: Scalars['String'];
  trackReason: TrackReason;
};

export type MissingEquipmentReport = {
  __typename?: 'MissingEquipmentReport';
  columnLabels: Scalars['String'];
  description: Scalars['String'];
  filteredCount: Scalars['Int'];
  filters?: Maybe<Array<FilterConfig>>;
  id: Scalars['String'];
  inspectionId: Scalars['String'];
  name: Scalars['String'];
  operatorId: Scalars['Float'];
  responseId: Scalars['String'];
  rows: Array<MissingEquipmentReportData>;
  seasonId: Scalars['String'];
  showSanctioned?: Maybe<Scalars['Boolean']>;
  showUnsanctioned?: Maybe<Scalars['Boolean']>;
  sort?: Maybe<Array<SortConfig>>;
  title: Scalars['String'];
  totalCount: Scalars['Int'];
};

export type MissingEquipmentReportData = {
  __typename?: 'MissingEquipmentReportData';
  blockNumber?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  registryNr?: Maybe<Scalars['String']>;
  vehicleId?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  abandonSanctions: PostInspection;
  addEquipmentToCatalogue?: Maybe<EquipmentCatalogue>;
  addEquipmentToExecutionRequirement?: Maybe<PlannedUnitExecutionRequirement>;
  batchAddToEquipmentCatalogue?: Maybe<EquipmentCatalogue>;
  clearCache: Scalars['Boolean'];
  createBlockDeparturesFromFile?: Maybe<Scalars['Boolean']>;
  createContract: Contract;
  createEquipmentCatalogue?: Maybe<EquipmentCatalogue>;
  createExecutionRequirementsForProcurementUnit?: Maybe<PlannedUnitExecutionRequirement>;
  createInspection?: Maybe<Inspection>;
  createInspectionDate: InspectionDate;
  createObservedExecutionRequirementsFromPreInspectionRequirements: Array<ObservedExecutionRequirement>;
  createTestData: Scalars['Boolean'];
  forceRemoveInspection: Scalars['Boolean'];
  generateEquipmentForPreInspection: Scalars['Boolean'];
  generateTestBlockDepartures: Array<DepartureBlockFile>;
  initInspectionContractUnitMap: PreInspection;
  inspectionSanctionable: PostInspection;
  loadHfpDataForInspectionPeriod: InspectionDate;
  login?: Maybe<Scalars['String']>;
  logout: Scalars['Boolean'];
  modifyContract: Contract;
  modifyUser: User;
  publishInspection: Inspection;
  refreshExecutionRequirementForProcurementUnit?: Maybe<PlannedUnitExecutionRequirement>;
  rejectInspection: Inspection;
  removeAllEquipmentFromCatalogue: EquipmentCatalogue;
  removeAllEquipmentFromExecutionRequirement?: Maybe<PlannedUnitExecutionRequirement>;
  removeContract: Scalars['Boolean'];
  removeDepartureBlocksForDayTypes: Scalars['Boolean'];
  removeEquipmentCatalogue: Scalars['Boolean'];
  removeEquipmentFromCatalogue?: Maybe<EquipmentCatalogue>;
  removeEquipmentFromExecutionRequirement: PlannedUnitExecutionRequirement;
  removeInspection: Scalars['Boolean'];
  removeInspectionDate: Scalars['Boolean'];
  removeObservedExecutionRequirementsFromPreInspection: Scalars['Boolean'];
  removeTestData: Scalars['Boolean'];
  removeUnitExecutionRequirement: Scalars['Boolean'];
  submitInspection: Inspection;
  toggleContractUserSubscribed?: Maybe<ContractUserRelation>;
  toggleInspectionUserSubscribed?: Maybe<InspectionUserRelation>;
  updateEquipment?: Maybe<Equipment>;
  updateEquipmentCatalogue: EquipmentCatalogue;
  updateEquipmentCatalogueQuota?: Maybe<Equipment>;
  updateEquipmentInCatalogue: EquipmentCatalogue;
  updateEquipmentRequirementQuota?: Maybe<Equipment>;
  updateInspection: Inspection;
  updateLinkedInspection: PostInspection;
  updateObservedExecutionRequirementValues: ObservedExecutionRequirement;
  updateProcurementUnit: ProcurementUnit;
  updateSanctions: Array<Sanction>;
  updateWeeklyExecutionMetersFromSource: PlannedUnitExecutionRequirement;
};


export type MutationAbandonSanctionsArgs = {
  inspectionId: Scalars['String'];
};


export type MutationAddEquipmentToCatalogueArgs = {
  catalogueId: Scalars['String'];
  equipmentId: Scalars['String'];
  quota: Scalars['Float'];
};


export type MutationAddEquipmentToExecutionRequirementArgs = {
  equipmentId: Scalars['String'];
  executionRequirementId: Scalars['String'];
};


export type MutationBatchAddToEquipmentCatalogueArgs = {
  catalogueId: Scalars['String'];
  vehicleIds: Array<Scalars['String']>;
};


export type MutationCreateBlockDeparturesFromFileArgs = {
  dayTypes: Array<Scalars['String']>;
  file?: Maybe<Scalars['Upload']>;
  inspectionId: Scalars['String'];
};


export type MutationCreateContractArgs = {
  contractInput: ContractInput;
  file: Scalars['Upload'];
};


export type MutationCreateEquipmentCatalogueArgs = {
  equipmentCatalogue: EquipmentCatalogueInput;
  operatorId: Scalars['Int'];
  procurementUnitId: Scalars['String'];
};


export type MutationCreateExecutionRequirementsForProcurementUnitArgs = {
  inspectionId: Scalars['String'];
  procurementUnitId: Scalars['String'];
};


export type MutationCreateInspectionArgs = {
  inspection: InitialInspectionInput;
};


export type MutationCreateInspectionDateArgs = {
  inspectionDate: InspectionDateInput;
};


export type MutationCreateObservedExecutionRequirementsFromPreInspectionRequirementsArgs = {
  postInspectionId: Scalars['String'];
};


export type MutationForceRemoveInspectionArgs = {
  inspectionId: Scalars['String'];
  testOnly?: Maybe<Scalars['Boolean']>;
};


export type MutationGenerateEquipmentForPreInspectionArgs = {
  inspectionId: Scalars['String'];
};


export type MutationInitInspectionContractUnitMapArgs = {
  inspectionId: Scalars['String'];
};


export type MutationInspectionSanctionableArgs = {
  inspectionId: Scalars['String'];
};


export type MutationLoadHfpDataForInspectionPeriodArgs = {
  inspectionDateId: Scalars['String'];
};


export type MutationLoginArgs = {
  authorizationCode: Scalars['String'];
  isTest?: Maybe<Scalars['Boolean']>;
  role?: Maybe<Scalars['String']>;
};


export type MutationModifyContractArgs = {
  contractInput: ContractInput;
  file?: Maybe<Scalars['Upload']>;
  operatorId: Scalars['Int'];
};


export type MutationModifyUserArgs = {
  userInput: UserInput;
};


export type MutationPublishInspectionArgs = {
  inspectionId: Scalars['String'];
};


export type MutationRefreshExecutionRequirementForProcurementUnitArgs = {
  executionRequirementId: Scalars['String'];
};


export type MutationRejectInspectionArgs = {
  inspectionId: Scalars['String'];
};


export type MutationRemoveAllEquipmentFromCatalogueArgs = {
  catalogueId: Scalars['String'];
};


export type MutationRemoveAllEquipmentFromExecutionRequirementArgs = {
  executionRequirementId: Scalars['String'];
};


export type MutationRemoveContractArgs = {
  contractId: Scalars['String'];
  operatorId: Scalars['Int'];
};


export type MutationRemoveDepartureBlocksForDayTypesArgs = {
  dayTypes: Array<Scalars['String']>;
  inspectionId: Scalars['String'];
};


export type MutationRemoveEquipmentCatalogueArgs = {
  catalogueId: Scalars['String'];
};


export type MutationRemoveEquipmentFromCatalogueArgs = {
  catalogueId: Scalars['String'];
  equipmentId: Scalars['String'];
};


export type MutationRemoveEquipmentFromExecutionRequirementArgs = {
  equipmentId: Scalars['String'];
  executionRequirementId: Scalars['String'];
};


export type MutationRemoveInspectionArgs = {
  inspectionId: Scalars['String'];
};


export type MutationRemoveInspectionDateArgs = {
  id: Scalars['String'];
};


export type MutationRemoveObservedExecutionRequirementsFromPreInspectionArgs = {
  postInspectionId: Scalars['String'];
};


export type MutationRemoveUnitExecutionRequirementArgs = {
  executionRequirementId: Scalars['String'];
};


export type MutationSubmitInspectionArgs = {
  endDate: Scalars['BulttiDate'];
  inspectionId: Scalars['String'];
  startDate: Scalars['BulttiDate'];
};


export type MutationToggleContractUserSubscribedArgs = {
  contractId: Scalars['String'];
  userId: Scalars['String'];
};


export type MutationToggleInspectionUserSubscribedArgs = {
  inspectionId: Scalars['String'];
  userId: Scalars['String'];
};


export type MutationUpdateEquipmentArgs = {
  equipmentId: Scalars['String'];
};


export type MutationUpdateEquipmentCatalogueArgs = {
  catalogueId: Scalars['String'];
  equipmentCatalogue: EquipmentCatalogueInput;
};


export type MutationUpdateEquipmentCatalogueQuotaArgs = {
  equipmentId: Scalars['String'];
  quota: Scalars['Float'];
  quotaId?: Maybe<Scalars['String']>;
};


export type MutationUpdateEquipmentInCatalogueArgs = {
  catalogueId: Scalars['String'];
};


export type MutationUpdateEquipmentRequirementQuotaArgs = {
  equipmentId: Scalars['String'];
  kilometers?: Maybe<Scalars['Float']>;
  quota?: Maybe<Scalars['Float']>;
  quotaId?: Maybe<Scalars['String']>;
};


export type MutationUpdateInspectionArgs = {
  inspection: InspectionInput;
  inspectionId: Scalars['String'];
};


export type MutationUpdateLinkedInspectionArgs = {
  inspectionId: Scalars['String'];
};


export type MutationUpdateObservedExecutionRequirementValuesArgs = {
  requirementId: Scalars['String'];
  updateValues: Array<ObservedRequirementValueInput>;
};


export type MutationUpdateProcurementUnitArgs = {
  procurementUnit: ProcurementUnitEditInput;
  procurementUnitId: Scalars['String'];
};


export type MutationUpdateSanctionsArgs = {
  sanctionUpdates: Array<SanctionUpdate>;
};


export type MutationUpdateWeeklyExecutionMetersFromSourceArgs = {
  date: Scalars['String'];
  executionRequirementId: Scalars['String'];
};

export type ObservedEmissionClassExecutionReport = {
  __typename?: 'ObservedEmissionClassExecutionReport';
  columnLabels: Scalars['String'];
  description: Scalars['String'];
  filteredCount: Scalars['Int'];
  filters?: Maybe<Array<FilterConfig>>;
  id: Scalars['String'];
  inspectionId: Scalars['String'];
  name: Scalars['String'];
  operatorId: Scalars['Float'];
  responseId: Scalars['String'];
  rows: Array<ObservedEmissionClassExecutionReportData>;
  seasonId: Scalars['String'];
  showSanctioned?: Maybe<Scalars['Boolean']>;
  showUnsanctioned?: Maybe<Scalars['Boolean']>;
  sort?: Maybe<Array<SortConfig>>;
  title: Scalars['String'];
  totalCount: Scalars['Int'];
};

export type ObservedEmissionClassExecutionReportData = {
  __typename?: 'ObservedEmissionClassExecutionReportData';
  class1?: Maybe<Scalars['Float']>;
  class10?: Maybe<Scalars['Float']>;
  class2?: Maybe<Scalars['Float']>;
  class3?: Maybe<Scalars['Float']>;
  class4?: Maybe<Scalars['Float']>;
  class5?: Maybe<Scalars['Float']>;
  class6?: Maybe<Scalars['Float']>;
  class7?: Maybe<Scalars['Float']>;
  class8?: Maybe<Scalars['Float']>;
  class9?: Maybe<Scalars['Float']>;
  id: Scalars['ID'];
  procurementUnitId?: Maybe<Scalars['String']>;
};

export type ObservedEmissionClassRequirement = {
  __typename?: 'ObservedEmissionClassRequirement';
  cumulativeDifferencePercentage?: Maybe<Scalars['Float']>;
  differenceKilometers?: Maybe<Scalars['Float']>;
  differencePercentage?: Maybe<Scalars['Float']>;
  emissionClass: Scalars['Int'];
  equipmentCountObserved?: Maybe<Scalars['Int']>;
  equipmentCountRequired?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['ID']>;
  kilometersObserved?: Maybe<Scalars['Float']>;
  kilometersRequired?: Maybe<Scalars['Float']>;
  observedExecutionRequirement: ObservedExecutionRequirement;
  quotaObserved?: Maybe<Scalars['Float']>;
  quotaRequired?: Maybe<Scalars['Float']>;
  sanctionAmount?: Maybe<Scalars['Float']>;
  sanctionThreshold?: Maybe<Scalars['Float']>;
  sanctionablePercentage?: Maybe<Scalars['Float']>;
};

export type ObservedEquipmentColorReport = {
  __typename?: 'ObservedEquipmentColorReport';
  columnLabels: Scalars['String'];
  description: Scalars['String'];
  filteredCount: Scalars['Int'];
  filters?: Maybe<Array<FilterConfig>>;
  id: Scalars['String'];
  inspectionId: Scalars['String'];
  name: Scalars['String'];
  operatorId: Scalars['Float'];
  responseId: Scalars['String'];
  rows: Array<ObservedEquipmentColorReportData>;
  seasonId: Scalars['String'];
  showSanctioned?: Maybe<Scalars['Boolean']>;
  showUnsanctioned?: Maybe<Scalars['Boolean']>;
  sort?: Maybe<Array<SortConfig>>;
  title: Scalars['String'];
  totalCount: Scalars['Int'];
};

export type ObservedEquipmentColorReportData = {
  __typename?: 'ObservedEquipmentColorReportData';
  date: Scalars['String'];
  dayType: Scalars['String'];
  direction: Scalars['String'];
  id: Scalars['ID'];
  journeyEndTime: Scalars['String'];
  journeyKilometers: Scalars['Float'];
  journeyStartTime: Scalars['String'];
  observedArrivalTime: Scalars['DateTime'];
  observedDepartureTime: Scalars['DateTime'];
  observedExteriorColor: Scalars['String'];
  procurementUnitId: Scalars['String'];
  registryNr: Scalars['String'];
  routeId: Scalars['String'];
  sanctionAmount?: Maybe<Scalars['Float']>;
  sanctionedKilometers?: Maybe<Scalars['Float']>;
  trackReason: TrackReason;
};

export type ObservedEquipmentTypeReport = {
  __typename?: 'ObservedEquipmentTypeReport';
  columnLabels: Scalars['String'];
  description: Scalars['String'];
  filteredCount: Scalars['Int'];
  filters?: Maybe<Array<FilterConfig>>;
  id: Scalars['String'];
  inspectionId: Scalars['String'];
  name: Scalars['String'];
  operatorId: Scalars['Float'];
  responseId: Scalars['String'];
  rows: Array<ObservedEquipmentTypeReportData>;
  seasonId: Scalars['String'];
  showSanctioned?: Maybe<Scalars['Boolean']>;
  showUnsanctioned?: Maybe<Scalars['Boolean']>;
  sort?: Maybe<Array<SortConfig>>;
  title: Scalars['String'];
  totalCount: Scalars['Int'];
};

export type ObservedEquipmentTypeReportData = {
  __typename?: 'ObservedEquipmentTypeReportData';
  date: Scalars['String'];
  dayType: Scalars['String'];
  direction: Scalars['String'];
  equipmentTypeRequired: Scalars['Boolean'];
  id: Scalars['ID'];
  journeyEndTime: Scalars['String'];
  journeyKilometers: Scalars['Float'];
  journeyStartTime: Scalars['String'];
  observedArrivalTime: Scalars['DateTime'];
  observedDepartureTime: Scalars['DateTime'];
  observedEquipmentType: Scalars['String'];
  plannedEquipmentType: Scalars['String'];
  procurementUnitId: Scalars['String'];
  registryNr: Scalars['String'];
  routeId: Scalars['String'];
  sanctionAmount?: Maybe<Scalars['Float']>;
  sanctionedKilometers?: Maybe<Scalars['Float']>;
  trackReason: TrackReason;
};

export type ObservedExecutionRequirement = {
  __typename?: 'ObservedExecutionRequirement';
  area: OperatingArea;
  areaId: Scalars['Int'];
  endDate: Scalars['BulttiDate'];
  id: Scalars['ID'];
  inspection: PostInspection;
  inspectionId: Scalars['String'];
  isCombinedAreaRequirement: Scalars['Boolean'];
  kilometersObserved?: Maybe<Scalars['Float']>;
  kilometersRequired?: Maybe<Scalars['Float']>;
  metersObserved?: Maybe<Scalars['Float']>;
  metersRequired?: Maybe<Scalars['Float']>;
  observedRequirements: Array<ObservedEmissionClassRequirement>;
  operator: Operator;
  operatorId: Scalars['Int'];
  startDate: Scalars['BulttiDate'];
};

export type ObservedExecutionRequirementsReport = {
  __typename?: 'ObservedExecutionRequirementsReport';
  columnLabels: Scalars['String'];
  description: Scalars['String'];
  filteredCount: Scalars['Int'];
  filters?: Maybe<Array<FilterConfig>>;
  id: Scalars['String'];
  inspectionId: Scalars['String'];
  name: Scalars['String'];
  operatorId: Scalars['Float'];
  responseId: Scalars['String'];
  rows: Array<ObservedExecutionRequirementsReportData>;
  seasonId: Scalars['String'];
  showSanctioned?: Maybe<Scalars['Boolean']>;
  showUnsanctioned?: Maybe<Scalars['Boolean']>;
  sort?: Maybe<Array<SortConfig>>;
  title: Scalars['String'];
  totalCount: Scalars['Int'];
};

export type ObservedExecutionRequirementsReportData = {
  __typename?: 'ObservedExecutionRequirementsReportData';
  areaName: Scalars['String'];
  endDate: Scalars['BulttiDate'];
  id: Scalars['ID'];
  observedRequirements: Array<ObservedEmissionClassRequirement>;
  operatorId: Scalars['Int'];
  startDate: Scalars['BulttiDate'];
  totalKilometersObserved: Scalars['Float'];
  totalKilometersRequired: Scalars['Float'];
};

export type ObservedOverAgeDeparturesReport = {
  __typename?: 'ObservedOverAgeDeparturesReport';
  columnLabels: Scalars['String'];
  description: Scalars['String'];
  filteredCount: Scalars['Int'];
  filters?: Maybe<Array<FilterConfig>>;
  id: Scalars['String'];
  inspectionId: Scalars['String'];
  name: Scalars['String'];
  operatorId: Scalars['Float'];
  responseId: Scalars['String'];
  rows: Array<ObservedOverAgeDeparturesReportData>;
  seasonId: Scalars['String'];
  showSanctioned?: Maybe<Scalars['Boolean']>;
  showUnsanctioned?: Maybe<Scalars['Boolean']>;
  sort?: Maybe<Array<SortConfig>>;
  title: Scalars['String'];
  totalCount: Scalars['Int'];
};

export type ObservedOverAgeDeparturesReportData = {
  __typename?: 'ObservedOverAgeDeparturesReportData';
  date: Scalars['String'];
  dayType: Scalars['String'];
  direction: Scalars['String'];
  id: Scalars['ID'];
  journeyEndTime: Scalars['String'];
  journeyKilometers: Scalars['Float'];
  journeyStartTime: Scalars['String'];
  observedArrivalTime: Scalars['DateTime'];
  observedDepartureTime: Scalars['DateTime'];
  observedEquipmentAge: Scalars['Float'];
  overAgeType: Scalars['String'];
  procurementUnitId: Scalars['String'];
  registryNr: Scalars['String'];
  routeId: Scalars['String'];
  sanctionAmount?: Maybe<Scalars['Float']>;
  sanctionedKilometers?: Maybe<Scalars['Float']>;
  trackReason: TrackReason;
};

export type ObservedUnitExecution = {
  __typename?: 'ObservedUnitExecution';
  area?: Maybe<OperatingAreaName>;
  averageAgeMax?: Maybe<Scalars['Float']>;
  averageAgeRequired?: Maybe<Scalars['Float']>;
  averageAgeWeightedObserved?: Maybe<Scalars['Float']>;
  id: Scalars['ID'];
  procurementUnitId: Scalars['String'];
  sanctionAmount?: Maybe<Scalars['Float']>;
  sanctionedKilometers?: Maybe<Scalars['Float']>;
  totalKilometersObserved?: Maybe<Scalars['Float']>;
  totalUnitKilometers: Scalars['Float'];
};

export type ObservedUnitExecutionReport = {
  __typename?: 'ObservedUnitExecutionReport';
  columnLabels: Scalars['String'];
  description: Scalars['String'];
  filteredCount: Scalars['Int'];
  filters?: Maybe<Array<FilterConfig>>;
  id: Scalars['String'];
  inspectionId: Scalars['String'];
  name: Scalars['String'];
  operatorId: Scalars['Float'];
  responseId: Scalars['String'];
  rows: Array<ObservedUnitExecution>;
  seasonId: Scalars['String'];
  showSanctioned?: Maybe<Scalars['Boolean']>;
  showUnsanctioned?: Maybe<Scalars['Boolean']>;
  sort?: Maybe<Array<SortConfig>>;
  title: Scalars['String'];
  totalCount: Scalars['Int'];
};

export type OperatingArea = {
  __typename?: 'OperatingArea';
  areaExecutionRequirements?: Maybe<Array<PlannedAreaExecutionRequirement>>;
  id: Scalars['Int'];
  name: OperatingAreaName;
  observedExecutionRequirements?: Maybe<Array<ObservedExecutionRequirement>>;
  procurementUnits?: Maybe<Array<ProcurementUnit>>;
  unitExecutionRequirements?: Maybe<Array<PlannedUnitExecutionRequirement>>;
};

export type Operator = {
  __typename?: 'Operator';
  contracts: Array<Contract>;
  equipment: Array<Equipment>;
  equipmentCatalogues: Array<EquipmentCatalogue>;
  id: Scalars['Int'];
  operatorId: Scalars['Int'];
  operatorName: Scalars['String'];
  postInspections: Array<PostInspection>;
  preInspections: Array<PreInspection>;
  procurementUnits: Array<ProcurementUnit>;
};

export type OperatorDeadrunsReport = {
  __typename?: 'OperatorDeadrunsReport';
  columnLabels: Scalars['String'];
  description: Scalars['String'];
  filteredCount: Scalars['Int'];
  filters?: Maybe<Array<FilterConfig>>;
  id: Scalars['String'];
  inspectionId: Scalars['String'];
  name: Scalars['String'];
  operatorId: Scalars['Float'];
  responseId: Scalars['String'];
  rows: Array<DeadrunsReportData>;
  seasonId: Scalars['String'];
  showSanctioned?: Maybe<Scalars['Boolean']>;
  showUnsanctioned?: Maybe<Scalars['Boolean']>;
  sort?: Maybe<Array<SortConfig>>;
  title: Scalars['String'];
  totalCount: Scalars['Int'];
};

export type OverAgeDeparturesReport = {
  __typename?: 'OverAgeDeparturesReport';
  columnLabels: Scalars['String'];
  description: Scalars['String'];
  filteredCount: Scalars['Int'];
  filters?: Maybe<Array<FilterConfig>>;
  id: Scalars['String'];
  inspectionId: Scalars['String'];
  name: Scalars['String'];
  operatorId: Scalars['Float'];
  responseId: Scalars['String'];
  rows: Array<OverAgeDeparturesReportData>;
  seasonId: Scalars['String'];
  showSanctioned?: Maybe<Scalars['Boolean']>;
  showUnsanctioned?: Maybe<Scalars['Boolean']>;
  sort?: Maybe<Array<SortConfig>>;
  title: Scalars['String'];
  totalCount: Scalars['Int'];
};

export type OverAgeDeparturesReportData = {
  __typename?: 'OverAgeDeparturesReportData';
  dayType: Scalars['String'];
  direction: Scalars['String'];
  id: Scalars['ID'];
  journeyEndTime: Scalars['String'];
  journeyStartTime: Scalars['String'];
  observedEquipmentAge: Scalars['Float'];
  overAgeType: Scalars['String'];
  registryNr: Scalars['String'];
  routeId: Scalars['String'];
  trackReason: TrackReason;
};

export type PlannedAreaExecutionRequirement = {
  __typename?: 'PlannedAreaExecutionRequirement';
  area: OperatingArea;
  areaId: Scalars['Int'];
  averageAgeRequirement?: Maybe<Scalars['Float']>;
  averageAgeWeighted?: Maybe<Scalars['Float']>;
  averageAgeWeightedFulfilled?: Maybe<Scalars['Float']>;
  id: Scalars['ID'];
  inspection: PreInspection;
  inspectionId: Scalars['String'];
  kilometersObserved?: Maybe<Scalars['Float']>;
  kilometersRequired?: Maybe<Scalars['Float']>;
  metersObserved?: Maybe<Scalars['Float']>;
  metersRequired?: Maybe<Scalars['Float']>;
  operator: Operator;
  operatorId: Scalars['Int'];
  procurementUnitRequirements?: Maybe<Array<PlannedUnitExecutionRequirement>>;
  requirements: Array<PlannedEmissionClassRequirement>;
};

export type PlannedEmissionClassRequirement = {
  __typename?: 'PlannedEmissionClassRequirement';
  classSanctionAmount?: Maybe<Scalars['Float']>;
  cumulativeDifferencePercentage?: Maybe<Scalars['Float']>;
  differencePercentage?: Maybe<Scalars['Float']>;
  emissionClass: Scalars['Int'];
  equipmentCount?: Maybe<Scalars['Int']>;
  equipmentCountFulfilled?: Maybe<Scalars['Int']>;
  kilometerRequirement?: Maybe<Scalars['Float']>;
  kilometersFulfilled?: Maybe<Scalars['Float']>;
  quotaFulfilled?: Maybe<Scalars['Float']>;
  quotaRequirement?: Maybe<Scalars['Float']>;
  sanctionAmount?: Maybe<Scalars['Float']>;
  sanctionThreshold?: Maybe<Scalars['Float']>;
};

export type PlannedExecutionRequirement = {
  __typename?: 'PlannedExecutionRequirement';
  averageAgeRequirement?: Maybe<Scalars['Float']>;
  averageAgeWeighted?: Maybe<Scalars['Float']>;
  averageAgeWeightedFulfilled?: Maybe<Scalars['Float']>;
  id: Scalars['ID'];
  kilometersObserved?: Maybe<Scalars['Float']>;
  kilometersRequired?: Maybe<Scalars['Float']>;
  metersObserved?: Maybe<Scalars['Float']>;
  metersRequired?: Maybe<Scalars['Float']>;
};

export type PlannedUnitExecutionRequirement = {
  __typename?: 'PlannedUnitExecutionRequirement';
  area: OperatingArea;
  areaId: Scalars['Int'];
  areaRequirement?: Maybe<PlannedExecutionRequirement>;
  averageAgeRequirement?: Maybe<Scalars['Float']>;
  averageAgeWeighted?: Maybe<Scalars['Float']>;
  averageAgeWeightedFulfilled?: Maybe<Scalars['Float']>;
  equipmentQuotas: Array<ExecutionRequirementQuota>;
  id: Scalars['ID'];
  inspection: PreInspection;
  inspectionId: Scalars['String'];
  kilometersObserved?: Maybe<Scalars['Float']>;
  kilometersRequired?: Maybe<Scalars['Float']>;
  metersObserved?: Maybe<Scalars['Float']>;
  metersRequired?: Maybe<Scalars['Float']>;
  operator: Operator;
  operatorId: Scalars['Int'];
  procurementUnit: ProcurementUnit;
  procurementUnitId: Scalars['String'];
  requirements: Array<PlannedEmissionClassRequirement>;
};

export type PostInspection = {
  __typename?: 'PostInspection';
  createdAt: Scalars['DateTime'];
  endDate?: Maybe<Scalars['BulttiDate']>;
  id: Scalars['ID'];
  inspectionDate?: Maybe<InspectionDate>;
  inspectionDateId?: Maybe<Scalars['String']>;
  inspectionEndDate: Scalars['BulttiDate'];
  inspectionErrors?: Maybe<Array<ValidationErrorData>>;
  inspectionStartDate: Scalars['BulttiDate'];
  inspectionType: InspectionType;
  linkedInspectionUpdateAvailable?: Maybe<Scalars['Boolean']>;
  linkedInspections?: Maybe<Array<LinkedInspectionForWeek>>;
  minStartDate: Scalars['BulttiDate'];
  name?: Maybe<Scalars['String']>;
  observedExecutionRequirements: Array<ObservedExecutionRequirement>;
  operator: Operator;
  operatorId: Scalars['Int'];
  season: Season;
  seasonId: Scalars['String'];
  startDate?: Maybe<Scalars['BulttiDate']>;
  status: InspectionStatus;
  updatedAt: Scalars['DateTime'];
  userRelations?: Maybe<Array<InspectionUserRelation>>;
  version: Scalars['Int'];
  versionStackIdentifier?: Maybe<Scalars['String']>;
};

export type PreInspection = {
  __typename?: 'PreInspection';
  areaExecutionRequirements: Array<PlannedAreaExecutionRequirement>;
  createdAt: Scalars['DateTime'];
  endDate?: Maybe<Scalars['BulttiDate']>;
  id: Scalars['ID'];
  inspectionEndDate: Scalars['BulttiDate'];
  inspectionErrors?: Maybe<Array<ValidationErrorData>>;
  inspectionStartDate: Scalars['BulttiDate'];
  inspectionType: InspectionType;
  minStartDate: Scalars['BulttiDate'];
  name?: Maybe<Scalars['String']>;
  operator: Operator;
  operatorId: Scalars['Int'];
  season: Season;
  seasonId: Scalars['String'];
  startDate?: Maybe<Scalars['BulttiDate']>;
  status: InspectionStatus;
  unitExecutionRequirements: Array<PlannedUnitExecutionRequirement>;
  updatedAt: Scalars['DateTime'];
  userRelations?: Maybe<Array<InspectionUserRelation>>;
  version: Scalars['Int'];
  versionStackIdentifier?: Maybe<Scalars['String']>;
};

export type ProcurementUnit = {
  __typename?: 'ProcurementUnit';
  area?: Maybe<OperatingArea>;
  areaId?: Maybe<Scalars['Int']>;
  contracts: Array<Contract>;
  currentContracts?: Maybe<Array<Contract>>;
  endDate: Scalars['BulttiDate'];
  equipmentCatalogues: Array<EquipmentCatalogue>;
  executionRequirements: Array<PlannedUnitExecutionRequirement>;
  id: Scalars['ID'];
  medianAgeRequirement: Scalars['Float'];
  operator: Operator;
  operatorId: Scalars['Int'];
  optionsUsed: Scalars['Int'];
  procurementUnitId: Scalars['String'];
  routes: Array<ProcurementUnitRoute>;
  startDate: Scalars['BulttiDate'];
};

export type ProcurementUnitOption = {
  __typename?: 'ProcurementUnitOption';
  areaName?: Maybe<Scalars['String']>;
  currentContracts?: Maybe<Array<Contract>>;
  endDate: Scalars['BulttiDate'];
  id: Scalars['String'];
  isUnselectingDisabled: Scalars['Boolean'];
  name: Scalars['String'];
  routes: Array<Scalars['String']>;
  startDate: Scalars['BulttiDate'];
};

export type ProcurementUnitRoute = {
  __typename?: 'ProcurementUnitRoute';
  routeId: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  allDeviationsReport?: Maybe<DeviationsReport>;
  allInspectionDates: Array<InspectionDate>;
  allInspections: Array<Inspection>;
  availableDayTypes: Array<Scalars['String']>;
  blockDeviationsReport?: Maybe<BlockDeviationsReport>;
  contract?: Maybe<Contract>;
  contractProcurementUnitOptions: Array<ProcurementUnitOption>;
  contractUserRelations: Array<ContractUserRelation>;
  contracts: Array<Contract>;
  contractsByProcurementUnit: Array<Contract>;
  currentInspectionsByOperatorAndSeason: Array<Inspection>;
  currentUser?: Maybe<User>;
  currentlyLoadingHfpRanges: Array<HfpDateStatus>;
  deadrunsReport?: Maybe<DeadrunsReport>;
  departureBlocksReport?: Maybe<DepartureBlocksReport>;
  earlyTimingStopDeparturesReport?: Maybe<EarlyTimingStopDeparturesReport>;
  emissionClassExecutionReport?: Maybe<EmissionClassExecutionReport>;
  equipment: Array<Equipment>;
  equipmentByOperator: Array<Equipment>;
  equipmentCatalogue?: Maybe<EquipmentCatalogue>;
  equipmentCatalogueByOperator: Array<EquipmentCatalogue>;
  equipmentColorReport?: Maybe<EquipmentColorReport>;
  equipmentTypeReport?: Maybe<EquipmentTypeReport>;
  executionRequirementForProcurementUnit?: Maybe<PlannedUnitExecutionRequirement>;
  executionRequirementsByOperator: Array<PlannedUnitExecutionRequirement>;
  executionRequirementsForPreInspectionAreas: Array<PlannedAreaExecutionRequirement>;
  executionRequirementsReport?: Maybe<ExecutionRequirementsReport>;
  executionSchemaStats?: Maybe<ExecutionSchemaStats>;
  extraBlockDeparturesReport?: Maybe<ExtraBlockDeparturesReport>;
  getObservedInspectionDates: Array<InspectionDate>;
  inspection: Inspection;
  inspectionSanctions: SanctionsResponse;
  inspectionUserRelations: Array<InspectionUserRelation>;
  inspectionsByOperator: Array<Inspection>;
  inspectionsTimeline: Array<InspectionTimelineItem>;
  missingBlockDeparturesReport?: Maybe<MissingBlockDeparturesReport>;
  missingEquipmentReport?: Maybe<MissingEquipmentReport>;
  observedEmissionClassExecutionReport?: Maybe<ObservedEmissionClassExecutionReport>;
  observedEquipmentColorReport?: Maybe<ObservedEquipmentColorReport>;
  observedEquipmentTypeReport?: Maybe<ObservedEquipmentTypeReport>;
  observedExecutionRequirements: Array<ObservedExecutionRequirement>;
  observedExecutionRequirementsReport?: Maybe<ObservedExecutionRequirementsReport>;
  observedLateDeparturesReport?: Maybe<LateDeparturesReport>;
  observedOverageDeparturesReport?: Maybe<ObservedOverAgeDeparturesReport>;
  observedUnitExecutionReport?: Maybe<ObservedUnitExecutionReport>;
  operator?: Maybe<Operator>;
  operatorDeadrunsReport?: Maybe<OperatorDeadrunsReport>;
  operators: Array<Operator>;
  overageDeparturesReport?: Maybe<OverAgeDeparturesReport>;
  previewObservedRequirement?: Maybe<ObservedExecutionRequirement>;
  procurementUnit?: Maybe<ProcurementUnit>;
  procurementUnitsByOperator: Array<ProcurementUnit>;
  queryEquipmentFromSource?: Maybe<Equipment>;
  reports: Array<ReportListItem>;
  runSanctioning: Array<Sanction>;
  sanctionSummaryReport?: Maybe<SanctionSummaryReport>;
  season?: Maybe<Array<Season>>;
  seasons: Array<Season>;
  singleEquipment?: Maybe<Equipment>;
  trackedDeparturesReport?: Maybe<TrackedDeparturesReport>;
  unitExecutionReport?: Maybe<UnitExecutionReport>;
  unobservedDeparturesReport?: Maybe<UnobservedDeparturesReport>;
  user?: Maybe<User>;
  users: Array<User>;
};


export type QueryAllDeviationsReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>;
  inspectionId: Scalars['String'];
  sort?: Maybe<Array<InputSortConfig>>;
};


export type QueryAllInspectionsArgs = {
  inspectionType: InspectionType;
};


export type QueryAvailableDayTypesArgs = {
  inspectionId: Scalars['String'];
};


export type QueryBlockDeviationsReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>;
  inspectionId: Scalars['String'];
  sort?: Maybe<Array<InputSortConfig>>;
};


export type QueryContractArgs = {
  contractId: Scalars['String'];
};


export type QueryContractProcurementUnitOptionsArgs = {
  contractId: Scalars['String'];
  endDate: Scalars['BulttiDate'];
  operatorId: Scalars['Int'];
  startDate: Scalars['BulttiDate'];
};


export type QueryContractUserRelationsArgs = {
  contractId: Scalars['String'];
};


export type QueryContractsArgs = {
  date?: Maybe<Scalars['BulttiDate']>;
  operatorId?: Maybe<Scalars['Int']>;
};


export type QueryContractsByProcurementUnitArgs = {
  procurementUnitId: Scalars['String'];
};


export type QueryCurrentInspectionsByOperatorAndSeasonArgs = {
  inspectionType: InspectionType;
  operatorId: Scalars['Int'];
  seasonId: Scalars['String'];
};


export type QueryDeadrunsReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>;
  inspectionId: Scalars['String'];
  sort?: Maybe<Array<InputSortConfig>>;
};


export type QueryDepartureBlocksReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>;
  inspectionId: Scalars['String'];
  sort?: Maybe<Array<InputSortConfig>>;
};


export type QueryEarlyTimingStopDeparturesReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>;
  inspectionId: Scalars['String'];
  sort?: Maybe<Array<InputSortConfig>>;
};


export type QueryEmissionClassExecutionReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>;
  inspectionId: Scalars['String'];
  sort?: Maybe<Array<InputSortConfig>>;
};


export type QueryEquipmentByOperatorArgs = {
  operatorId: Scalars['Int'];
};


export type QueryEquipmentCatalogueArgs = {
  equipmentCatalogueId: Scalars['String'];
};


export type QueryEquipmentCatalogueByOperatorArgs = {
  operatorId: Scalars['Int'];
};


export type QueryEquipmentColorReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>;
  inspectionId: Scalars['String'];
  sort?: Maybe<Array<InputSortConfig>>;
};


export type QueryEquipmentTypeReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>;
  inspectionId: Scalars['String'];
  sort?: Maybe<Array<InputSortConfig>>;
};


export type QueryExecutionRequirementForProcurementUnitArgs = {
  inspectionId: Scalars['String'];
  procurementUnitId: Scalars['String'];
};


export type QueryExecutionRequirementsByOperatorArgs = {
  operatorId: Scalars['Int'];
};


export type QueryExecutionRequirementsForPreInspectionAreasArgs = {
  inspectionId: Scalars['String'];
};


export type QueryExecutionRequirementsReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>;
  inspectionId: Scalars['String'];
  sort?: Maybe<Array<InputSortConfig>>;
};


export type QueryExecutionSchemaStatsArgs = {
  executionRequirementId: Scalars['String'];
};


export type QueryExtraBlockDeparturesReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>;
  inspectionId: Scalars['String'];
  sort?: Maybe<Array<InputSortConfig>>;
};


export type QueryGetObservedInspectionDatesArgs = {
  seasonId: Scalars['String'];
};


export type QueryInspectionArgs = {
  inspectionId: Scalars['String'];
};


export type QueryInspectionSanctionsArgs = {
  filters?: Maybe<Array<InputFilterConfig>>;
  inspectionId: Scalars['String'];
  sort?: Maybe<Array<InputSortConfig>>;
};


export type QueryInspectionUserRelationsArgs = {
  inspectionId: Scalars['String'];
};


export type QueryInspectionsByOperatorArgs = {
  inspectionType: InspectionType;
  operatorId: Scalars['Int'];
};


export type QueryInspectionsTimelineArgs = {
  inspectionType: InspectionType;
  operatorId: Scalars['Int'];
};


export type QueryMissingBlockDeparturesReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>;
  inspectionId: Scalars['String'];
  sort?: Maybe<Array<InputSortConfig>>;
};


export type QueryMissingEquipmentReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>;
  inspectionId: Scalars['String'];
  sort?: Maybe<Array<InputSortConfig>>;
};


export type QueryObservedEmissionClassExecutionReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>;
  inspectionId: Scalars['String'];
  sort?: Maybe<Array<InputSortConfig>>;
};


export type QueryObservedEquipmentColorReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>;
  inspectionId: Scalars['String'];
  sort?: Maybe<Array<InputSortConfig>>;
};


export type QueryObservedEquipmentTypeReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>;
  inspectionId: Scalars['String'];
  sort?: Maybe<Array<InputSortConfig>>;
};


export type QueryObservedExecutionRequirementsArgs = {
  postInspectionId: Scalars['String'];
};


export type QueryObservedExecutionRequirementsReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>;
  inspectionId: Scalars['String'];
  sort?: Maybe<Array<InputSortConfig>>;
};


export type QueryObservedLateDeparturesReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>;
  inspectionId: Scalars['String'];
  sort?: Maybe<Array<InputSortConfig>>;
};


export type QueryObservedOverageDeparturesReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>;
  inspectionId: Scalars['String'];
  sort?: Maybe<Array<InputSortConfig>>;
};


export type QueryObservedUnitExecutionReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>;
  inspectionId: Scalars['String'];
  sort?: Maybe<Array<InputSortConfig>>;
};


export type QueryOperatorArgs = {
  operatorId: Scalars['Int'];
};


export type QueryOperatorDeadrunsReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>;
  inspectionId: Scalars['String'];
  sort?: Maybe<Array<InputSortConfig>>;
};


export type QueryOverageDeparturesReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>;
  inspectionId: Scalars['String'];
  sort?: Maybe<Array<InputSortConfig>>;
};


export type QueryPreviewObservedRequirementArgs = {
  requirementId: Scalars['String'];
};


export type QueryProcurementUnitArgs = {
  endDate: Scalars['BulttiDate'];
  procurementUnitId: Scalars['String'];
  startDate: Scalars['BulttiDate'];
};


export type QueryProcurementUnitsByOperatorArgs = {
  endDate: Scalars['BulttiDate'];
  operatorId: Scalars['Int'];
  startDate: Scalars['BulttiDate'];
};


export type QueryQueryEquipmentFromSourceArgs = {
  operatorId: Scalars['Int'];
  registryNr?: Maybe<Scalars['String']>;
  vehicleId?: Maybe<Scalars['String']>;
};


export type QueryReportsArgs = {
  inspectionId?: Maybe<Scalars['String']>;
  inspectionType: Scalars['String'];
};


export type QueryRunSanctioningArgs = {
  inspectionId: Scalars['String'];
};


export type QuerySanctionSummaryReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>;
  inspectionId: Scalars['String'];
  sort?: Maybe<Array<InputSortConfig>>;
};


export type QuerySeasonArgs = {
  seasonId: Scalars['String'];
};


export type QuerySeasonsArgs = {
  date: Scalars['BulttiDate'];
};


export type QuerySingleEquipmentArgs = {
  equipmentId: Scalars['String'];
};


export type QueryTrackedDeparturesReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>;
  inspectionId: Scalars['String'];
  sort?: Maybe<Array<InputSortConfig>>;
};


export type QueryUnitExecutionReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>;
  inspectionId: Scalars['String'];
  sort?: Maybe<Array<InputSortConfig>>;
};


export type QueryUnobservedDeparturesReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>;
  inspectionId: Scalars['String'];
  sort?: Maybe<Array<InputSortConfig>>;
};


export type QueryUserArgs = {
  userId: Scalars['Int'];
};

export type ReportListItem = {
  __typename?: 'ReportListItem';
  description: Scalars['String'];
  name: Scalars['String'];
  title: Scalars['String'];
};

export type Sanction = {
  __typename?: 'Sanction';
  appliedSanctionAmount: Scalars['Float'];
  area?: Maybe<OperatingAreaName>;
  entityIdentifier: Scalars['String'];
  id: Scalars['ID'];
  inspection: PostInspection;
  inspectionId: Scalars['String'];
  matchesException?: Maybe<SanctionException>;
  procurementUnitId?: Maybe<Scalars['String']>;
  sanctionAmount: Scalars['Float'];
  sanctionReason: SanctionReason;
  sanctionResultKilometers?: Maybe<Scalars['Float']>;
  sanctionableKilometers: Scalars['Float'];
  sanctionableType: SanctionableEntity;
  sanctionableValue?: Maybe<Scalars['String']>;
};

export type SanctionException = {
  __typename?: 'SanctionException';
  departureProperty: Scalars['String'];
  exceptionAppliesToReason: SanctionExceptionReason;
  exceptionValue: Scalars['String'];
  id: Scalars['ID'];
};

export type SanctionSummaryReport = {
  __typename?: 'SanctionSummaryReport';
  columnLabels: Scalars['String'];
  description: Scalars['String'];
  filteredCount: Scalars['Int'];
  filters?: Maybe<Array<FilterConfig>>;
  id: Scalars['String'];
  inspectionId: Scalars['String'];
  name: Scalars['String'];
  operatorId: Scalars['Float'];
  responseId: Scalars['String'];
  rows: Array<SanctionSummaryReportData>;
  seasonId: Scalars['String'];
  showSanctioned?: Maybe<Scalars['Boolean']>;
  showUnsanctioned?: Maybe<Scalars['Boolean']>;
  sort?: Maybe<Array<SortConfig>>;
  title: Scalars['String'];
  totalCount: Scalars['Int'];
};

export type SanctionSummaryReportData = {
  __typename?: 'SanctionSummaryReportData';
  areaName: Scalars['String'];
  averageAgeWeightedObserved: Scalars['Float'];
  id: Scalars['ID'];
  procurementUnitId: Scalars['String'];
  sanctionAmount: Scalars['Float'];
  sanctionAmountRatio: Scalars['Float'];
  sanctionReason: SanctionReason;
  sanctionedKilometers: Scalars['Float'];
};

export type SanctionsResponse = {
  __typename?: 'SanctionsResponse';
  filteredCount: Scalars['Int'];
  filters?: Maybe<Array<FilterConfig>>;
  id: Scalars['String'];
  inspectionId: Scalars['String'];
  responseId: Scalars['String'];
  rows: Array<Sanction>;
  sort?: Maybe<Array<SortConfig>>;
  totalCount: Scalars['Int'];
};

export type Season = {
  __typename?: 'Season';
  endDate: Scalars['BulttiDate'];
  id: Scalars['ID'];
  postInspections: Array<PostInspection>;
  preInspections: Array<PreInspection>;
  season: Scalars['String'];
  startDate: Scalars['BulttiDate'];
};

export type SortConfig = {
  __typename?: 'SortConfig';
  column: Scalars['String'];
  order: SortOrder;
};

export type Subscription = {
  __typename?: 'Subscription';
  hfpLoadingProgress?: Maybe<HfpDateProgress>;
  hfpPreloadStatus?: Maybe<Array<HfpDateStatus>>;
  inspectionError?: Maybe<InspectionErrorUpdate>;
  inspectionStatus?: Maybe<InspectionStatusUpdate>;
};


export type SubscriptionHfpLoadingProgressArgs = {
  rangeEnd: Scalars['String'];
  rangeStart: Scalars['String'];
};


export type SubscriptionHfpPreloadStatusArgs = {
  rangeEnd: Scalars['String'];
  rangeStart: Scalars['String'];
};


export type SubscriptionInspectionErrorArgs = {
  inspectionId: Scalars['String'];
};


export type SubscriptionInspectionStatusArgs = {
  inspectionId: Scalars['String'];
};

export type TrackedDeparturesReport = {
  __typename?: 'TrackedDeparturesReport';
  columnLabels: Scalars['String'];
  description: Scalars['String'];
  filteredCount: Scalars['Int'];
  filters?: Maybe<Array<FilterConfig>>;
  id: Scalars['String'];
  inspectionId: Scalars['String'];
  name: Scalars['String'];
  operatorId: Scalars['Float'];
  responseId: Scalars['String'];
  rows: Array<TrackedDeparturesReportData>;
  seasonId: Scalars['String'];
  showSanctioned?: Maybe<Scalars['Boolean']>;
  showUnsanctioned?: Maybe<Scalars['Boolean']>;
  sort?: Maybe<Array<SortConfig>>;
  title: Scalars['String'];
  totalCount: Scalars['Int'];
};

export type TrackedDeparturesReportData = {
  __typename?: 'TrackedDeparturesReportData';
  dayType: Scalars['String'];
  direction: Scalars['String'];
  id: Scalars['ID'];
  journeyEndTime: Scalars['String'];
  journeyStartTime: Scalars['String'];
  routeId: Scalars['String'];
  trackReason: TrackReason;
};

export type UnitExecutionReport = {
  __typename?: 'UnitExecutionReport';
  columnLabels: Scalars['String'];
  description: Scalars['String'];
  filteredCount: Scalars['Int'];
  filters?: Maybe<Array<FilterConfig>>;
  id: Scalars['String'];
  inspectionId: Scalars['String'];
  name: Scalars['String'];
  operatorId: Scalars['Float'];
  responseId: Scalars['String'];
  rows: Array<UnitExecutionReportData>;
  seasonId: Scalars['String'];
  showSanctioned?: Maybe<Scalars['Boolean']>;
  showUnsanctioned?: Maybe<Scalars['Boolean']>;
  sort?: Maybe<Array<SortConfig>>;
  title: Scalars['String'];
  totalCount: Scalars['Int'];
};

export type UnitExecutionReportData = {
  __typename?: 'UnitExecutionReportData';
  averageAgeMax: Scalars['Float'];
  averageAgeRequired: Scalars['Float'];
  averageAgeWeighted: Scalars['Float'];
  averageAgeWeightedFulfilled: Scalars['Float'];
  id: Scalars['ID'];
  kilometersFulfilled: Scalars['Float'];
  kilometersRequired: Scalars['Float'];
  procurementUnitId: Scalars['String'];
};

export type UnobservedDeparturesReport = {
  __typename?: 'UnobservedDeparturesReport';
  columnLabels: Scalars['String'];
  description: Scalars['String'];
  filteredCount: Scalars['Int'];
  filters?: Maybe<Array<FilterConfig>>;
  id: Scalars['String'];
  inspectionId: Scalars['String'];
  name: Scalars['String'];
  operatorId: Scalars['Float'];
  responseId: Scalars['String'];
  rows: Array<UnobservedDeparturesReportData>;
  seasonId: Scalars['String'];
  showSanctioned?: Maybe<Scalars['Boolean']>;
  showUnsanctioned?: Maybe<Scalars['Boolean']>;
  sort?: Maybe<Array<SortConfig>>;
  title: Scalars['String'];
  totalCount: Scalars['Int'];
};

export type UnobservedDeparturesReportData = {
  __typename?: 'UnobservedDeparturesReportData';
  blockNumber?: Maybe<Scalars['String']>;
  date: Scalars['String'];
  dayType: Scalars['String'];
  direction: Scalars['String'];
  id: Scalars['ID'];
  journeyEndTime: Scalars['String'];
  journeyKilometers: Scalars['Float'];
  journeyStartTime: Scalars['String'];
  procurementUnitId: Scalars['String'];
  routeId: Scalars['String'];
  trackReason: TrackReason;
};

export type User = {
  __typename?: 'User';
  contractRelations: Array<ContractUserRelation>;
  email: Scalars['String'];
  hslIdGroups: Array<Scalars['String']>;
  id: Scalars['ID'];
  inspectionRelations: Array<InspectionUserRelation>;
  name: Scalars['String'];
  operatorIds?: Maybe<Array<Scalars['Int']>>;
  organisation?: Maybe<Scalars['String']>;
  role: UserRole;
};

export type ValidationErrorData = {
  __typename?: 'ValidationErrorData';
  keys?: Maybe<Array<Scalars['String']>>;
  objectId?: Maybe<Scalars['String']>;
  referenceKeys?: Maybe<Array<Scalars['String']>>;
  type: InspectionValidationError;
};

export enum ContractUserRelationType {
  CreatedBy = 'CREATED_BY',
  SubscribedTo = 'SUBSCRIBED_TO',
  UpdatedBy = 'UPDATED_BY'
}

export enum HfpStatus {
  Loading = 'LOADING',
  NotLoaded = 'NOT_LOADED',
  Ready = 'READY'
}

export enum InspectionStatus {
  Draft = 'Draft',
  InProduction = 'InProduction',
  InReview = 'InReview',
  Processing = 'Processing',
  Sanctionable = 'Sanctionable'
}

export enum InspectionType {
  Post = 'POST',
  Pre = 'PRE'
}

export enum InspectionUserRelationType {
  CreatedBy = 'CREATED_BY',
  MadeSanctionableBy = 'MADE_SANCTIONABLE_BY',
  PublishedBy = 'PUBLISHED_BY',
  RejectedBy = 'REJECTED_BY',
  SanctionsAbandonedBy = 'SANCTIONS_ABANDONED_BY',
  SubmittedBy = 'SUBMITTED_BY',
  SubscribedTo = 'SUBSCRIBED_TO',
  UpdatedBy = 'UPDATED_BY'
}

export enum InspectionValidationError {
  ContractOutsideInspectionTime = 'CONTRACT_OUTSIDE_INSPECTION_TIME',
  HfpUnavailableForInspectionDates = 'HFP_UNAVAILABLE_FOR_INSPECTION_DATES',
  InvalidInspectionTime = 'INVALID_INSPECTION_TIME',
  InvalidProductionTime = 'INVALID_PRODUCTION_TIME',
  MissingBlockDepartures = 'MISSING_BLOCK_DEPARTURES',
  MissingContracts = 'MISSING_CONTRACTS',
  MissingEquipmentCatalogues = 'MISSING_EQUIPMENT_CATALOGUES',
  MissingExecutionRequirements = 'MISSING_EXECUTION_REQUIREMENTS',
  MissingRequirementQuotas = 'MISSING_REQUIREMENT_QUOTAS',
  PostInspectionEndDateNotInThePast = 'POST_INSPECTION_END_DATE_NOT_IN_THE_PAST',
  PostInspectionMissingLinkedPreInspections = 'POST_INSPECTION_MISSING_LINKED_PRE_INSPECTIONS'
}

export enum OperatingAreaName {
  Center = 'CENTER',
  Other = 'OTHER',
  Unknown = 'UNKNOWN'
}

export enum SanctionExceptionReason {
  All = 'ALL',
  EquipmentAgeViolation = 'EQUIPMENT_AGE_VIOLATION',
  EquipmentApprovedAgeViolation = 'EQUIPMENT_APPROVED_AGE_VIOLATION',
  EquipmentOptionAgeViolation = 'EQUIPMENT_OPTION_AGE_VIOLATION',
  EquipmentTypeViolation = 'EQUIPMENT_TYPE_VIOLATION',
  ExteriorColorViolation = 'EXTERIOR_COLOR_VIOLATION',
  LateDeparture = 'LATE_DEPARTURE',
  TimingStopViolation = 'TIMING_STOP_VIOLATION'
}

export enum SanctionReason {
  EmissionClassDeficiency = 'EMISSION_CLASS_DEFICIENCY',
  EquipmentAgeViolation = 'EQUIPMENT_AGE_VIOLATION',
  EquipmentApprovedAgeViolation = 'EQUIPMENT_APPROVED_AGE_VIOLATION',
  EquipmentOptionAgeViolation = 'EQUIPMENT_OPTION_AGE_VIOLATION',
  EquipmentTypeViolation = 'EQUIPMENT_TYPE_VIOLATION',
  ExteriorColorViolation = 'EXTERIOR_COLOR_VIOLATION',
  LateDeparture = 'LATE_DEPARTURE',
  TimingStopViolation = 'TIMING_STOP_VIOLATION',
  UnitEquipmentMaxAgeViolation = 'UNIT_EQUIPMENT_MAX_AGE_VIOLATION'
}

export enum SanctionableEntity {
  Departure = 'DEPARTURE',
  EmissionClass = 'EMISSION_CLASS',
  Equipment = 'EQUIPMENT'
}

export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}

export enum TrackReason {
  DeadrunDetected = 'DEADRUN_DETECTED',
  DefaultTracked = 'DEFAULT_TRACKED',
  EquipmentAgeViolation = 'EQUIPMENT_AGE_VIOLATION',
  EquipmentTypeViolation = 'EQUIPMENT_TYPE_VIOLATION',
  ExteriorColorViolation = 'EXTERIOR_COLOR_VIOLATION',
  ExtraDeparture = 'EXTRA_DEPARTURE',
  FirstDepartureAfterDeadrun = 'FIRST_DEPARTURE_AFTER_DEADRUN',
  FirstDepartureInBlock = 'FIRST_DEPARTURE_IN_BLOCK',
  MissingDeparture = 'MISSING_DEPARTURE',
  NotTracked = 'NOT_TRACKED',
  RecoveryViolation = 'RECOVERY_VIOLATION',
  TimingStopViolation = 'TIMING_STOP_VIOLATION',
  UnobservedDeparture = 'UNOBSERVED_DEPARTURE'
}

export enum UserRole {
  Admin = 'ADMIN',
  Blocked = 'BLOCKED',
  Hsl = 'HSL',
  Operator = 'OPERATOR'
}

export type ContractInput = {
  description?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['BulttiDate']>;
  id?: Maybe<Scalars['ID']>;
  operatorId?: Maybe<Scalars['Int']>;
  procurementUnitIds?: Maybe<Array<Scalars['String']>>;
  rulesFile?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['BulttiDate']>;
};

export type EquipmentCatalogueInput = {
  endDate: Scalars['BulttiDate'];
  startDate: Scalars['BulttiDate'];
};

export type InitialInspectionInput = {
  endDate?: Maybe<Scalars['BulttiDate']>;
  inspectionDateId?: Maybe<Scalars['String']>;
  inspectionEndDate?: Maybe<Scalars['BulttiDate']>;
  inspectionStartDate?: Maybe<Scalars['BulttiDate']>;
  inspectionType: InspectionType;
  name?: Maybe<Scalars['String']>;
  operatorId: Scalars['Int'];
  seasonId: Scalars['String'];
  startDate?: Maybe<Scalars['BulttiDate']>;
};

export type InputFilterConfig = {
  field: Scalars['String'];
  filterValue: Scalars['String'];
};

export type InputSortConfig = {
  column: Scalars['String'];
  order: SortOrder;
};

export type InspectionDateInput = {
  endDate: Scalars['BulttiDate'];
  startDate: Scalars['BulttiDate'];
};

export type InspectionInput = {
  endDate?: Maybe<Scalars['BulttiDate']>;
  inspectionDateId?: Maybe<Scalars['String']>;
  inspectionEndDate?: Maybe<Scalars['BulttiDate']>;
  inspectionStartDate?: Maybe<Scalars['BulttiDate']>;
  inspectionType?: Maybe<InspectionType>;
  name?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['BulttiDate']>;
};

export type ObservedRequirementValueInput = {
  emissionClass: Scalars['Int'];
  id: Scalars['ID'];
  kilometersRequired?: Maybe<Scalars['Float']>;
  quotaRequired?: Maybe<Scalars['Float']>;
  sanctionAmount?: Maybe<Scalars['Float']>;
};

export type ProcurementUnitEditInput = {
  medianAgeRequirement: Scalars['Float'];
};

export type SanctionUpdate = {
  appliedSanctionAmount: Scalars['Float'];
  sanctionId: Scalars['String'];
};

export type UserInput = {
  email?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  operatorIds?: Maybe<Scalars['String']>;
  organisation?: Maybe<Scalars['String']>;
  role?: Maybe<UserRole>;
};



