export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: string
  /** A Date string in YYYY-MM-DD format. The timezone is assumed to be Europe/Helsinki. */
  BulttiDate: string
  /** The `Upload` scalar type represents a file upload. */
  Upload: string
}

export type Query = {
  __typename?: 'Query'
  executionRequirementsByOperator: Array<PlannedUnitExecutionRequirement>
  executionRequirementForProcurementUnit?: Maybe<PlannedUnitExecutionRequirement>
  executionSchemaStats?: Maybe<ExecutionSchemaStats>
  operator?: Maybe<Operator>
  operators: Array<Operator>
  season?: Maybe<Array<Season>>
  seasons: Array<Season>
  procurementUnit?: Maybe<ProcurementUnit>
  procurementUnitsByOperator: Array<ProcurementUnit>
  singleEquipment?: Maybe<Equipment>
  equipment: Array<Equipment>
  equipmentByOperator: Array<Equipment>
  queryEquipmentFromSource?: Maybe<Equipment>
  equipmentCatalogue?: Maybe<EquipmentCatalogue>
  equipmentCatalogueByOperator: Array<EquipmentCatalogue>
  user?: Maybe<User>
  users: Array<User>
  currentUser?: Maybe<User>
  availableDayTypes: Array<Scalars['String']>
  reports: Array<ReportListItem>
  blockDeviationsReport?: Maybe<BlockDeviationsReport>
  deadrunsReport?: Maybe<DeadrunsReport>
  departureBlocksReport?: Maybe<DepartureBlocksReport>
  allDeviationsReport?: Maybe<DeviationsReport>
  emissionClassExecutionReport?: Maybe<EmissionClassExecutionReport>
  equipmentColorReport?: Maybe<EquipmentColorReport>
  equipmentTypeReport?: Maybe<EquipmentTypeReport>
  executionRequirementsReport?: Maybe<ExecutionRequirementsReport>
  extraBlockDeparturesReport?: Maybe<ExtraBlockDeparturesReport>
  missingBlockDeparturesReport?: Maybe<MissingBlockDeparturesReport>
  missingEquipmentReport?: Maybe<MissingEquipmentReport>
  operatorDeadrunsReport?: Maybe<OperatorDeadrunsReport>
  overageDeparturesReport?: Maybe<OverAgeDeparturesReport>
  trackedDeparturesReport?: Maybe<TrackedDeparturesReport>
  unitExecutionReport?: Maybe<UnitExecutionReport>
  earlyTimingStopDeparturesReport?: Maybe<EarlyTimingStopDeparturesReport>
  observedLateDeparturesReport?: Maybe<LateDeparturesReport>
  observedEmissionClassExecutionReport?: Maybe<ObservedEmissionClassExecutionReport>
  observedEquipmentColorReport?: Maybe<ObservedEquipmentColorReport>
  observedEquipmentTypeReport?: Maybe<ObservedEquipmentTypeReport>
  observedExecutionRequirementsReport?: Maybe<ObservedExecutionRequirementsReport>
  observedOverageDeparturesReport?: Maybe<ObservedOverAgeDeparturesReport>
  observedUnitExecutionReport?: Maybe<ObservedUnitExecutionReport>
  unobservedDeparturesReport?: Maybe<UnobservedDeparturesReport>
  sanctionSummaryReport?: Maybe<SanctionSummaryReport>
  contracts: Array<Contract>
  contractsByProcurementUnit: Array<Contract>
  contract?: Maybe<Contract>
  contractProcurementUnitOptions: Array<ProcurementUnitOption>
  contractUserRelations: Array<ContractUserRelation>
  observedExecutionRequirements: Array<ObservedExecutionRequirement>
  previewObservedRequirement?: Maybe<ObservedExecutionRequirement>
  currentlyLoadingHfpRanges: Array<HfpDateStatus>
  allInspectionDates: Array<InspectionDate>
  getObservedInspectionDates: Array<InspectionDate>
  inspectionSanctions: SanctionsResponse
  runSanctioning: Array<Sanction>
  executionRequirementsForPreInspectionAreas: Array<PlannedAreaExecutionRequirement>
  inspection: Inspection
  inspectionsByOperator: Array<Inspection>
  currentInspectionsByOperatorAndSeason: Array<Inspection>
  allInspections: Array<Inspection>
  inspectionsTimeline: Array<InspectionTimelineItem>
  inspectionUserRelations: Array<InspectionUserRelation>
}

export type QueryExecutionRequirementsByOperatorArgs = {
  operatorId: Scalars['Int']
}

export type QueryExecutionRequirementForProcurementUnitArgs = {
  inspectionId: Scalars['String']
  procurementUnitId: Scalars['String']
}

export type QueryExecutionSchemaStatsArgs = {
  executionRequirementId: Scalars['String']
}

export type QueryOperatorArgs = {
  operatorId: Scalars['Int']
}

export type QuerySeasonArgs = {
  seasonId: Scalars['String']
}

export type QuerySeasonsArgs = {
  date: Scalars['BulttiDate']
}

export type QueryProcurementUnitArgs = {
  endDate: Scalars['BulttiDate']
  startDate: Scalars['BulttiDate']
  procurementUnitId: Scalars['String']
}

export type QueryProcurementUnitsByOperatorArgs = {
  endDate: Scalars['BulttiDate']
  startDate: Scalars['BulttiDate']
  operatorId: Scalars['Int']
}

export type QuerySingleEquipmentArgs = {
  equipmentId: Scalars['String']
}

export type QueryEquipmentByOperatorArgs = {
  operatorId: Scalars['Int']
}

export type QueryQueryEquipmentFromSourceArgs = {
  registryNr?: Maybe<Scalars['String']>
  vehicleId?: Maybe<Scalars['String']>
  operatorId: Scalars['Int']
}

export type QueryEquipmentCatalogueArgs = {
  equipmentCatalogueId: Scalars['String']
}

export type QueryEquipmentCatalogueByOperatorArgs = {
  operatorId: Scalars['Int']
}

export type QueryUserArgs = {
  userId: Scalars['Int']
}

export type QueryAvailableDayTypesArgs = {
  inspectionId: Scalars['String']
}

export type QueryReportsArgs = {
  inspectionId?: Maybe<Scalars['String']>
  inspectionType: Scalars['String']
}

export type QueryBlockDeviationsReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>
  sort?: Maybe<Array<InputSortConfig>>
  inspectionId: Scalars['String']
}

export type QueryDeadrunsReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>
  sort?: Maybe<Array<InputSortConfig>>
  inspectionId: Scalars['String']
}

export type QueryDepartureBlocksReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>
  sort?: Maybe<Array<InputSortConfig>>
  inspectionId: Scalars['String']
}

export type QueryAllDeviationsReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>
  sort?: Maybe<Array<InputSortConfig>>
  inspectionId: Scalars['String']
}

export type QueryEmissionClassExecutionReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>
  sort?: Maybe<Array<InputSortConfig>>
  inspectionId: Scalars['String']
}

export type QueryEquipmentColorReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>
  sort?: Maybe<Array<InputSortConfig>>
  inspectionId: Scalars['String']
}

export type QueryEquipmentTypeReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>
  sort?: Maybe<Array<InputSortConfig>>
  inspectionId: Scalars['String']
}

export type QueryExecutionRequirementsReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>
  sort?: Maybe<Array<InputSortConfig>>
  inspectionId: Scalars['String']
}

export type QueryExtraBlockDeparturesReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>
  sort?: Maybe<Array<InputSortConfig>>
  inspectionId: Scalars['String']
}

export type QueryMissingBlockDeparturesReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>
  sort?: Maybe<Array<InputSortConfig>>
  inspectionId: Scalars['String']
}

export type QueryMissingEquipmentReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>
  sort?: Maybe<Array<InputSortConfig>>
  inspectionId: Scalars['String']
}

export type QueryOperatorDeadrunsReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>
  sort?: Maybe<Array<InputSortConfig>>
  inspectionId: Scalars['String']
}

export type QueryOverageDeparturesReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>
  sort?: Maybe<Array<InputSortConfig>>
  inspectionId: Scalars['String']
}

export type QueryTrackedDeparturesReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>
  sort?: Maybe<Array<InputSortConfig>>
  inspectionId: Scalars['String']
}

export type QueryUnitExecutionReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>
  sort?: Maybe<Array<InputSortConfig>>
  inspectionId: Scalars['String']
}

export type QueryEarlyTimingStopDeparturesReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>
  sort?: Maybe<Array<InputSortConfig>>
  inspectionId: Scalars['String']
}

export type QueryObservedLateDeparturesReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>
  sort?: Maybe<Array<InputSortConfig>>
  inspectionId: Scalars['String']
}

export type QueryObservedEmissionClassExecutionReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>
  sort?: Maybe<Array<InputSortConfig>>
  inspectionId: Scalars['String']
}

export type QueryObservedEquipmentColorReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>
  sort?: Maybe<Array<InputSortConfig>>
  inspectionId: Scalars['String']
}

export type QueryObservedEquipmentTypeReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>
  sort?: Maybe<Array<InputSortConfig>>
  inspectionId: Scalars['String']
}

export type QueryObservedExecutionRequirementsReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>
  sort?: Maybe<Array<InputSortConfig>>
  inspectionId: Scalars['String']
}

export type QueryObservedOverageDeparturesReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>
  sort?: Maybe<Array<InputSortConfig>>
  inspectionId: Scalars['String']
}

export type QueryObservedUnitExecutionReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>
  sort?: Maybe<Array<InputSortConfig>>
  inspectionId: Scalars['String']
}

export type QueryUnobservedDeparturesReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>
  sort?: Maybe<Array<InputSortConfig>>
  inspectionId: Scalars['String']
}

export type QuerySanctionSummaryReportArgs = {
  filters?: Maybe<Array<InputFilterConfig>>
  sort?: Maybe<Array<InputSortConfig>>
  inspectionId: Scalars['String']
}

export type QueryContractsArgs = {
  date?: Maybe<Scalars['BulttiDate']>
  operatorId?: Maybe<Scalars['Int']>
}

export type QueryContractsByProcurementUnitArgs = {
  procurementUnitId: Scalars['String']
}

export type QueryContractArgs = {
  contractId: Scalars['String']
}

export type QueryContractProcurementUnitOptionsArgs = {
  contractId: Scalars['String']
  endDate: Scalars['BulttiDate']
  startDate: Scalars['BulttiDate']
  operatorId: Scalars['Int']
}

export type QueryContractUserRelationsArgs = {
  contractId: Scalars['String']
}

export type QueryObservedExecutionRequirementsArgs = {
  postInspectionId: Scalars['String']
}

export type QueryPreviewObservedRequirementArgs = {
  requirementId: Scalars['String']
}

export type QueryGetObservedInspectionDatesArgs = {
  seasonId: Scalars['String']
}

export type QueryInspectionSanctionsArgs = {
  filters?: Maybe<Array<InputFilterConfig>>
  sort?: Maybe<Array<InputSortConfig>>
  inspectionId: Scalars['String']
}

export type QueryRunSanctioningArgs = {
  inspectionId: Scalars['String']
}

export type QueryExecutionRequirementsForPreInspectionAreasArgs = {
  inspectionId: Scalars['String']
}

export type QueryInspectionArgs = {
  inspectionId: Scalars['String']
}

export type QueryInspectionsByOperatorArgs = {
  inspectionType: InspectionType
  operatorId: Scalars['Int']
}

export type QueryCurrentInspectionsByOperatorAndSeasonArgs = {
  inspectionType: InspectionType
  seasonId: Scalars['String']
  operatorId: Scalars['Int']
}

export type QueryAllInspectionsArgs = {
  inspectionType: InspectionType
}

export type QueryInspectionsTimelineArgs = {
  inspectionType: InspectionType
  operatorId: Scalars['Int']
}

export type QueryInspectionUserRelationsArgs = {
  inspectionId: Scalars['String']
}

export type PlannedUnitExecutionRequirement = {
  __typename?: 'PlannedUnitExecutionRequirement'
  id: Scalars['ID']
  metersRequired?: Maybe<Scalars['Float']>
  kilometersRequired?: Maybe<Scalars['Float']>
  metersObserved?: Maybe<Scalars['Float']>
  kilometersObserved?: Maybe<Scalars['Float']>
  averageAgeWeighted?: Maybe<Scalars['Float']>
  averageAgeWeightedFulfilled?: Maybe<Scalars['Float']>
  averageAgeRequirement?: Maybe<Scalars['Float']>
  area: OperatingArea
  areaId: Scalars['Int']
  operator: Operator
  operatorId: Scalars['Int']
  inspection: PreInspection
  inspectionId: Scalars['String']
  equipmentQuotas: Array<ExecutionRequirementQuota>
  procurementUnit: ProcurementUnit
  procurementUnitId: Scalars['String']
  areaRequirement?: Maybe<PlannedExecutionRequirement>
  requirements: Array<PlannedEmissionClassRequirement>
}

export type OperatingArea = {
  __typename?: 'OperatingArea'
  id: Scalars['Int']
  name: OperatingAreaName
  procurementUnits?: Maybe<Array<ProcurementUnit>>
  unitExecutionRequirements?: Maybe<Array<PlannedUnitExecutionRequirement>>
  areaExecutionRequirements?: Maybe<Array<PlannedAreaExecutionRequirement>>
  observedExecutionRequirements?: Maybe<Array<ObservedExecutionRequirement>>
}

export enum OperatingAreaName {
  Center = 'CENTER',
  Other = 'OTHER',
  Unknown = 'UNKNOWN',
}

export type ProcurementUnit = {
  __typename?: 'ProcurementUnit'
  id: Scalars['ID']
  procurementUnitId: Scalars['String']
  operatorId: Scalars['Int']
  operator: Operator
  medianAgeRequirement: Scalars['Float']
  equipmentCatalogues: Array<EquipmentCatalogue>
  areaId?: Maybe<Scalars['Int']>
  area?: Maybe<OperatingArea>
  routes: Array<ProcurementUnitRoute>
  startDate: Scalars['BulttiDate']
  endDate: Scalars['BulttiDate']
  optionsUsed: Scalars['Int']
  executionRequirements: Array<PlannedUnitExecutionRequirement>
  contracts: Array<Contract>
  currentContracts?: Maybe<Array<Contract>>
}

export type Operator = {
  __typename?: 'Operator'
  id: Scalars['Int']
  operatorId: Scalars['Int']
  operatorName: Scalars['String']
  preInspections: Array<PreInspection>
  postInspections: Array<PostInspection>
  contracts: Array<Contract>
  procurementUnits: Array<ProcurementUnit>
  equipment: Array<Equipment>
  equipmentCatalogues: Array<EquipmentCatalogue>
}

export type PreInspection = {
  __typename?: 'PreInspection'
  id: Scalars['ID']
  name?: Maybe<Scalars['String']>
  status: InspectionStatus
  inspectionType: InspectionType
  createdAt: Scalars['DateTime']
  updatedAt: Scalars['DateTime']
  version: Scalars['Int']
  inspectionStartDate: Scalars['BulttiDate']
  inspectionEndDate: Scalars['BulttiDate']
  startDate?: Maybe<Scalars['BulttiDate']>
  endDate?: Maybe<Scalars['BulttiDate']>
  minStartDate: Scalars['BulttiDate']
  versionStackIdentifier?: Maybe<Scalars['String']>
  operatorId: Scalars['Int']
  operator: Operator
  seasonId: Scalars['String']
  season: Season
  areaExecutionRequirements: Array<PlannedAreaExecutionRequirement>
  unitExecutionRequirements: Array<PlannedUnitExecutionRequirement>
  userRelations?: Maybe<Array<InspectionUserRelation>>
  inspectionErrors?: Maybe<Array<ValidationErrorData>>
}

export enum InspectionStatus {
  Draft = 'Draft',
  InReview = 'InReview',
  InProduction = 'InProduction',
  Processing = 'Processing',
  Sanctionable = 'Sanctionable',
}

export enum InspectionType {
  Pre = 'PRE',
  Post = 'POST',
}

export type Season = {
  __typename?: 'Season'
  id: Scalars['ID']
  season: Scalars['String']
  startDate: Scalars['BulttiDate']
  endDate: Scalars['BulttiDate']
  preInspections: Array<PreInspection>
  postInspections: Array<PostInspection>
}

export type PostInspection = {
  __typename?: 'PostInspection'
  id: Scalars['ID']
  name?: Maybe<Scalars['String']>
  status: InspectionStatus
  inspectionType: InspectionType
  createdAt: Scalars['DateTime']
  updatedAt: Scalars['DateTime']
  version: Scalars['Int']
  inspectionStartDate: Scalars['BulttiDate']
  inspectionEndDate: Scalars['BulttiDate']
  startDate?: Maybe<Scalars['BulttiDate']>
  endDate?: Maybe<Scalars['BulttiDate']>
  minStartDate: Scalars['BulttiDate']
  versionStackIdentifier?: Maybe<Scalars['String']>
  operatorId: Scalars['Int']
  operator: Operator
  seasonId: Scalars['String']
  season: Season
  inspectionDate?: Maybe<InspectionDate>
  inspectionDateId?: Maybe<Scalars['String']>
  linkedInspections?: Maybe<Array<LinkedInspectionForWeek>>
  linkedInspectionUpdateAvailable?: Maybe<Scalars['Boolean']>
  observedExecutionRequirements: Array<ObservedExecutionRequirement>
  userRelations?: Maybe<Array<InspectionUserRelation>>
  inspectionErrors?: Maybe<Array<ValidationErrorData>>
}

export type InspectionDate = {
  __typename?: 'InspectionDate'
  id: Scalars['ID']
  startDate: Scalars['BulttiDate']
  endDate: Scalars['BulttiDate']
  hfpDataStatus: HfpStatus
  inspections?: Maybe<Array<PostInspection>>
}

export enum HfpStatus {
  NotLoaded = 'NOT_LOADED',
  Loading = 'LOADING',
  Ready = 'READY',
}

export type LinkedInspectionForWeek = {
  __typename?: 'LinkedInspectionForWeek'
  id: Scalars['String']
  startOfWeek: Scalars['String']
  inspection: PreInspection
}

export type ObservedExecutionRequirement = {
  __typename?: 'ObservedExecutionRequirement'
  id: Scalars['ID']
  metersRequired?: Maybe<Scalars['Float']>
  kilometersRequired?: Maybe<Scalars['Float']>
  metersObserved?: Maybe<Scalars['Float']>
  kilometersObserved?: Maybe<Scalars['Float']>
  area: OperatingArea
  areaId: Scalars['Int']
  operator: Operator
  operatorId: Scalars['Int']
  inspection: PostInspection
  inspectionId: Scalars['String']
  isCombinedAreaRequirement: Scalars['Boolean']
  startDate: Scalars['BulttiDate']
  endDate: Scalars['BulttiDate']
  observedRequirements: Array<ObservedEmissionClassRequirement>
}

export type ObservedEmissionClassRequirement = {
  __typename?: 'ObservedEmissionClassRequirement'
  id?: Maybe<Scalars['ID']>
  observedExecutionRequirement: ObservedExecutionRequirement
  emissionClass: Scalars['Int']
  kilometersRequired?: Maybe<Scalars['Float']>
  quotaRequired?: Maybe<Scalars['Float']>
  kilometersObserved?: Maybe<Scalars['Float']>
  quotaObserved?: Maybe<Scalars['Float']>
  differencePercentage?: Maybe<Scalars['Float']>
  differenceKilometers?: Maybe<Scalars['Float']>
  cumulativeDifferencePercentage?: Maybe<Scalars['Float']>
  equipmentCountRequired?: Maybe<Scalars['Int']>
  equipmentCountObserved?: Maybe<Scalars['Int']>
  sanctionThreshold?: Maybe<Scalars['Float']>
  sanctionAmount?: Maybe<Scalars['Float']>
  sanctionablePercentage?: Maybe<Scalars['Float']>
}

export type InspectionUserRelation = {
  __typename?: 'InspectionUserRelation'
  id: Scalars['ID']
  relatedBy: InspectionUserRelationType
  subscribed: Scalars['Boolean']
  preInspection?: Maybe<PreInspection>
  postInspection?: Maybe<PostInspection>
  user: User
  createdAt: Scalars['DateTime']
  updatedAt: Scalars['DateTime']
}

export enum InspectionUserRelationType {
  CreatedBy = 'CREATED_BY',
  UpdatedBy = 'UPDATED_BY',
  SubscribedTo = 'SUBSCRIBED_TO',
  PublishedBy = 'PUBLISHED_BY',
  RejectedBy = 'REJECTED_BY',
  SubmittedBy = 'SUBMITTED_BY',
  MadeSanctionableBy = 'MADE_SANCTIONABLE_BY',
  SanctionsAbandonedBy = 'SANCTIONS_ABANDONED_BY',
}

export type User = {
  __typename?: 'User'
  id: Scalars['ID']
  name: Scalars['String']
  email: Scalars['String']
  role: UserRole
  organisation?: Maybe<Scalars['String']>
  operatorIds?: Maybe<Array<Scalars['Int']>>
  hslIdGroups: Array<Scalars['String']>
  inspectionRelations: Array<InspectionUserRelation>
  contractRelations: Array<ContractUserRelation>
}

export enum UserRole {
  Admin = 'ADMIN',
  Hsl = 'HSL',
  Operator = 'OPERATOR',
  Blocked = 'BLOCKED',
}

export type ContractUserRelation = {
  __typename?: 'ContractUserRelation'
  id: Scalars['ID']
  relatedBy: ContractUserRelationType
  subscribed: Scalars['Boolean']
  contract: Contract
  user: User
  createdAt: Scalars['DateTime']
  updatedAt: Scalars['DateTime']
}

export enum ContractUserRelationType {
  CreatedBy = 'CREATED_BY',
  UpdatedBy = 'UPDATED_BY',
  SubscribedTo = 'SUBSCRIBED_TO',
}

export type Contract = {
  __typename?: 'Contract'
  id: Scalars['ID']
  description?: Maybe<Scalars['String']>
  operatorId?: Maybe<Scalars['Int']>
  operator: Operator
  createdAt: Scalars['DateTime']
  updatedAt: Scalars['DateTime']
  userRelations: Array<ContractUserRelation>
  startDate: Scalars['BulttiDate']
  endDate: Scalars['BulttiDate']
  procurementUnits: Array<ProcurementUnit>
  rulesFile?: Maybe<Scalars['String']>
  rules?: Maybe<Array<ContractRule>>
}

export type ContractRule = {
  __typename?: 'ContractRule'
  name: Scalars['String']
  code?: Maybe<Scalars['String']>
  category: Scalars['String']
  value: Scalars['String']
  condition?: Maybe<Scalars['String']>
  description?: Maybe<Scalars['String']>
}

export type ValidationErrorData = {
  __typename?: 'ValidationErrorData'
  type: InspectionValidationError
  keys?: Maybe<Array<Scalars['String']>>
  referenceKeys?: Maybe<Array<Scalars['String']>>
  objectId?: Maybe<Scalars['String']>
}

export enum InspectionValidationError {
  InvalidProductionTime = 'INVALID_PRODUCTION_TIME',
  InvalidInspectionTime = 'INVALID_INSPECTION_TIME',
  MissingBlockDepartures = 'MISSING_BLOCK_DEPARTURES',
  MissingContracts = 'MISSING_CONTRACTS',
  ContractOutsideInspectionTime = 'CONTRACT_OUTSIDE_INSPECTION_TIME',
  MissingEquipmentCatalogues = 'MISSING_EQUIPMENT_CATALOGUES',
  MissingExecutionRequirements = 'MISSING_EXECUTION_REQUIREMENTS',
  MissingRequirementQuotas = 'MISSING_REQUIREMENT_QUOTAS',
  HfpUnavailableForInspectionDates = 'HFP_UNAVAILABLE_FOR_INSPECTION_DATES',
  PostInspectionEndDateNotInThePast = 'POST_INSPECTION_END_DATE_NOT_IN_THE_PAST',
  PostInspectionMissingLinkedPreInspections = 'POST_INSPECTION_MISSING_LINKED_PRE_INSPECTIONS',
}

export type PlannedAreaExecutionRequirement = {
  __typename?: 'PlannedAreaExecutionRequirement'
  id: Scalars['ID']
  metersRequired?: Maybe<Scalars['Float']>
  kilometersRequired?: Maybe<Scalars['Float']>
  metersObserved?: Maybe<Scalars['Float']>
  kilometersObserved?: Maybe<Scalars['Float']>
  averageAgeWeighted?: Maybe<Scalars['Float']>
  averageAgeWeightedFulfilled?: Maybe<Scalars['Float']>
  averageAgeRequirement?: Maybe<Scalars['Float']>
  area: OperatingArea
  areaId: Scalars['Int']
  operator: Operator
  operatorId: Scalars['Int']
  inspection: PreInspection
  inspectionId: Scalars['String']
  procurementUnitRequirements?: Maybe<Array<PlannedUnitExecutionRequirement>>
  requirements: Array<PlannedEmissionClassRequirement>
}

export type PlannedEmissionClassRequirement = {
  __typename?: 'PlannedEmissionClassRequirement'
  emissionClass: Scalars['Int']
  kilometerRequirement?: Maybe<Scalars['Float']>
  quotaRequirement?: Maybe<Scalars['Float']>
  kilometersFulfilled?: Maybe<Scalars['Float']>
  quotaFulfilled?: Maybe<Scalars['Float']>
  differencePercentage?: Maybe<Scalars['Float']>
  cumulativeDifferencePercentage?: Maybe<Scalars['Float']>
  equipmentCount?: Maybe<Scalars['Int']>
  equipmentCountFulfilled?: Maybe<Scalars['Int']>
  sanctionThreshold?: Maybe<Scalars['Float']>
  sanctionAmount?: Maybe<Scalars['Float']>
  classSanctionAmount?: Maybe<Scalars['Float']>
}

export type Equipment = {
  __typename?: 'Equipment'
  id: Scalars['ID']
  vehicleId: Scalars['String']
  operator: Operator
  operatorId: Scalars['Int']
  model?: Maybe<Scalars['String']>
  registryNr: Scalars['String']
  registryDate: Scalars['BulttiDate']
  type: Scalars['String']
  exteriorColor: Scalars['String']
  hasInfoSystems: Scalars['Boolean']
  option: Scalars['Boolean']
  approvedOverage: Scalars['Boolean']
  emissionClass: Scalars['Int']
  equipmentCatalogueQuotas: Array<EquipmentCatalogueQuota>
  executionRequirementQuotas: Array<ExecutionRequirementQuota>
}

export type EquipmentCatalogueQuota = {
  __typename?: 'EquipmentCatalogueQuota'
  id: Scalars['ID']
  percentageQuota: Scalars['Float']
  equipmentId: Scalars['String']
  equipmentCatalogueId: Scalars['String']
  equipment?: Maybe<Equipment>
  equipmentCatalogue?: Maybe<EquipmentCatalogue>
  catalogueStartDate: Scalars['BulttiDate']
  catalogueEndDate: Scalars['BulttiDate']
}

export type EquipmentCatalogue = {
  __typename?: 'EquipmentCatalogue'
  id: Scalars['ID']
  equipmentCatalogueId: Scalars['String']
  operatorId: Scalars['Int']
  operator: Operator
  procurementUnitId: Scalars['String']
  procurementUnit: ProcurementUnit
  startDate: Scalars['String']
  endDate: Scalars['String']
  equipmentQuotas: Array<EquipmentCatalogueQuota>
}

export type ExecutionRequirementQuota = {
  __typename?: 'ExecutionRequirementQuota'
  id: Scalars['ID']
  percentageQuota: Scalars['Float']
  meterRequirement: Scalars['Float']
  equipmentId: Scalars['String']
  executionRequirementId: Scalars['String']
  equipment: Equipment
  executionRequirement: PlannedUnitExecutionRequirement
  requirementOnly: Scalars['Boolean']
}

export type ProcurementUnitRoute = {
  __typename?: 'ProcurementUnitRoute'
  routeId: Scalars['String']
}

export type PlannedExecutionRequirement = {
  __typename?: 'PlannedExecutionRequirement'
  id: Scalars['ID']
  metersRequired?: Maybe<Scalars['Float']>
  kilometersRequired?: Maybe<Scalars['Float']>
  metersObserved?: Maybe<Scalars['Float']>
  kilometersObserved?: Maybe<Scalars['Float']>
  averageAgeWeighted?: Maybe<Scalars['Float']>
  averageAgeWeightedFulfilled?: Maybe<Scalars['Float']>
  averageAgeRequirement?: Maybe<Scalars['Float']>
}

export type ExecutionSchemaStats = {
  __typename?: 'ExecutionSchemaStats'
  id: Scalars['String']
  procurementUnitId: Scalars['String']
  executionRequirementId: Scalars['String']
  dayTypeEquipment: Array<DayTypeEquipmentStat>
  equipmentTypes: Array<EquipmentTypeStat>
}

export type DayTypeEquipmentStat = {
  __typename?: 'DayTypeEquipmentStat'
  dayType: Scalars['String']
  equipmentCount: Scalars['Int']
  kilometers: Scalars['Float']
}

export type EquipmentTypeStat = {
  __typename?: 'EquipmentTypeStat'
  equipmentType: Scalars['String']
  equipmentCount: Scalars['Int']
  kilometers: Scalars['Float']
}

export type ReportListItem = {
  __typename?: 'ReportListItem'
  name: Scalars['String']
  title: Scalars['String']
  description: Scalars['String']
}

export type BlockDeviationsReport = {
  __typename?: 'BlockDeviationsReport'
  filteredCount: Scalars['Int']
  totalCount: Scalars['Int']
  filters?: Maybe<Array<FilterConfig>>
  sort?: Maybe<Array<SortConfig>>
  responseId: Scalars['String']
  id: Scalars['String']
  name: Scalars['String']
  title: Scalars['String']
  description: Scalars['String']
  columnLabels: Scalars['String']
  seasonId: Scalars['String']
  operatorId: Scalars['Float']
  inspectionId: Scalars['String']
  showSanctioned?: Maybe<Scalars['Boolean']>
  showUnsanctioned?: Maybe<Scalars['Boolean']>
  rows: Array<DeviationsReportData>
}

export type FilterConfig = {
  __typename?: 'FilterConfig'
  field: Scalars['String']
  filterValue: Scalars['String']
}

export type SortConfig = {
  __typename?: 'SortConfig'
  column: Scalars['String']
  order: SortOrder
}

export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC',
}

export type DeviationsReportData = {
  __typename?: 'DeviationsReportData'
  id: Scalars['ID']
  routeId: Scalars['String']
  dayType: Scalars['String']
  journeyStartTime: Scalars['String']
  journeyEndTime: Scalars['String']
  direction: Scalars['String']
  trackReason: TrackReason
  registryNr?: Maybe<Scalars['String']>
  terminalTime: Scalars['Float']
  recoveryTime: Scalars['Float']
  overlapSeconds: Scalars['Float']
  overlapPlannedBy?: Maybe<Scalars['String']>
}

export enum TrackReason {
  NotTracked = 'NOT_TRACKED',
  DefaultTracked = 'DEFAULT_TRACKED',
  FirstDepartureInBlock = 'FIRST_DEPARTURE_IN_BLOCK',
  FirstDepartureAfterDeadrun = 'FIRST_DEPARTURE_AFTER_DEADRUN',
  ExtraDeparture = 'EXTRA_DEPARTURE',
  MissingDeparture = 'MISSING_DEPARTURE',
  RecoveryViolation = 'RECOVERY_VIOLATION',
  DeadrunDetected = 'DEADRUN_DETECTED',
  EquipmentTypeViolation = 'EQUIPMENT_TYPE_VIOLATION',
  EquipmentAgeViolation = 'EQUIPMENT_AGE_VIOLATION',
  ExteriorColorViolation = 'EXTERIOR_COLOR_VIOLATION',
  TimingStopViolation = 'TIMING_STOP_VIOLATION',
  UnobservedDeparture = 'UNOBSERVED_DEPARTURE',
}

export type InputFilterConfig = {
  field: Scalars['String']
  filterValue: Scalars['String']
}

export type InputSortConfig = {
  column: Scalars['String']
  order: SortOrder
}

export type DeadrunsReport = {
  __typename?: 'DeadrunsReport'
  filteredCount: Scalars['Int']
  totalCount: Scalars['Int']
  filters?: Maybe<Array<FilterConfig>>
  sort?: Maybe<Array<SortConfig>>
  responseId: Scalars['String']
  id: Scalars['String']
  name: Scalars['String']
  title: Scalars['String']
  description: Scalars['String']
  columnLabels: Scalars['String']
  seasonId: Scalars['String']
  operatorId: Scalars['Float']
  inspectionId: Scalars['String']
  showSanctioned?: Maybe<Scalars['Boolean']>
  showUnsanctioned?: Maybe<Scalars['Boolean']>
  rows: Array<DeadrunsReportData>
}

export type DeadrunsReportData = {
  __typename?: 'DeadrunsReportData'
  id: Scalars['ID']
  dayType: Scalars['String']
  aRouteId: Scalars['String']
  aDirection: Scalars['String']
  aJourneyStartTime: Scalars['String']
  aJourneyEndTime: Scalars['String']
  aTerminalTime: Scalars['Float']
  aRecoveryTime: Scalars['Float']
  aOriginStop: Scalars['String']
  aDestinationStop: Scalars['String']
  bRouteId: Scalars['String']
  bDirection: Scalars['String']
  bJourneyStartTime: Scalars['String']
  bJourneyEndTime: Scalars['String']
  bTerminalTime: Scalars['Float']
  bRecoveryTime: Scalars['Float']
  bOriginStop: Scalars['String']
  bDestinationStop: Scalars['String']
  deadrunMinutes: Scalars['Int']
  deadrunPlannedBy: Scalars['String']
  blockNumber?: Maybe<Scalars['String']>
  schemaId?: Maybe<Scalars['String']>
  equipmentRotation?: Maybe<Scalars['Int']>
}

export type DepartureBlocksReport = {
  __typename?: 'DepartureBlocksReport'
  filteredCount: Scalars['Int']
  totalCount: Scalars['Int']
  filters?: Maybe<Array<FilterConfig>>
  sort?: Maybe<Array<SortConfig>>
  responseId: Scalars['String']
  id: Scalars['String']
  name: Scalars['String']
  title: Scalars['String']
  description: Scalars['String']
  columnLabels: Scalars['String']
  seasonId: Scalars['String']
  operatorId: Scalars['Float']
  inspectionId: Scalars['String']
  showSanctioned?: Maybe<Scalars['Boolean']>
  showUnsanctioned?: Maybe<Scalars['Boolean']>
  rows: Array<DepartureBlocksReportData>
}

export type DepartureBlocksReportData = {
  __typename?: 'DepartureBlocksReportData'
  id: Scalars['ID']
  blockNumber: Scalars['String']
  dayType: Scalars['String']
  journeyType: Scalars['String']
  routeId: Scalars['String']
  direction: Scalars['String']
  journeyStartTime: Scalars['String']
  journeyEndTime: Scalars['String']
  registryNr?: Maybe<Scalars['String']>
  vehicleId?: Maybe<Scalars['String']>
}

export type DeviationsReport = {
  __typename?: 'DeviationsReport'
  filteredCount: Scalars['Int']
  totalCount: Scalars['Int']
  filters?: Maybe<Array<FilterConfig>>
  sort?: Maybe<Array<SortConfig>>
  responseId: Scalars['String']
  id: Scalars['String']
  name: Scalars['String']
  title: Scalars['String']
  description: Scalars['String']
  columnLabels: Scalars['String']
  seasonId: Scalars['String']
  operatorId: Scalars['Float']
  inspectionId: Scalars['String']
  showSanctioned?: Maybe<Scalars['Boolean']>
  showUnsanctioned?: Maybe<Scalars['Boolean']>
  rows: Array<DeviationsReportData>
}

export type EmissionClassExecutionReport = {
  __typename?: 'EmissionClassExecutionReport'
  filteredCount: Scalars['Int']
  totalCount: Scalars['Int']
  filters?: Maybe<Array<FilterConfig>>
  sort?: Maybe<Array<SortConfig>>
  responseId: Scalars['String']
  id: Scalars['String']
  name: Scalars['String']
  title: Scalars['String']
  description: Scalars['String']
  columnLabels: Scalars['String']
  seasonId: Scalars['String']
  operatorId: Scalars['Float']
  inspectionId: Scalars['String']
  showSanctioned?: Maybe<Scalars['Boolean']>
  showUnsanctioned?: Maybe<Scalars['Boolean']>
  rows: Array<EmissionClassExecutionReportData>
}

export type EmissionClassExecutionReportData = {
  __typename?: 'EmissionClassExecutionReportData'
  id: Scalars['ID']
  procurementUnitId?: Maybe<Scalars['String']>
  class1?: Maybe<Scalars['Float']>
  class2?: Maybe<Scalars['Float']>
  class3?: Maybe<Scalars['Float']>
  class4?: Maybe<Scalars['Float']>
  class5?: Maybe<Scalars['Float']>
  class6?: Maybe<Scalars['Float']>
  class7?: Maybe<Scalars['Float']>
  class8?: Maybe<Scalars['Float']>
  class9?: Maybe<Scalars['Float']>
  class10?: Maybe<Scalars['Float']>
}

export type EquipmentColorReport = {
  __typename?: 'EquipmentColorReport'
  filteredCount: Scalars['Int']
  totalCount: Scalars['Int']
  filters?: Maybe<Array<FilterConfig>>
  sort?: Maybe<Array<SortConfig>>
  responseId: Scalars['String']
  id: Scalars['String']
  name: Scalars['String']
  title: Scalars['String']
  description: Scalars['String']
  columnLabels: Scalars['String']
  seasonId: Scalars['String']
  operatorId: Scalars['Float']
  inspectionId: Scalars['String']
  showSanctioned?: Maybe<Scalars['Boolean']>
  showUnsanctioned?: Maybe<Scalars['Boolean']>
  rows: Array<EquipmentColorReportData>
}

export type EquipmentColorReportData = {
  __typename?: 'EquipmentColorReportData'
  id: Scalars['ID']
  routeId: Scalars['String']
  dayType: Scalars['String']
  journeyStartTime: Scalars['String']
  journeyEndTime: Scalars['String']
  direction: Scalars['String']
  trackReason: TrackReason
  registryNr: Scalars['String']
  equipmentExteriorColor: Scalars['String']
}

export type EquipmentTypeReport = {
  __typename?: 'EquipmentTypeReport'
  filteredCount: Scalars['Int']
  totalCount: Scalars['Int']
  filters?: Maybe<Array<FilterConfig>>
  sort?: Maybe<Array<SortConfig>>
  responseId: Scalars['String']
  id: Scalars['String']
  name: Scalars['String']
  title: Scalars['String']
  description: Scalars['String']
  columnLabels: Scalars['String']
  seasonId: Scalars['String']
  operatorId: Scalars['Float']
  inspectionId: Scalars['String']
  showSanctioned?: Maybe<Scalars['Boolean']>
  showUnsanctioned?: Maybe<Scalars['Boolean']>
  rows: Array<EquipmentTypeReportData>
}

export type EquipmentTypeReportData = {
  __typename?: 'EquipmentTypeReportData'
  id: Scalars['ID']
  routeId: Scalars['String']
  dayType: Scalars['String']
  journeyStartTime: Scalars['String']
  journeyEndTime: Scalars['String']
  direction: Scalars['String']
  trackReason: TrackReason
  registryNr: Scalars['String']
  plannedEquipmentType: Scalars['String']
  equipmentTypeRequired: Scalars['Boolean']
  observedEquipmentType: Scalars['String']
}

export type ExecutionRequirementsReport = {
  __typename?: 'ExecutionRequirementsReport'
  filteredCount: Scalars['Int']
  totalCount: Scalars['Int']
  filters?: Maybe<Array<FilterConfig>>
  sort?: Maybe<Array<SortConfig>>
  responseId: Scalars['String']
  id: Scalars['String']
  name: Scalars['String']
  title: Scalars['String']
  description: Scalars['String']
  columnLabels: Scalars['String']
  seasonId: Scalars['String']
  operatorId: Scalars['Float']
  inspectionId: Scalars['String']
  showSanctioned?: Maybe<Scalars['Boolean']>
  showUnsanctioned?: Maybe<Scalars['Boolean']>
  rows: Array<ExecutionRequirementsReportData>
}

export type ExecutionRequirementsReportData = {
  __typename?: 'ExecutionRequirementsReportData'
  id: Scalars['ID']
  operatorId: Scalars['Int']
  areaName: Scalars['String']
  totalKilometers: Scalars['Float']
  totalKilometersFulfilled: Scalars['Float']
  averageAgeWeighted?: Maybe<Scalars['Float']>
  averageAgeWeightedFulfilled?: Maybe<Scalars['Float']>
  id: Scalars['ID']
  kilometersObserved?: Maybe<Scalars['Float']>
  kilometersRequired?: Maybe<Scalars['Float']>
  metersObserved?: Maybe<Scalars['Float']>
  metersRequired?: Maybe<Scalars['Float']>
}

export type PlannedUnitExecutionRequirement = {
  __typename?: 'PlannedUnitExecutionRequirement'
  area: OperatingArea
  areaId: Scalars['Int']
  areaRequirement?: Maybe<PlannedExecutionRequirement>
  averageAgeRequirement?: Maybe<Scalars['Float']>
  averageAgeWeightedFulfilled?: Maybe<Scalars['Float']>
  requirements: Array<PlannedEmissionClassRequirement>
}

export type ExtraBlockDeparturesReport = {
  __typename?: 'ExtraBlockDeparturesReport'
  filteredCount: Scalars['Int']
  totalCount: Scalars['Int']
  filters?: Maybe<Array<FilterConfig>>
  sort?: Maybe<Array<SortConfig>>
  responseId: Scalars['String']
  id: Scalars['String']
  name: Scalars['String']
  title: Scalars['String']
  description: Scalars['String']
  columnLabels: Scalars['String']
  seasonId: Scalars['String']
  operatorId: Scalars['Float']
  inspectionId: Scalars['String']
  showSanctioned?: Maybe<Scalars['Boolean']>
  showUnsanctioned?: Maybe<Scalars['Boolean']>
  rows: Array<ExtraBlockDeparturesReportData>
}

export type ExtraBlockDeparturesReportData = {
  __typename?: 'ExtraBlockDeparturesReportData'
  id: Scalars['ID']
  routeId: Scalars['String']
  dayType: Scalars['String']
  journeyStartTime: Scalars['String']
  journeyEndTime: Scalars['String']
  direction: Scalars['String']
  trackReason: TrackReason
}

export type MissingBlockDeparturesReport = {
  __typename?: 'MissingBlockDeparturesReport'
  filteredCount: Scalars['Int']
  totalCount: Scalars['Int']
  filters?: Maybe<Array<FilterConfig>>
  sort?: Maybe<Array<SortConfig>>
  responseId: Scalars['String']
  id: Scalars['String']
  name: Scalars['String']
  title: Scalars['String']
  description: Scalars['String']
  columnLabels: Scalars['String']
  seasonId: Scalars['String']
  operatorId: Scalars['Float']
  inspectionId: Scalars['String']
  showSanctioned?: Maybe<Scalars['Boolean']>
  showUnsanctioned?: Maybe<Scalars['Boolean']>
  rows: Array<MissingBlockDeparturesReportData>
}

export type MissingBlockDeparturesReportData = {
  __typename?: 'MissingBlockDeparturesReportData'
  id: Scalars['ID']
  routeId: Scalars['String']
  dayType: Scalars['String']
  journeyStartTime: Scalars['String']
  journeyEndTime: Scalars['String']
  direction: Scalars['String']
  trackReason: TrackReason
}

export type MissingEquipmentReport = {
  __typename?: 'MissingEquipmentReport'
  filteredCount: Scalars['Int']
  totalCount: Scalars['Int']
  filters?: Maybe<Array<FilterConfig>>
  sort?: Maybe<Array<SortConfig>>
  responseId: Scalars['String']
  id: Scalars['String']
  name: Scalars['String']
  title: Scalars['String']
  description: Scalars['String']
  columnLabels: Scalars['String']
  seasonId: Scalars['String']
  operatorId: Scalars['Float']
  inspectionId: Scalars['String']
  showSanctioned?: Maybe<Scalars['Boolean']>
  showUnsanctioned?: Maybe<Scalars['Boolean']>
  rows: Array<MissingEquipmentReportData>
}

export type MissingEquipmentReportData = {
  __typename?: 'MissingEquipmentReportData'
  id: Scalars['ID']
  registryNr?: Maybe<Scalars['String']>
  vehicleId?: Maybe<Scalars['String']>
  blockNumber?: Maybe<Scalars['String']>
}

export type OperatorDeadrunsReport = {
  __typename?: 'OperatorDeadrunsReport'
  filteredCount: Scalars['Int']
  totalCount: Scalars['Int']
  filters?: Maybe<Array<FilterConfig>>
  sort?: Maybe<Array<SortConfig>>
  responseId: Scalars['String']
  id: Scalars['String']
  name: Scalars['String']
  title: Scalars['String']
  description: Scalars['String']
  columnLabels: Scalars['String']
  seasonId: Scalars['String']
  operatorId: Scalars['Float']
  inspectionId: Scalars['String']
  showSanctioned?: Maybe<Scalars['Boolean']>
  showUnsanctioned?: Maybe<Scalars['Boolean']>
  rows: Array<DeadrunsReportData>
}

export type OverAgeDeparturesReport = {
  __typename?: 'OverAgeDeparturesReport'
  filteredCount: Scalars['Int']
  totalCount: Scalars['Int']
  filters?: Maybe<Array<FilterConfig>>
  sort?: Maybe<Array<SortConfig>>
  responseId: Scalars['String']
  id: Scalars['String']
  name: Scalars['String']
  title: Scalars['String']
  description: Scalars['String']
  columnLabels: Scalars['String']
  seasonId: Scalars['String']
  operatorId: Scalars['Float']
  inspectionId: Scalars['String']
  showSanctioned?: Maybe<Scalars['Boolean']>
  showUnsanctioned?: Maybe<Scalars['Boolean']>
  rows: Array<OverAgeDeparturesReportData>
}

export type OverAgeDeparturesReportData = {
  __typename?: 'OverAgeDeparturesReportData'
  id: Scalars['ID']
  routeId: Scalars['String']
  dayType: Scalars['String']
  journeyStartTime: Scalars['String']
  journeyEndTime: Scalars['String']
  direction: Scalars['String']
  trackReason: TrackReason
  registryNr: Scalars['String']
  observedEquipmentAge: Scalars['Float']
  overAgeType: Scalars['String']
}

export type TrackedDeparturesReport = {
  __typename?: 'TrackedDeparturesReport'
  filteredCount: Scalars['Int']
  totalCount: Scalars['Int']
  filters?: Maybe<Array<FilterConfig>>
  sort?: Maybe<Array<SortConfig>>
  responseId: Scalars['String']
  id: Scalars['String']
  name: Scalars['String']
  title: Scalars['String']
  description: Scalars['String']
  columnLabels: Scalars['String']
  seasonId: Scalars['String']
  operatorId: Scalars['Float']
  inspectionId: Scalars['String']
  showSanctioned?: Maybe<Scalars['Boolean']>
  showUnsanctioned?: Maybe<Scalars['Boolean']>
  rows: Array<TrackedDeparturesReportData>
}

export type TrackedDeparturesReportData = {
  __typename?: 'TrackedDeparturesReportData'
  id: Scalars['ID']
  routeId: Scalars['String']
  dayType: Scalars['String']
  journeyStartTime: Scalars['String']
  journeyEndTime: Scalars['String']
  direction: Scalars['String']
  trackReason: TrackReason
}

export type UnitExecutionReport = {
  __typename?: 'UnitExecutionReport'
  filteredCount: Scalars['Int']
  totalCount: Scalars['Int']
  filters?: Maybe<Array<FilterConfig>>
  sort?: Maybe<Array<SortConfig>>
  responseId: Scalars['String']
  id: Scalars['String']
  name: Scalars['String']
  title: Scalars['String']
  description: Scalars['String']
  columnLabels: Scalars['String']
  seasonId: Scalars['String']
  operatorId: Scalars['Float']
  inspectionId: Scalars['String']
  showSanctioned?: Maybe<Scalars['Boolean']>
  showUnsanctioned?: Maybe<Scalars['Boolean']>
  rows: Array<UnitExecutionReportData>
}

export type UnitExecutionReportData = {
  __typename?: 'UnitExecutionReportData'
  id: Scalars['ID']
  procurementUnitId: Scalars['String']
  kilometersRequired: Scalars['Float']
  kilometersFulfilled: Scalars['Float']
  averageAgeMax: Scalars['Float']
  averageAgeRequired: Scalars['Float']
  averageAgeWeighted: Scalars['Float']
  averageAgeWeightedFulfilled: Scalars['Float']
}

export type EarlyTimingStopDeparturesReport = {
  __typename?: 'EarlyTimingStopDeparturesReport'
  filteredCount: Scalars['Int']
  totalCount: Scalars['Int']
  filters?: Maybe<Array<FilterConfig>>
  sort?: Maybe<Array<SortConfig>>
  responseId: Scalars['String']
  id: Scalars['String']
  name: Scalars['String']
  title: Scalars['String']
  description: Scalars['String']
  columnLabels: Scalars['String']
  seasonId: Scalars['String']
  operatorId: Scalars['Float']
  inspectionId: Scalars['String']
  showSanctioned?: Maybe<Scalars['Boolean']>
  showUnsanctioned?: Maybe<Scalars['Boolean']>
  rows: Array<EarlyTimingStopDeparturesReportData>
}

export type EarlyTimingStopDeparturesReportData = {
  __typename?: 'EarlyTimingStopDeparturesReportData'
  id: Scalars['ID']
  routeId: Scalars['String']
  dayType: Scalars['String']
  journeyStartTime: Scalars['String']
  journeyEndTime: Scalars['String']
  direction: Scalars['String']
  trackReason: TrackReason
  date: Scalars['String']
  stopId: Scalars['String']
  procurementUnitId: Scalars['String']
  plannedDepartureTime: Scalars['String']
  observedDepartureTime: Scalars['String']
  observedDepartureDifferenceSeconds: Scalars['Int']
  journeyKilometers: Scalars['Float']
  sanctionedKilometers?: Maybe<Scalars['Float']>
  sanctionAmount?: Maybe<Scalars['Float']>
}

export type LateDeparturesReport = {
  __typename?: 'LateDeparturesReport'
  filteredCount: Scalars['Int']
  totalCount: Scalars['Int']
  filters?: Maybe<Array<FilterConfig>>
  sort?: Maybe<Array<SortConfig>>
  responseId: Scalars['String']
  id: Scalars['String']
  name: Scalars['String']
  title: Scalars['String']
  description: Scalars['String']
  columnLabels: Scalars['String']
  seasonId: Scalars['String']
  operatorId: Scalars['Float']
  inspectionId: Scalars['String']
  showSanctioned?: Maybe<Scalars['Boolean']>
  showUnsanctioned?: Maybe<Scalars['Boolean']>
  rows: Array<LateDeparturesReportData>
}

export type LateDeparturesReportData = {
  __typename?: 'LateDeparturesReportData'
  id: Scalars['ID']
  routeId: Scalars['String']
  dayType: Scalars['String']
  journeyStartTime: Scalars['String']
  journeyEndTime: Scalars['String']
  direction: Scalars['String']
  trackReason: TrackReason
  date: Scalars['String']
  observedDepartureTime: Scalars['DateTime']
  observedArrivalTime: Scalars['DateTime']
  sanctionedKilometers?: Maybe<Scalars['Float']>
  sanctionAmount?: Maybe<Scalars['Float']>
  procurementUnitId: Scalars['String']
  registryNr: Scalars['String']
  journeyKilometers: Scalars['Float']
  observedLateDepartureSeconds: Scalars['Float']
  observedLateArrivalSeconds: Scalars['Float']
}

export type ObservedEmissionClassExecutionReport = {
  __typename?: 'ObservedEmissionClassExecutionReport'
  filteredCount: Scalars['Int']
  totalCount: Scalars['Int']
  filters?: Maybe<Array<FilterConfig>>
  sort?: Maybe<Array<SortConfig>>
  responseId: Scalars['String']
  id: Scalars['String']
  name: Scalars['String']
  title: Scalars['String']
  description: Scalars['String']
  columnLabels: Scalars['String']
  seasonId: Scalars['String']
  operatorId: Scalars['Float']
  inspectionId: Scalars['String']
  showSanctioned?: Maybe<Scalars['Boolean']>
  showUnsanctioned?: Maybe<Scalars['Boolean']>
  rows: Array<ObservedEmissionClassExecutionReportData>
}

export type ObservedEmissionClassExecutionReportData = {
  __typename?: 'ObservedEmissionClassExecutionReportData'
  id: Scalars['ID']
  procurementUnitId?: Maybe<Scalars['String']>
  class1?: Maybe<Scalars['Float']>
  class2?: Maybe<Scalars['Float']>
  class3?: Maybe<Scalars['Float']>
  class4?: Maybe<Scalars['Float']>
  class5?: Maybe<Scalars['Float']>
  class6?: Maybe<Scalars['Float']>
  class7?: Maybe<Scalars['Float']>
  class8?: Maybe<Scalars['Float']>
  class9?: Maybe<Scalars['Float']>
  class10?: Maybe<Scalars['Float']>
}

export type ObservedEquipmentColorReport = {
  __typename?: 'ObservedEquipmentColorReport'
  filteredCount: Scalars['Int']
  totalCount: Scalars['Int']
  filters?: Maybe<Array<FilterConfig>>
  sort?: Maybe<Array<SortConfig>>
  responseId: Scalars['String']
  id: Scalars['String']
  name: Scalars['String']
  title: Scalars['String']
  description: Scalars['String']
  columnLabels: Scalars['String']
  seasonId: Scalars['String']
  operatorId: Scalars['Float']
  inspectionId: Scalars['String']
  showSanctioned?: Maybe<Scalars['Boolean']>
  showUnsanctioned?: Maybe<Scalars['Boolean']>
  rows: Array<ObservedEquipmentColorReportData>
}

export type ObservedEquipmentColorReportData = {
  __typename?: 'ObservedEquipmentColorReportData'
  id: Scalars['ID']
  routeId: Scalars['String']
  dayType: Scalars['String']
  journeyStartTime: Scalars['String']
  journeyEndTime: Scalars['String']
  direction: Scalars['String']
  trackReason: TrackReason
  date: Scalars['String']
  observedDepartureTime: Scalars['DateTime']
  observedArrivalTime: Scalars['DateTime']
  sanctionedKilometers?: Maybe<Scalars['Float']>
  sanctionAmount?: Maybe<Scalars['Float']>
  procurementUnitId: Scalars['String']
  registryNr: Scalars['String']
  observedExteriorColor: Scalars['String']
  journeyKilometers: Scalars['Float']
}

export type ObservedEquipmentTypeReport = {
  __typename?: 'ObservedEquipmentTypeReport'
  filteredCount: Scalars['Int']
  totalCount: Scalars['Int']
  filters?: Maybe<Array<FilterConfig>>
  sort?: Maybe<Array<SortConfig>>
  responseId: Scalars['String']
  id: Scalars['String']
  name: Scalars['String']
  title: Scalars['String']
  description: Scalars['String']
  columnLabels: Scalars['String']
  seasonId: Scalars['String']
  operatorId: Scalars['Float']
  inspectionId: Scalars['String']
  showSanctioned?: Maybe<Scalars['Boolean']>
  showUnsanctioned?: Maybe<Scalars['Boolean']>
  rows: Array<ObservedEquipmentTypeReportData>
}

export type ObservedEquipmentTypeReportData = {
  __typename?: 'ObservedEquipmentTypeReportData'
  id: Scalars['ID']
  routeId: Scalars['String']
  dayType: Scalars['String']
  journeyStartTime: Scalars['String']
  journeyEndTime: Scalars['String']
  direction: Scalars['String']
  trackReason: TrackReason
  date: Scalars['String']
  observedDepartureTime: Scalars['DateTime']
  observedArrivalTime: Scalars['DateTime']
  sanctionedKilometers?: Maybe<Scalars['Float']>
  sanctionAmount?: Maybe<Scalars['Float']>
  registryNr: Scalars['String']
  plannedEquipmentType: Scalars['String']
  equipmentTypeRequired: Scalars['Boolean']
  observedEquipmentType: Scalars['String']
  procurementUnitId: Scalars['String']
  journeyKilometers: Scalars['Float']
}

export type ObservedExecutionRequirementsReport = {
  __typename?: 'ObservedExecutionRequirementsReport'
  filteredCount: Scalars['Int']
  totalCount: Scalars['Int']
  filters?: Maybe<Array<FilterConfig>>
  sort?: Maybe<Array<SortConfig>>
  responseId: Scalars['String']
  id: Scalars['String']
  name: Scalars['String']
  title: Scalars['String']
  description: Scalars['String']
  columnLabels: Scalars['String']
  seasonId: Scalars['String']
  operatorId: Scalars['Float']
  inspectionId: Scalars['String']
  showSanctioned?: Maybe<Scalars['Boolean']>
  showUnsanctioned?: Maybe<Scalars['Boolean']>
  rows: Array<ObservedExecutionRequirementsReportData>
}

export type ObservedExecutionRequirementsReportData = {
  __typename?: 'ObservedExecutionRequirementsReportData'
  id: Scalars['ID']
  operatorId: Scalars['Int']
  startDate: Scalars['BulttiDate']
  endDate: Scalars['BulttiDate']
  areaName: Scalars['String']
  totalKilometersRequired: Scalars['Float']
  totalKilometersObserved: Scalars['Float']
  observedRequirements: Array<ObservedEmissionClassRequirement>
}

export type ObservedOverAgeDeparturesReport = {
  __typename?: 'ObservedOverAgeDeparturesReport'
  filteredCount: Scalars['Int']
  totalCount: Scalars['Int']
  filters?: Maybe<Array<FilterConfig>>
  sort?: Maybe<Array<SortConfig>>
  responseId: Scalars['String']
  id: Scalars['String']
  name: Scalars['String']
  title: Scalars['String']
  description: Scalars['String']
  columnLabels: Scalars['String']
  seasonId: Scalars['String']
  operatorId: Scalars['Float']
  inspectionId: Scalars['String']
  showSanctioned?: Maybe<Scalars['Boolean']>
  showUnsanctioned?: Maybe<Scalars['Boolean']>
  rows: Array<ObservedOverAgeDeparturesReportData>
}

export type ObservedOverAgeDeparturesReportData = {
  __typename?: 'ObservedOverAgeDeparturesReportData'
  id: Scalars['ID']
  routeId: Scalars['String']
  dayType: Scalars['String']
  journeyStartTime: Scalars['String']
  journeyEndTime: Scalars['String']
  direction: Scalars['String']
  trackReason: TrackReason
  date: Scalars['String']
  observedDepartureTime: Scalars['DateTime']
  observedArrivalTime: Scalars['DateTime']
  sanctionedKilometers?: Maybe<Scalars['Float']>
  sanctionAmount?: Maybe<Scalars['Float']>
  procurementUnitId: Scalars['String']
  registryNr: Scalars['String']
  observedEquipmentAge: Scalars['Float']
  overAgeType: Scalars['String']
  journeyKilometers: Scalars['Float']
}

export type ObservedUnitExecutionReport = {
  __typename?: 'ObservedUnitExecutionReport'
  filteredCount: Scalars['Int']
  totalCount: Scalars['Int']
  filters?: Maybe<Array<FilterConfig>>
  sort?: Maybe<Array<SortConfig>>
  responseId: Scalars['String']
  id: Scalars['String']
  name: Scalars['String']
  title: Scalars['String']
  description: Scalars['String']
  columnLabels: Scalars['String']
  seasonId: Scalars['String']
  operatorId: Scalars['Float']
  inspectionId: Scalars['String']
  showSanctioned?: Maybe<Scalars['Boolean']>
  showUnsanctioned?: Maybe<Scalars['Boolean']>
  rows: Array<ObservedUnitExecution>
}

export type ObservedUnitExecution = {
  __typename?: 'ObservedUnitExecution'
  id: Scalars['ID']
  procurementUnitId: Scalars['String']
  area?: Maybe<OperatingAreaName>
  totalUnitKilometers: Scalars['Float']
  totalKilometersObserved?: Maybe<Scalars['Float']>
  averageAgeMax?: Maybe<Scalars['Float']>
  averageAgeRequired?: Maybe<Scalars['Float']>
  averageAgeWeightedObserved?: Maybe<Scalars['Float']>
  sanctionedKilometers?: Maybe<Scalars['Float']>
  sanctionAmount?: Maybe<Scalars['Float']>
}

export type UnobservedDeparturesReport = {
  __typename?: 'UnobservedDeparturesReport'
  filteredCount: Scalars['Int']
  totalCount: Scalars['Int']
  filters?: Maybe<Array<FilterConfig>>
  sort?: Maybe<Array<SortConfig>>
  responseId: Scalars['String']
  id: Scalars['String']
  name: Scalars['String']
  title: Scalars['String']
  description: Scalars['String']
  columnLabels: Scalars['String']
  seasonId: Scalars['String']
  operatorId: Scalars['Float']
  inspectionId: Scalars['String']
  showSanctioned?: Maybe<Scalars['Boolean']>
  showUnsanctioned?: Maybe<Scalars['Boolean']>
  rows: Array<UnobservedDeparturesReportData>
}

export type UnobservedDeparturesReportData = {
  __typename?: 'UnobservedDeparturesReportData'
  id: Scalars['ID']
  routeId: Scalars['String']
  dayType: Scalars['String']
  journeyStartTime: Scalars['String']
  journeyEndTime: Scalars['String']
  direction: Scalars['String']
  trackReason: TrackReason
  procurementUnitId: Scalars['String']
  journeyKilometers: Scalars['Float']
  blockNumber?: Maybe<Scalars['String']>
  date: Scalars['String']
}

export type SanctionSummaryReport = {
  __typename?: 'SanctionSummaryReport'
  filteredCount: Scalars['Int']
  totalCount: Scalars['Int']
  filters?: Maybe<Array<FilterConfig>>
  sort?: Maybe<Array<SortConfig>>
  responseId: Scalars['String']
  id: Scalars['String']
  name: Scalars['String']
  title: Scalars['String']
  description: Scalars['String']
  columnLabels: Scalars['String']
  seasonId: Scalars['String']
  operatorId: Scalars['Float']
  inspectionId: Scalars['String']
  showSanctioned?: Maybe<Scalars['Boolean']>
  showUnsanctioned?: Maybe<Scalars['Boolean']>
  rows: Array<SanctionSummaryReportData>
}

export type SanctionSummaryReportData = {
  __typename?: 'SanctionSummaryReportData'
  id: Scalars['ID']
  procurementUnitId: Scalars['String']
  areaName: Scalars['String']
  sanctionAmount: Scalars['Float']
  sanctionAmountRatio: Scalars['Float']
  sanctionedKilometers: Scalars['Float']
  averageAgeWeightedObserved: Scalars['Float']
  sanctionReason: SanctionReason
}

export enum SanctionReason {
  EquipmentTypeViolation = 'EQUIPMENT_TYPE_VIOLATION',
  EquipmentAgeViolation = 'EQUIPMENT_AGE_VIOLATION',
  EquipmentOptionAgeViolation = 'EQUIPMENT_OPTION_AGE_VIOLATION',
  EquipmentApprovedAgeViolation = 'EQUIPMENT_APPROVED_AGE_VIOLATION',
  ExteriorColorViolation = 'EXTERIOR_COLOR_VIOLATION',
  TimingStopViolation = 'TIMING_STOP_VIOLATION',
  LateDeparture = 'LATE_DEPARTURE',
  UnitEquipmentMaxAgeViolation = 'UNIT_EQUIPMENT_MAX_AGE_VIOLATION',
  EmissionClassDeficiency = 'EMISSION_CLASS_DEFICIENCY',
}

export type ProcurementUnitOption = {
  __typename?: 'ProcurementUnitOption'
  id: Scalars['String']
  name: Scalars['String']
  startDate: Scalars['BulttiDate']
  endDate: Scalars['BulttiDate']
  routes: Array<Scalars['String']>
  areaName?: Maybe<Scalars['String']>
  currentContracts?: Maybe<Array<Contract>>
  isUnselectingDisabled: Scalars['Boolean']
}

export type HfpDateStatus = {
  __typename?: 'HfpDateStatus'
  date: Scalars['BulttiDate']
  status: HfpStatus
}

export type SanctionsResponse = {
  __typename?: 'SanctionsResponse'
  filteredCount: Scalars['Int']
  totalCount: Scalars['Int']
  filters?: Maybe<Array<FilterConfig>>
  sort?: Maybe<Array<SortConfig>>
  responseId: Scalars['String']
  id: Scalars['String']
  rows: Array<Sanction>
  inspectionId: Scalars['String']
}

export type Sanction = {
  __typename?: 'Sanction'
  id: Scalars['ID']
  inspection: PostInspection
  inspectionId: Scalars['String']
  procurementUnitId?: Maybe<Scalars['String']>
  area?: Maybe<OperatingAreaName>
  sanctionableType: SanctionableEntity
  sanctionableValue?: Maybe<Scalars['String']>
  sanctionReason: SanctionReason
  entityIdentifier: Scalars['String']
  sanctionAmount: Scalars['Float']
  appliedSanctionAmount: Scalars['Float']
  sanctionableKilometers: Scalars['Float']
  sanctionResultKilometers?: Maybe<Scalars['Float']>
  matchesException?: Maybe<SanctionException>
}

export enum SanctionableEntity {
  Departure = 'DEPARTURE',
  EmissionClass = 'EMISSION_CLASS',
  Equipment = 'EQUIPMENT',
}

export type SanctionException = {
  __typename?: 'SanctionException'
  id: Scalars['ID']
  exceptionAppliesToReason: SanctionExceptionReason
  exceptionValue: Scalars['String']
  departureProperty: Scalars['String']
}

export enum SanctionExceptionReason {
  All = 'ALL',
  EquipmentTypeViolation = 'EQUIPMENT_TYPE_VIOLATION',
  EquipmentAgeViolation = 'EQUIPMENT_AGE_VIOLATION',
  EquipmentOptionAgeViolation = 'EQUIPMENT_OPTION_AGE_VIOLATION',
  EquipmentApprovedAgeViolation = 'EQUIPMENT_APPROVED_AGE_VIOLATION',
  ExteriorColorViolation = 'EXTERIOR_COLOR_VIOLATION',
  TimingStopViolation = 'TIMING_STOP_VIOLATION',
  LateDeparture = 'LATE_DEPARTURE',
}

export type Inspection = PreInspection | PostInspection

export type InspectionTimelineItem = {
  __typename?: 'InspectionTimelineItem'
  id: Scalars['ID']
  operatorName: Scalars['String']
  seasonId: Scalars['String']
  inspectionStartDate: Scalars['BulttiDate']
  inspectionEndDate: Scalars['BulttiDate']
  version: Scalars['Int']
}

export type Mutation = {
  __typename?: 'Mutation'
  createExecutionRequirementsForProcurementUnit?: Maybe<PlannedUnitExecutionRequirement>
  updateWeeklyExecutionMetersFromSource: PlannedUnitExecutionRequirement
  refreshExecutionRequirementForProcurementUnit?: Maybe<PlannedUnitExecutionRequirement>
  addEquipmentToExecutionRequirement?: Maybe<PlannedUnitExecutionRequirement>
  removeEquipmentFromExecutionRequirement: PlannedUnitExecutionRequirement
  removeAllEquipmentFromExecutionRequirement?: Maybe<PlannedUnitExecutionRequirement>
  removeUnitExecutionRequirement: Scalars['Boolean']
  updateProcurementUnit: ProcurementUnit
  updateEquipment?: Maybe<Equipment>
  createEquipmentCatalogue?: Maybe<EquipmentCatalogue>
  updateEquipmentCatalogue: EquipmentCatalogue
  addEquipmentToCatalogue?: Maybe<EquipmentCatalogue>
  batchAddToEquipmentCatalogue?: Maybe<EquipmentCatalogue>
  updateEquipmentInCatalogue: EquipmentCatalogue
  removeEquipmentFromCatalogue?: Maybe<EquipmentCatalogue>
  removeAllEquipmentFromCatalogue: EquipmentCatalogue
  removeEquipmentCatalogue: Scalars['Boolean']
  login?: Maybe<Scalars['String']>
  logout: Scalars['Boolean']
  modifyUser: User
  updateEquipmentCatalogueQuota?: Maybe<Equipment>
  createBlockDeparturesFromFile?: Maybe<Scalars['Boolean']>
  removeDepartureBlocksForDayTypes: Scalars['Boolean']
  updateEquipmentRequirementQuota?: Maybe<Equipment>
  initInspectionContractUnitMap: PreInspection
  generateEquipmentForPreInspection: Scalars['Boolean']
  toggleContractUserSubscribed?: Maybe<ContractUserRelation>
  createContract: Contract
  modifyContract: Contract
  removeContract: Scalars['Boolean']
  createObservedExecutionRequirementsFromPreInspectionRequirements: Array<ObservedExecutionRequirement>
  removeObservedExecutionRequirementsFromPreInspection: Scalars['Boolean']
  updateObservedExecutionRequirementValues: ObservedExecutionRequirement
  loadHfpDataForInspectionPeriod: InspectionDate
  createInspectionDate: InspectionDate
  removeInspectionDate: Scalars['Boolean']
  updateSanctions: Array<Sanction>
  clearCache: Scalars['Boolean']
  createTestData: Scalars['Boolean']
  generateTestBlockDepartures: Array<DepartureBlockFile>
  removeTestData: Scalars['Boolean']
  forceRemoveInspection: Scalars['Boolean']
  updateLinkedInspection: PostInspection
  inspectionSanctionable: PostInspection
  abandonSanctions: PostInspection
  createInspection?: Maybe<Inspection>
  updateInspection: Inspection
  submitInspection: Inspection
  publishInspection: Inspection
  rejectInspection: Inspection
  removeInspection: Scalars['Boolean']
  toggleInspectionUserSubscribed?: Maybe<InspectionUserRelation>
}

export type MutationCreateExecutionRequirementsForProcurementUnitArgs = {
  inspectionId: Scalars['String']
  procurementUnitId: Scalars['String']
}

export type MutationUpdateWeeklyExecutionMetersFromSourceArgs = {
  date: Scalars['String']
  executionRequirementId: Scalars['String']
}

export type MutationRefreshExecutionRequirementForProcurementUnitArgs = {
  executionRequirementId: Scalars['String']
}

export type MutationAddEquipmentToExecutionRequirementArgs = {
  executionRequirementId: Scalars['String']
  equipmentId: Scalars['String']
}

export type MutationRemoveEquipmentFromExecutionRequirementArgs = {
  executionRequirementId: Scalars['String']
  equipmentId: Scalars['String']
}

export type MutationRemoveAllEquipmentFromExecutionRequirementArgs = {
  executionRequirementId: Scalars['String']
}

export type MutationRemoveUnitExecutionRequirementArgs = {
  executionRequirementId: Scalars['String']
}

export type MutationUpdateProcurementUnitArgs = {
  procurementUnit: ProcurementUnitEditInput
  procurementUnitId: Scalars['String']
}

export type MutationUpdateEquipmentArgs = {
  equipmentId: Scalars['String']
}

export type MutationCreateEquipmentCatalogueArgs = {
  procurementUnitId: Scalars['String']
  operatorId: Scalars['Int']
  equipmentCatalogue: EquipmentCatalogueInput
}

export type MutationUpdateEquipmentCatalogueArgs = {
  equipmentCatalogue: EquipmentCatalogueInput
  catalogueId: Scalars['String']
}

export type MutationAddEquipmentToCatalogueArgs = {
  quota: Scalars['Float']
  catalogueId: Scalars['String']
  equipmentId: Scalars['String']
}

export type MutationBatchAddToEquipmentCatalogueArgs = {
  vehicleIds: Array<Scalars['String']>
  catalogueId: Scalars['String']
}

export type MutationUpdateEquipmentInCatalogueArgs = {
  catalogueId: Scalars['String']
}

export type MutationRemoveEquipmentFromCatalogueArgs = {
  catalogueId: Scalars['String']
  equipmentId: Scalars['String']
}

export type MutationRemoveAllEquipmentFromCatalogueArgs = {
  catalogueId: Scalars['String']
}

export type MutationRemoveEquipmentCatalogueArgs = {
  catalogueId: Scalars['String']
}

export type MutationLoginArgs = {
  role?: Maybe<Scalars['String']>
  isTest?: Maybe<Scalars['Boolean']>
  authorizationCode: Scalars['String']
}

export type MutationModifyUserArgs = {
  userInput: UserInput
}

export type MutationUpdateEquipmentCatalogueQuotaArgs = {
  quotaId?: Maybe<Scalars['String']>
  quota: Scalars['Float']
  equipmentId: Scalars['String']
}

export type MutationCreateBlockDeparturesFromFileArgs = {
  inspectionId: Scalars['String']
  dayTypes: Array<Scalars['String']>
  file?: Maybe<Scalars['Upload']>
}

export type MutationRemoveDepartureBlocksForDayTypesArgs = {
  inspectionId: Scalars['String']
  dayTypes: Array<Scalars['String']>
}

export type MutationUpdateEquipmentRequirementQuotaArgs = {
  quotaId?: Maybe<Scalars['String']>
  kilometers?: Maybe<Scalars['Float']>
  quota?: Maybe<Scalars['Float']>
  equipmentId: Scalars['String']
}

export type MutationInitInspectionContractUnitMapArgs = {
  inspectionId: Scalars['String']
}

export type MutationGenerateEquipmentForPreInspectionArgs = {
  inspectionId: Scalars['String']
}

export type MutationToggleContractUserSubscribedArgs = {
  userId: Scalars['String']
  contractId: Scalars['String']
}

export type MutationCreateContractArgs = {
  contractInput: ContractInput
  file: Scalars['Upload']
}

export type MutationModifyContractArgs = {
  operatorId: Scalars['Int']
  contractInput: ContractInput
  file?: Maybe<Scalars['Upload']>
}

export type MutationRemoveContractArgs = {
  operatorId: Scalars['Int']
  contractId: Scalars['String']
}

export type MutationCreateObservedExecutionRequirementsFromPreInspectionRequirementsArgs = {
  postInspectionId: Scalars['String']
}

export type MutationRemoveObservedExecutionRequirementsFromPreInspectionArgs = {
  postInspectionId: Scalars['String']
}

export type MutationUpdateObservedExecutionRequirementValuesArgs = {
  updateValues: Array<ObservedRequirementValueInput>
  requirementId: Scalars['String']
}

export type MutationLoadHfpDataForInspectionPeriodArgs = {
  inspectionDateId: Scalars['String']
}

export type MutationCreateInspectionDateArgs = {
  inspectionDate: InspectionDateInput
}

export type MutationRemoveInspectionDateArgs = {
  id: Scalars['String']
}

export type MutationUpdateSanctionsArgs = {
  sanctionUpdates: Array<SanctionUpdate>
}

export type MutationForceRemoveInspectionArgs = {
  testOnly?: Maybe<Scalars['Boolean']>
  inspectionId: Scalars['String']
}

export type MutationUpdateLinkedInspectionArgs = {
  inspectionId: Scalars['String']
}

export type MutationInspectionSanctionableArgs = {
  inspectionId: Scalars['String']
}

export type MutationAbandonSanctionsArgs = {
  inspectionId: Scalars['String']
}

export type MutationCreateInspectionArgs = {
  inspection: InitialInspectionInput
}

export type MutationUpdateInspectionArgs = {
  inspection: InspectionInput
  inspectionId: Scalars['String']
}

export type MutationSubmitInspectionArgs = {
  endDate: Scalars['BulttiDate']
  startDate: Scalars['BulttiDate']
  inspectionId: Scalars['String']
}

export type MutationPublishInspectionArgs = {
  inspectionId: Scalars['String']
}

export type MutationRejectInspectionArgs = {
  inspectionId: Scalars['String']
}

export type MutationRemoveInspectionArgs = {
  inspectionId: Scalars['String']
}

export type MutationToggleInspectionUserSubscribedArgs = {
  userId: Scalars['String']
  inspectionId: Scalars['String']
}

export type ProcurementUnitEditInput = {
  medianAgeRequirement: Scalars['Float']
}

export type EquipmentCatalogueInput = {
  startDate: Scalars['BulttiDate']
  endDate: Scalars['BulttiDate']
}

export type UserInput = {
  id: Scalars['ID']
  name?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
  role?: Maybe<UserRole>
  organisation?: Maybe<Scalars['String']>
  operatorIds?: Maybe<Scalars['String']>
}

export type ContractInput = {
  id?: Maybe<Scalars['ID']>
  description?: Maybe<Scalars['String']>
  operatorId?: Maybe<Scalars['Int']>
  startDate?: Maybe<Scalars['BulttiDate']>
  endDate?: Maybe<Scalars['BulttiDate']>
  procurementUnitIds?: Maybe<Array<Scalars['String']>>
  rulesFile?: Maybe<Scalars['String']>
}

export type ObservedRequirementValueInput = {
  id: Scalars['ID']
  emissionClass: Scalars['Int']
  kilometersRequired?: Maybe<Scalars['Float']>
  quotaRequired?: Maybe<Scalars['Float']>
  sanctionAmount?: Maybe<Scalars['Float']>
}

export type InspectionDateInput = {
  startDate: Scalars['BulttiDate']
  endDate: Scalars['BulttiDate']
}

export type SanctionUpdate = {
  sanctionId: Scalars['String']
  appliedSanctionAmount: Scalars['Float']
}

export type DepartureBlockFile = {
  __typename?: 'DepartureBlockFile'
  dayType: Scalars['String']
  operatorId: Scalars['Int']
  blockFile: Scalars['String']
}

export type InitialInspectionInput = {
  inspectionType: InspectionType
  name?: Maybe<Scalars['String']>
  startDate?: Maybe<Scalars['BulttiDate']>
  endDate?: Maybe<Scalars['BulttiDate']>
  inspectionDateId?: Maybe<Scalars['String']>
  inspectionStartDate?: Maybe<Scalars['BulttiDate']>
  inspectionEndDate?: Maybe<Scalars['BulttiDate']>
  operatorId: Scalars['Int']
  seasonId: Scalars['String']
}

export type InspectionInput = {
  inspectionType?: Maybe<InspectionType>
  name?: Maybe<Scalars['String']>
  startDate?: Maybe<Scalars['BulttiDate']>
  endDate?: Maybe<Scalars['BulttiDate']>
  inspectionDateId?: Maybe<Scalars['String']>
  inspectionStartDate?: Maybe<Scalars['BulttiDate']>
  inspectionEndDate?: Maybe<Scalars['BulttiDate']>
}

export type Subscription = {
  __typename?: 'Subscription'
  hfpPreloadStatus?: Maybe<Array<HfpDateStatus>>
  hfpLoadingProgress?: Maybe<HfpDateProgress>
  inspectionStatus?: Maybe<InspectionStatusUpdate>
  inspectionError?: Maybe<InspectionErrorUpdate>
}

export type SubscriptionHfpPreloadStatusArgs = {
  rangeEnd: Scalars['String']
  rangeStart: Scalars['String']
}

export type SubscriptionHfpLoadingProgressArgs = {
  rangeEnd: Scalars['String']
  rangeStart: Scalars['String']
}

export type SubscriptionInspectionStatusArgs = {
  inspectionId: Scalars['String']
}

export type SubscriptionInspectionErrorArgs = {
  inspectionId: Scalars['String']
}

export type HfpDateProgress = {
  __typename?: 'HfpDateProgress'
  date: Scalars['BulttiDate']
  progress: Scalars['Int']
}

export type InspectionStatusUpdate = {
  __typename?: 'InspectionStatusUpdate'
  id: Scalars['ID']
  status: InspectionStatus
  inspectionStartDate: Scalars['BulttiDate']
  inspectionEndDate: Scalars['BulttiDate']
  startDate?: Maybe<Scalars['BulttiDate']>
  endDate?: Maybe<Scalars['BulttiDate']>
  version: Scalars['Int']
}

export type InspectionErrorUpdate = {
  __typename?: 'InspectionErrorUpdate'
  id: Scalars['ID']
  status: InspectionStatus
  errorType: Scalars['String']
  message: Scalars['String']
}
