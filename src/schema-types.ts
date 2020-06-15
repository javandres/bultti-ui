export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A Date string in YYYY-MM-DD format. The timezone is assumed to be Europe/Helsinki. */
  BulttiDate: any;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type Query = {
  __typename?: 'Query';
  operator?: Maybe<Operator>;
  operators: Array<Operator>;
  season?: Maybe<Array<Season>>;
  seasons: Array<Season>;
  procurementUnit?: Maybe<ProcurementUnit>;
  procurementUnitsByOperator: Array<ProcurementUnit>;
  singleEquipment?: Maybe<Equipment>;
  equipment: Array<Equipment>;
  equipmentByOperator: Array<Equipment>;
  queryEquipmentFromSource?: Maybe<EquipmentSearchResult>;
  singleEquipmentCatalogue?: Maybe<EquipmentCatalogue>;
  equipmentCatalogue: Array<EquipmentCatalogue>;
  equipmentCatalogueByOperator: Array<EquipmentCatalogue>;
  executionRequirementsByOperator: Array<ExecutionRequirement>;
  executionRequirementForProcurementUnit?: Maybe<ExecutionRequirement>;
  executionRequirementsForPreInspectionAreas: Array<ExecutionRequirement>;
  user?: Maybe<User>;
  users: Array<User>;
  currentUser?: Maybe<User>;
  blockDeparturesForPreInspection: Array<OperatorBlockDeparture>;
  availableDayTypes: Array<Scalars['String']>;
  reports: Array<Report>;
  reportCreatorOptions: Array<ReportCreatorOption>;
  inspectionReportByName?: Maybe<Report>;
  inspection?: Maybe<Inspection>;
  inspectionsByOperator: Array<Inspection>;
  currentInspectionsByOperatorAndSeason: Array<Inspection>;
  currentInspectionByOperatorAndSeason?: Maybe<Inspection>;
  allInspections: Array<Inspection>;
  inspectionUserRelations: Array<InspectionUserRelation>;
  contracts: Array<Contract>;
  contractsByProcurementUnit: Array<Contract>;
  contract?: Maybe<Contract>;
  contractProcurementUnitOptions: Array<ProcurementUnitOption>;
  defaultContractRules: Array<ContractRule>;
};


export type QueryOperatorArgs = {
  operatorId: Scalars['Int'];
};


export type QuerySeasonArgs = {
  seasonId: Scalars['String'];
};


export type QuerySeasonsArgs = {
  date: Scalars['BulttiDate'];
};


export type QueryProcurementUnitArgs = {
  procurementUnitId: Scalars['String'];
};


export type QueryProcurementUnitsByOperatorArgs = {
  date: Scalars['BulttiDate'];
  operatorId: Scalars['Int'];
};


export type QuerySingleEquipmentArgs = {
  equipmentId: Scalars['String'];
};


export type QueryEquipmentByOperatorArgs = {
  operatorId: Scalars['Int'];
};


export type QueryQueryEquipmentFromSourceArgs = {
  registryNr?: Maybe<Scalars['String']>;
  vehicleId?: Maybe<Scalars['String']>;
  operatorId: Scalars['Int'];
};


export type QuerySingleEquipmentCatalogueArgs = {
  equipmentCatalogueId: Scalars['String'];
};


export type QueryEquipmentCatalogueByOperatorArgs = {
  operatorId: Scalars['Int'];
};


export type QueryExecutionRequirementsByOperatorArgs = {
  operatorId: Scalars['Int'];
};


export type QueryExecutionRequirementForProcurementUnitArgs = {
  inspectionId: Scalars['String'];
  procurementUnitId: Scalars['String'];
};


export type QueryExecutionRequirementsForPreInspectionAreasArgs = {
  inspectionId: Scalars['String'];
};


export type QueryUserArgs = {
  userId: Scalars['Int'];
};


export type QueryBlockDeparturesForPreInspectionArgs = {
  inspectionId: Scalars['String'];
};


export type QueryAvailableDayTypesArgs = {
  inspectionId: Scalars['String'];
};


export type QueryReportsArgs = {
  inspectionType?: Maybe<InspectionType>;
};


export type QueryInspectionReportByNameArgs = {
  inspectionType: InspectionType;
  inspectionId: Scalars['String'];
  reportName: Scalars['String'];
};


export type QueryInspectionArgs = {
  inspectionId: Scalars['String'];
};


export type QueryInspectionsByOperatorArgs = {
  inspectionType: InspectionType;
  operatorId: Scalars['Int'];
};


export type QueryCurrentInspectionsByOperatorAndSeasonArgs = {
  inspectionType: InspectionType;
  seasonId: Scalars['String'];
  operatorId: Scalars['Int'];
};


export type QueryCurrentInspectionByOperatorAndSeasonArgs = {
  inspectionType: InspectionType;
  seasonId: Scalars['String'];
  operatorId: Scalars['Int'];
};


export type QueryAllInspectionsArgs = {
  inspectionType: InspectionType;
};


export type QueryInspectionUserRelationsArgs = {
  inspectionId: Scalars['String'];
};


export type QueryContractsArgs = {
  date?: Maybe<Scalars['BulttiDate']>;
  operatorId?: Maybe<Scalars['Int']>;
};


export type QueryContractsByProcurementUnitArgs = {
  procurementUnitId: Scalars['String'];
};


export type QueryContractArgs = {
  contractId: Scalars['String'];
};


export type QueryContractProcurementUnitOptionsArgs = {
  date: Scalars['BulttiDate'];
  operatorId: Scalars['Int'];
};

export type Operator = {
  __typename?: 'Operator';
  id: Scalars['Int'];
  operatorId: Scalars['Int'];
  operatorName: Scalars['String'];
  inspections: Array<Inspection>;
  contracts: Array<Contract>;
  procurementUnits: Array<ProcurementUnit>;
  executionRequirements: Array<ExecutionRequirement>;
  equipment: Array<Equipment>;
  equipmentCatalogues: Array<EquipmentCatalogue>;
};

export type Inspection = {
  __typename?: 'Inspection';
  id: Scalars['ID'];
  inspectionType?: Maybe<InspectionType>;
  operatorId?: Maybe<Scalars['Int']>;
  operator: Operator;
  seasonId?: Maybe<Scalars['String']>;
  season: Season;
  executionRequirements: Array<ExecutionRequirement>;
  status: InspectionStatus;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  userRelations: Array<InspectionUserRelation>;
  version: Scalars['Int'];
  inspectionStartDate?: Maybe<Scalars['BulttiDate']>;
  inspectionEndDate?: Maybe<Scalars['BulttiDate']>;
  startDate: Scalars['BulttiDate'];
  endDate: Scalars['BulttiDate'];
  minStartDate?: Maybe<Scalars['BulttiDate']>;
  versionStackIdentifier?: Maybe<Scalars['String']>;
};

export enum InspectionType {
  Pre = 'PRE',
  Post = 'POST'
}

export type Season = {
  __typename?: 'Season';
  id: Scalars['ID'];
  season: Scalars['String'];
  startDate: Scalars['BulttiDate'];
  endDate: Scalars['BulttiDate'];
  inspections: Array<Inspection>;
};


export type ExecutionRequirement = {
  __typename?: 'ExecutionRequirement';
  id: Scalars['ID'];
  area: OperatingArea;
  operator: Operator;
  inspection: Inspection;
  equipmentQuotas: Array<ExecutionRequirementQuota>;
  procurementUnit?: Maybe<ProcurementUnit>;
  procurementUnitId?: Maybe<Scalars['String']>;
  areaRequirement?: Maybe<ExecutionRequirement>;
  procurementUnitRequirements?: Maybe<Array<ExecutionRequirement>>;
  totalKilometers?: Maybe<Scalars['Float']>;
  totalKilometersFulfilled?: Maybe<Scalars['Float']>;
  averageAgeWeighted?: Maybe<Scalars['Float']>;
  averageAgeWeightedFulfilled?: Maybe<Scalars['Float']>;
  requirements: Array<ExecutionRequirementValue>;
};

export type OperatingArea = {
  __typename?: 'OperatingArea';
  id: Scalars['Int'];
  name: OperatingAreaName;
  procurementUnits?: Maybe<Array<ProcurementUnit>>;
  executionRequirements?: Maybe<Array<ExecutionRequirement>>;
};

export enum OperatingAreaName {
  Center = 'CENTER',
  Other = 'OTHER',
  Unknown = 'UNKNOWN'
}

export type ProcurementUnit = {
  __typename?: 'ProcurementUnit';
  id: Scalars['ID'];
  procurementUnitId: Scalars['String'];
  operatorId: Scalars['Int'];
  operator: Operator;
  equipmentCatalogues: Array<EquipmentCatalogue>;
  weeklyMeters: Scalars['Float'];
  weeklyKilometers: Scalars['Float'];
  medianAgeRequirement: Scalars['Float'];
  areaId?: Maybe<Scalars['Int']>;
  area?: Maybe<OperatingArea>;
  routes: Array<ProcurementUnitRoute>;
  startDate: Scalars['BulttiDate'];
  endDate: Scalars['BulttiDate'];
  executionRequirements: Array<ExecutionRequirement>;
  contracts: Array<Contract>;
};

export type EquipmentCatalogue = {
  __typename?: 'EquipmentCatalogue';
  id: Scalars['ID'];
  equipmentCatalogueId: Scalars['String'];
  operatorId: Scalars['Int'];
  operator: Operator;
  procurementUnitId: Scalars['String'];
  procurementUnit: ProcurementUnit;
  startDate: Scalars['String'];
  endDate: Scalars['String'];
  equipmentQuotas: Array<EquipmentCatalogueQuota>;
};

export type EquipmentCatalogueQuota = {
  __typename?: 'EquipmentCatalogueQuota';
  id: Scalars['ID'];
  percentageQuota: Scalars['Float'];
  equipmentId: Scalars['String'];
  equipmentCatalogueId: Scalars['String'];
  equipment?: Maybe<Equipment>;
  equipmentCatalogue?: Maybe<EquipmentCatalogue>;
  catalogueStartDate: Scalars['BulttiDate'];
  catalogueEndDate: Scalars['BulttiDate'];
};

export type Equipment = {
  __typename?: 'Equipment';
  id: Scalars['ID'];
  vehicleId: Scalars['String'];
  operatorId: Scalars['Int'];
  uniqueVehicleId: Scalars['String'];
  operator: Operator;
  model?: Maybe<Scalars['String']>;
  registryNr?: Maybe<Scalars['String']>;
  registryDate?: Maybe<Scalars['BulttiDate']>;
  type: Scalars['String'];
  exteriorColor: Scalars['String'];
  hasInfoSystems: Scalars['Boolean'];
  option: Scalars['Boolean'];
  approvedOverage: Scalars['Boolean'];
  emissionClass: Scalars['Int'];
  equipmentCatalogueQuotas: Array<EquipmentCatalogueQuota>;
  executionRequirementQuotas: Array<ExecutionRequirementQuota>;
  departures: Array<Departure>;
};

export type ExecutionRequirementQuota = {
  __typename?: 'ExecutionRequirementQuota';
  id: Scalars['ID'];
  percentageQuota: Scalars['Float'];
  meterRequirement: Scalars['Float'];
  equipmentId: Scalars['String'];
  executionRequirementId: Scalars['String'];
  equipment: Equipment;
  executionRequirement: ExecutionRequirement;
};

export type Departure = {
  __typename?: 'Departure';
  id: Scalars['ID'];
  journeyStartTime: Scalars['String'];
  journeyEndTime: Scalars['String'];
  terminalTime?: Maybe<Scalars['Int']>;
  recoveryTime?: Maybe<Scalars['Int']>;
  routeId?: Maybe<Scalars['String']>;
  direction?: Maybe<Scalars['String']>;
  routeLength?: Maybe<Scalars['Int']>;
  dayType: DayType;
  startStop?: Maybe<Scalars['String']>;
  endStop?: Maybe<Scalars['String']>;
  plannedEquipmentType?: Maybe<Scalars['String']>;
  equipmentTypeRequired?: Maybe<Scalars['Boolean']>;
  registryNr?: Maybe<Scalars['String']>;
  equipmentRotation?: Maybe<Scalars['Int']>;
  isTrunkRoute?: Maybe<Scalars['Boolean']>;
  infoSystems?: Maybe<Scalars['Boolean']>;
  allowedOverAge?: Maybe<Scalars['Float']>;
  blockNumber?: Maybe<Scalars['String']>;
  schemaId?: Maybe<Scalars['String']>;
  procurementUnitId?: Maybe<Scalars['String']>;
  procurementUnit?: Maybe<ProcurementUnit>;
  equipment?: Maybe<Equipment>;
  equipmentId?: Maybe<Scalars['String']>;
  inspection?: Maybe<Inspection>;
  inspectionId?: Maybe<Scalars['String']>;
  isTracked?: Maybe<Scalars['Boolean']>;
  trackReason: TrackReason;
  observedEquipmentType?: Maybe<Scalars['String']>;
  equipmentExteriorColor?: Maybe<Scalars['String']>;
  registryDate?: Maybe<Scalars['BulttiDate']>;
  equipmentAge?: Maybe<Scalars['Float']>;
};

export enum DayType {
  Ma = 'Ma',
  Ti = 'Ti',
  Ke = 'Ke',
  To = 'To',
  Pe = 'Pe',
  La = 'La',
  Su = 'Su'
}

export enum TrackReason {
  NotTracked = 'NOT_TRACKED',
  FirstDepartureInBlock = 'FIRST_DEPARTURE_IN_BLOCK',
  FirstDepartureAfterDeadrun = 'FIRST_DEPARTURE_AFTER_DEADRUN',
  ExtraDeparture = 'EXTRA_DEPARTURE',
  MissingDeparture = 'MISSING_DEPARTURE',
  RecoveryViolation = 'RECOVERY_VIOLATION',
  DeadrunDetected = 'DEADRUN_DETECTED',
  EquipmentTypeViolation = 'EQUIPMENT_TYPE_VIOLATION',
  EquipmentAgeViolation = 'EQUIPMENT_AGE_VIOLATION',
  InfoSystemsViolation = 'INFO_SYSTEMS_VIOLATION',
  ExteriorColorViolation = 'EXTERIOR_COLOR_VIOLATION'
}

export type ProcurementUnitRoute = {
  __typename?: 'ProcurementUnitRoute';
  routeId: Scalars['String'];
  length: Scalars['Float'];
};

export type Contract = {
  __typename?: 'Contract';
  id: Scalars['ID'];
  description?: Maybe<Scalars['String']>;
  operatorId?: Maybe<Scalars['Int']>;
  operator: Operator;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  userRelations: Array<ContractUserRelation>;
  startDate: Scalars['BulttiDate'];
  endDate: Scalars['BulttiDate'];
  procurementUnits: Array<ProcurementUnit>;
  rules?: Maybe<Array<ContractRule>>;
};


export type ContractUserRelation = {
  __typename?: 'ContractUserRelation';
  id: Scalars['ID'];
  relatedBy: ContractUserRelationType;
  subscribed: Scalars['Boolean'];
  contract: Contract;
  user: User;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export enum ContractUserRelationType {
  CreatedBy = 'CREATED_BY',
  UpdatedBy = 'UPDATED_BY',
  SubscribedTo = 'SUBSCRIBED_TO'
}

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  name: Scalars['String'];
  email: Scalars['String'];
  role: UserRole;
  organisation?: Maybe<Scalars['String']>;
  operatorIds?: Maybe<Array<Scalars['Int']>>;
  hslIdGroups?: Maybe<Array<Scalars['String']>>;
  inspectionRelations: Array<InspectionUserRelation>;
  contractRelations: Array<ContractUserRelation>;
};

export enum UserRole {
  Admin = 'ADMIN',
  Hsl = 'HSL',
  Operator = 'OPERATOR',
  Blocked = 'BLOCKED'
}

export type InspectionUserRelation = {
  __typename?: 'InspectionUserRelation';
  id: Scalars['ID'];
  relatedBy: InspectionUserRelationType;
  subscribed: Scalars['Boolean'];
  inspection: Inspection;
  user: User;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export enum InspectionUserRelationType {
  CreatedBy = 'CREATED_BY',
  UpdatedBy = 'UPDATED_BY',
  SubscribedTo = 'SUBSCRIBED_TO',
  PublishedBy = 'PUBLISHED_BY',
  RejectedBy = 'REJECTED_BY',
  SubmittedBy = 'SUBMITTED_BY'
}

export type ContractRule = {
  __typename?: 'ContractRule';
  name: Scalars['String'];
  category: Scalars['String'];
  type: RuleType;
  value?: Maybe<Scalars['String']>;
  options?: Maybe<Scalars['String']>;
  condition?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
};

export enum RuleType {
  ScalarValue = 'SCALAR_VALUE',
  ConditionalValue = 'CONDITIONAL_VALUE',
  EnumValue = 'ENUM_VALUE',
  MultiValue = 'MULTI_VALUE'
}

export type ExecutionRequirementValue = {
  __typename?: 'ExecutionRequirementValue';
  emissionClass: Scalars['Int'];
  kilometerRequirement?: Maybe<Scalars['Float']>;
  quotaRequirement?: Maybe<Scalars['Float']>;
  kilometersFulfilled?: Maybe<Scalars['Float']>;
  quotaFulfilled?: Maybe<Scalars['Float']>;
  differencePercentage?: Maybe<Scalars['Float']>;
  cumulativeDifferencePercentage?: Maybe<Scalars['Float']>;
  equipmentCount?: Maybe<Scalars['Int']>;
  equipmentCountFulfilled?: Maybe<Scalars['Int']>;
  sanctionThreshold?: Maybe<Scalars['Float']>;
  sanctionAmount?: Maybe<Scalars['Float']>;
  classSanctionAmount?: Maybe<Scalars['Float']>;
};

export enum InspectionStatus {
  Draft = 'Draft',
  InReview = 'InReview',
  InProduction = 'InProduction'
}

export type EquipmentSearchResult = {
  __typename?: 'EquipmentSearchResult';
  vehicleId: Scalars['String'];
  model: Scalars['String'];
  registryNr?: Maybe<Scalars['String']>;
  registryDate?: Maybe<Scalars['BulttiDate']>;
  type: Scalars['String'];
  exteriorColor: Scalars['String'];
  emissionClass: Scalars['Int'];
  _exists: Scalars['Boolean'];
};

export type OperatorBlockDeparture = {
  __typename?: 'OperatorBlockDeparture';
  id: Scalars['ID'];
  blockNumber?: Maybe<Scalars['String']>;
  dayType: DayType;
  journeyType: Scalars['String'];
  routeId?: Maybe<Scalars['String']>;
  direction?: Maybe<Scalars['String']>;
  journeyStartTime: Scalars['String'];
  journeyEndTime: Scalars['String'];
  registryNr?: Maybe<Scalars['String']>;
  vehicleId?: Maybe<Scalars['String']>;
  routeLength?: Maybe<Scalars['Int']>;
  operatorId?: Maybe<Scalars['String']>;
  equipment?: Maybe<Equipment>;
  equipmentId?: Maybe<Scalars['String']>;
  procurementUnitId?: Maybe<Scalars['String']>;
  inspectionId?: Maybe<Scalars['String']>;
};

export type Report = {
  __typename?: 'Report';
  id: Scalars['ID'];
  name: Scalars['String'];
  title: Scalars['String'];
  description: Scalars['String'];
  order: Scalars['Int'];
  params?: Maybe<Scalars['String']>;
  columnLabels?: Maybe<Scalars['String']>;
  season?: Maybe<Season>;
  operator?: Maybe<Operator>;
  inspection?: Maybe<Inspection>;
  reportEntities: Array<ReportEntityUnion>;
  inspectionTypes?: Maybe<Array<InspectionType>>;
  reportType?: Maybe<ReportType>;
  _defaultParams?: Maybe<Scalars['String']>;
};

export type ReportEntityUnion = Departure | MissingEquipment | DeparturePair | OperatorBlockDeparture | ExecutionRequirement | EmissionClassExecutionItem;

export type MissingEquipment = {
  __typename?: 'MissingEquipment';
  registryNr?: Maybe<Scalars['String']>;
  blockNumber?: Maybe<Scalars['String']>;
};

export type DeparturePair = {
  __typename?: 'DeparturePair';
  id: Scalars['ID'];
  blockNumber?: Maybe<Scalars['String']>;
  groupId?: Maybe<Scalars['String']>;
  departureA: Departure;
  departureB: Departure;
  deadrunStartStop?: Maybe<Scalars['String']>;
  deadrunEndStop?: Maybe<Scalars['String']>;
  deadrunMinutes?: Maybe<Scalars['Int']>;
  deadrunPlannedBy?: Maybe<Scalars['String']>;
  overlapSecondsA?: Maybe<Scalars['Int']>;
  overlapSecondsB?: Maybe<Scalars['Int']>;
  overlapPlannedBy?: Maybe<Scalars['String']>;
};

export type EmissionClassExecutionItem = {
  __typename?: 'EmissionClassExecutionItem';
  id: Scalars['ID'];
  procurementUnitId?: Maybe<Scalars['String']>;
  class1?: Maybe<Scalars['Float']>;
  class2?: Maybe<Scalars['Float']>;
  class3?: Maybe<Scalars['Float']>;
  class4?: Maybe<Scalars['Float']>;
  class5?: Maybe<Scalars['Float']>;
  class6?: Maybe<Scalars['Float']>;
  class7?: Maybe<Scalars['Float']>;
  class8?: Maybe<Scalars['Float']>;
  class9?: Maybe<Scalars['Float']>;
  class10?: Maybe<Scalars['Float']>;
};

export enum ReportType {
  List = 'LIST',
  PairList = 'PAIR_LIST',
  Summary = 'SUMMARY',
  ExecutionRequirement = 'EXECUTION_REQUIREMENT'
}

export type ReportCreatorOption = {
  __typename?: 'ReportCreatorOption';
  name: Scalars['String'];
  inspectionTypes: Array<InspectionType>;
  reportType: ReportType;
  columnLabels: Scalars['String'];
  params: Scalars['String'];
};

export type ProcurementUnitOption = {
  __typename?: 'ProcurementUnitOption';
  id: Scalars['String'];
  name: Scalars['String'];
  startDate: Scalars['BulttiDate'];
  endDate: Scalars['BulttiDate'];
  routes: Array<Scalars['String']>;
  medianAgeRequirement?: Maybe<Scalars['Float']>;
  areaName?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  updateWeeklyMetersFromSource: ProcurementUnit;
  updateProcurementUnit: ProcurementUnit;
  createEquipment?: Maybe<Equipment>;
  updateEquipment?: Maybe<Equipment>;
  updateEquipmentCatalogueQuota?: Maybe<Equipment>;
  updateEquipmentRequirementQuota?: Maybe<Equipment>;
  createEquipmentCatalogue?: Maybe<EquipmentCatalogue>;
  updateEquipmentCatalogue: EquipmentCatalogue;
  removeAllEquipmentFromCatalogue: EquipmentCatalogue;
  createExecutionRequirementsForProcurementUnit?: Maybe<ExecutionRequirement>;
  refreshExecutionRequirementForProcurementUnit?: Maybe<ExecutionRequirement>;
  removeAllEquipmentFromExecutionRequirement?: Maybe<ExecutionRequirement>;
  removeExecutionRequirement: Scalars['Boolean'];
  login?: Maybe<Scalars['String']>;
  logout: Scalars['Boolean'];
  modifyUser: User;
  removeEquipmentFromCatalogue: Scalars['Boolean'];
  createBlockDeparturesFromFile?: Maybe<Array<OperatorBlockDeparture>>;
  removeDepartureBlocksForDayTypes: Scalars['Boolean'];
  removeEquipmentFromExecutionRequirement: Scalars['Boolean'];
  createReport: Report;
  modifyReport: Report;
  setReportsOrder: Array<Report>;
  createInspection: Inspection;
  updateInspection: Inspection;
  submitInspection: Inspection;
  publishInspection: Inspection;
  rejectInspection: Inspection;
  removeInspection: Scalars['Boolean'];
  toggleUserSubscribed?: Maybe<InspectionUserRelation>;
  generateEquipmentForPreInspection: Scalars['Boolean'];
  createContract: Contract;
  modifyContract: Contract;
};


export type MutationUpdateWeeklyMetersFromSourceArgs = {
  startDate: Scalars['String'];
  procurementUnitId: Scalars['String'];
};


export type MutationUpdateProcurementUnitArgs = {
  procurementUnit: ProcurementUnitEditInput;
  procurementUnitId: Scalars['String'];
};


export type MutationCreateEquipmentArgs = {
  executionRequirementId?: Maybe<Scalars['String']>;
  catalogueId?: Maybe<Scalars['String']>;
  operatorId: Scalars['Int'];
  equipment: EquipmentInput;
};


export type MutationUpdateEquipmentArgs = {
  equipment: EquipmentInput;
  equipmentId: Scalars['String'];
};


export type MutationUpdateEquipmentCatalogueQuotaArgs = {
  quotaId?: Maybe<Scalars['String']>;
  equipment: EquipmentInput;
  equipmentId: Scalars['String'];
};


export type MutationUpdateEquipmentRequirementQuotaArgs = {
  quotaId?: Maybe<Scalars['String']>;
  equipment: EquipmentInput;
  equipmentId: Scalars['String'];
};


export type MutationCreateEquipmentCatalogueArgs = {
  procurementUnitId: Scalars['String'];
  operatorId: Scalars['Int'];
  equipmentCatalogue: EquipmentCatalogueInput;
};


export type MutationUpdateEquipmentCatalogueArgs = {
  equipmentCatalogue: EquipmentCatalogueInput;
  catalogueId: Scalars['String'];
};


export type MutationRemoveAllEquipmentFromCatalogueArgs = {
  catalogueId: Scalars['String'];
};


export type MutationCreateExecutionRequirementsForProcurementUnitArgs = {
  inspectionId: Scalars['String'];
  procurementUnitId: Scalars['String'];
};


export type MutationRefreshExecutionRequirementForProcurementUnitArgs = {
  executionRequirementId: Scalars['String'];
};


export type MutationRemoveAllEquipmentFromExecutionRequirementArgs = {
  executionRequirementId: Scalars['String'];
};


export type MutationRemoveExecutionRequirementArgs = {
  executionRequirementId: Scalars['String'];
};


export type MutationLoginArgs = {
  isTest?: Maybe<Scalars['Boolean']>;
  redirectUri?: Maybe<Scalars['String']>;
  authorizationCode: Scalars['String'];
};


export type MutationModifyUserArgs = {
  userInput: UserInput;
};


export type MutationRemoveEquipmentFromCatalogueArgs = {
  catalogueId: Scalars['String'];
  equipmentId: Scalars['String'];
};


export type MutationCreateBlockDeparturesFromFileArgs = {
  inspectionId: Scalars['String'];
  dayTypes: Array<DayType>;
  file?: Maybe<Scalars['Upload']>;
};


export type MutationRemoveDepartureBlocksForDayTypesArgs = {
  inspectionId: Scalars['String'];
  dayTypes: Array<DayType>;
};


export type MutationRemoveEquipmentFromExecutionRequirementArgs = {
  executionRequirementId: Scalars['String'];
  equipmentId: Scalars['String'];
};


export type MutationCreateReportArgs = {
  reportInput: ReportInput;
};


export type MutationModifyReportArgs = {
  reportInput: ReportInput;
};


export type MutationSetReportsOrderArgs = {
  reportOrders: Array<ReportOrderInput>;
};


export type MutationCreateInspectionArgs = {
  inspection: InitialInspectionInput;
};


export type MutationUpdateInspectionArgs = {
  inspection: InspectionInput;
  inspectionId: Scalars['String'];
};


export type MutationSubmitInspectionArgs = {
  inspectionId: Scalars['String'];
};


export type MutationPublishInspectionArgs = {
  inspectionId: Scalars['String'];
};


export type MutationRejectInspectionArgs = {
  inspectionId: Scalars['String'];
};


export type MutationRemoveInspectionArgs = {
  inspectionId: Scalars['String'];
};


export type MutationToggleUserSubscribedArgs = {
  userId: Scalars['String'];
  inspectionId: Scalars['String'];
};


export type MutationGenerateEquipmentForPreInspectionArgs = {
  inspectionId: Scalars['String'];
};


export type MutationCreateContractArgs = {
  contractInput: ContractInput;
};


export type MutationModifyContractArgs = {
  contractInput: ContractInput;
};

export type ProcurementUnitEditInput = {
  weeklyMeters: Scalars['Float'];
  medianAgeRequirement: Scalars['Float'];
};

export type EquipmentInput = {
  percentageQuota?: Maybe<Scalars['Float']>;
  meterRequirement?: Maybe<Scalars['Float']>;
  vehicleId?: Maybe<Scalars['String']>;
  model?: Maybe<Scalars['String']>;
  registryNr?: Maybe<Scalars['String']>;
  registryDate?: Maybe<Scalars['BulttiDate']>;
  type?: Maybe<Scalars['String']>;
  exteriorColor?: Maybe<Scalars['String']>;
  emissionClass?: Maybe<Scalars['Int']>;
};

export type EquipmentCatalogueInput = {
  startDate: Scalars['BulttiDate'];
  endDate: Scalars['BulttiDate'];
};

export type UserInput = {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  role?: Maybe<UserRole>;
  organisation?: Maybe<Scalars['String']>;
  hslIdGroups?: Maybe<Scalars['String']>;
  operatorIds?: Maybe<Scalars['String']>;
};


export type ReportInput = {
  id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  title: Scalars['String'];
  description: Scalars['String'];
  params: Scalars['String'];
  order?: Maybe<Scalars['Int']>;
};

export type ReportOrderInput = {
  id: Scalars['ID'];
  order: Scalars['Int'];
};

export type InitialInspectionInput = {
  startDate?: Maybe<Scalars['BulttiDate']>;
  endDate?: Maybe<Scalars['BulttiDate']>;
  inspectionStartDate?: Maybe<Scalars['BulttiDate']>;
  inspectionEndDate?: Maybe<Scalars['BulttiDate']>;
  operatorId: Scalars['Int'];
  seasonId: Scalars['String'];
  inspectionType: InspectionType;
};

export type InspectionInput = {
  startDate?: Maybe<Scalars['BulttiDate']>;
  endDate?: Maybe<Scalars['BulttiDate']>;
  inspectionStartDate?: Maybe<Scalars['BulttiDate']>;
  inspectionEndDate?: Maybe<Scalars['BulttiDate']>;
};

export type ContractInput = {
  id?: Maybe<Scalars['ID']>;
  description?: Maybe<Scalars['String']>;
  operatorId?: Maybe<Scalars['Int']>;
  startDate?: Maybe<Scalars['BulttiDate']>;
  endDate?: Maybe<Scalars['BulttiDate']>;
  procurementUnitIds?: Maybe<Array<Scalars['String']>>;
  rules?: Maybe<Array<ContractRuleInput>>;
};

export type ContractRuleInput = {
  name: Scalars['String'];
  category: Scalars['String'];
  type: RuleType;
  value?: Maybe<Scalars['String']>;
  options?: Maybe<Scalars['String']>;
  condition?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
};
