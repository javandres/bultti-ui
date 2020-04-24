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
  preInspection?: Maybe<PreInspection>;
  preInspectionsByOperator: Array<PreInspection>;
  currentPreInspectionsByOperatorAndSeason: Array<PreInspection>;
  currentPreInspectionByOperatorAndSeason: PreInspection;
  allPreInspections: Array<PreInspection>;
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
  departureBlock?: Maybe<DepartureBlock>;
  departureBlocksForPreInspection: Array<DepartureBlock>;
  availablePreInspectionReports: Array<ReportListItem>;
  preInspectionReportByName?: Maybe<Array<Report>>;
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


export type QueryPreInspectionArgs = {
  preInspectionId: Scalars['String'];
};


export type QueryPreInspectionsByOperatorArgs = {
  operatorId: Scalars['Int'];
};


export type QueryCurrentPreInspectionsByOperatorAndSeasonArgs = {
  seasonId: Scalars['String'];
  operatorId: Scalars['Int'];
};


export type QueryCurrentPreInspectionByOperatorAndSeasonArgs = {
  seasonId: Scalars['String'];
  operatorId: Scalars['Int'];
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
  preInspectionId: Scalars['String'];
  procurementUnitId: Scalars['String'];
};


export type QueryExecutionRequirementsForPreInspectionAreasArgs = {
  preInspectionId: Scalars['String'];
};


export type QueryUserArgs = {
  userId: Scalars['Int'];
};


export type QueryDepartureBlockArgs = {
  departureBlockId: Scalars['String'];
};


export type QueryDepartureBlocksForPreInspectionArgs = {
  preInspectionId: Scalars['String'];
};


export type QueryAvailablePreInspectionReportsArgs = {
  preInspectionId: Scalars['String'];
};


export type QueryPreInspectionReportByNameArgs = {
  preInspectionId: Scalars['String'];
  reportName: Scalars['String'];
};

export type Operator = {
   __typename?: 'Operator';
  id: Scalars['Int'];
  operatorId: Scalars['Int'];
  operatorName: Scalars['String'];
  preInspections: Array<PreInspection>;
  procurementUnits: Array<ProcurementUnit>;
  executionRequirements: Array<ExecutionRequirement>;
  equipment: Array<Equipment>;
  equipmentCatalogues: Array<EquipmentCatalogue>;
  departureBlocks: Array<DepartureBlock>;
};

export type PreInspection = {
   __typename?: 'PreInspection';
  version: Scalars['Int'];
  startDate: Scalars['BulttiDate'];
  endDate: Scalars['BulttiDate'];
  minStartDate?: Maybe<Scalars['BulttiDate']>;
  versionStackIdentifier?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  operatorId?: Maybe<Scalars['Int']>;
  operator: Operator;
  seasonId?: Maybe<Scalars['Int']>;
  season: Season;
  departureBlocks: Array<DepartureBlock>;
  executionRequirements: Array<ExecutionRequirement>;
  status: InspectionStatus;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  createdBy: User;
};


export type Season = {
   __typename?: 'Season';
  id: Scalars['ID'];
  season: Scalars['String'];
  startDate: Scalars['BulttiDate'];
  endDate: Scalars['BulttiDate'];
  preInspections: Array<PreInspection>;
};

export type DepartureBlock = {
   __typename?: 'DepartureBlock';
  id: Scalars['ID'];
  blockNumber: Scalars['Int'];
  dayType: DayType;
  equipmentRegistryNumber?: Maybe<Scalars['String']>;
  operator: Operator;
  equipment?: Maybe<Equipment>;
  preInspectionId: Scalars['String'];
  preInspection: PreInspection;
  departures: Array<Departure>;
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

export type Equipment = {
   __typename?: 'Equipment';
  id: Scalars['ID'];
  vehicleId: Scalars['String'];
  operatorId: Scalars['Int'];
  uniqueVehicleId: Scalars['String'];
  operator: Operator;
  model: Scalars['String'];
  registryNr?: Maybe<Scalars['String']>;
  registryDate?: Maybe<Scalars['BulttiDate']>;
  type: Scalars['String'];
  exteriorColor: Scalars['String'];
  hasInfoSystems: Scalars['Boolean'];
  emissionClass: Scalars['Int'];
  equipmentCatalogueQuotas: Array<EquipmentCatalogueQuota>;
  executionRequirementQuotas: Array<ExecutionRequirementQuota>;
  departureBlocks: Array<DepartureBlock>;
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
  areaId: Scalars['Int'];
  area: OperatingArea;
  routes: Array<ProcurementUnitRoute>;
  startDate: Scalars['BulttiDate'];
  endDate: Scalars['BulttiDate'];
  departures: Array<Departure>;
  executionRequirements: Array<ExecutionRequirement>;
};

export type OperatingArea = {
   __typename?: 'OperatingArea';
  id: Scalars['Int'];
  name: OperatingAreaName;
  procurementUnits: Array<ProcurementUnit>;
  executionRequirements: Array<ExecutionRequirement>;
};

export enum OperatingAreaName {
  Center = 'CENTER',
  Other = 'OTHER'
}

export type ExecutionRequirement = {
   __typename?: 'ExecutionRequirement';
  id: Scalars['ID'];
  area: OperatingArea;
  operator: Operator;
  preInspection: PreInspection;
  equipmentQuotas: Array<ExecutionRequirementQuota>;
  procurementUnit?: Maybe<ProcurementUnit>;
  areaRequirement?: Maybe<ExecutionRequirement>;
  procurementUnitRequirements?: Maybe<Array<ExecutionRequirement>>;
  totalKilometers?: Maybe<Scalars['Float']>;
  totalKilometersFulfilled?: Maybe<Scalars['Float']>;
  averageAgeWeighted?: Maybe<Scalars['Float']>;
  averageAgeWeightedFulfilled?: Maybe<Scalars['Float']>;
  requirements: Array<ExecutionRequirementValue>;
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

export type ProcurementUnitRoute = {
   __typename?: 'ProcurementUnitRoute';
  routeId: Scalars['String'];
  length: Scalars['Float'];
};

export type Departure = {
   __typename?: 'Departure';
  id: Scalars['ID'];
  blockNumber: Scalars['Int'];
  journeyStartTime: Scalars['String'];
  journeyEndTime: Scalars['String'];
  routeId?: Maybe<Scalars['String']>;
  direction?: Maybe<Scalars['String']>;
  routeLength?: Maybe<Scalars['Int']>;
  departureBlocks: Array<DepartureBlock>;
  procurementUnits: Array<ProcurementUnit>;
};

export enum InspectionStatus {
  Draft = 'Draft',
  InProduction = 'InProduction'
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
  preInspections: Array<PreInspection>;
};

export enum UserRole {
  Admin = 'ADMIN',
  HslUser = 'HSL_USER',
  OperatorUser = 'OPERATOR_USER',
  BlockedUser = 'BLOCKED_USER'
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

export type ReportListItem = {
   __typename?: 'ReportListItem';
  name: Scalars['String'];
  description: Scalars['String'];
  entity: Scalars['String'];
};

export type Report = {
   __typename?: 'Report';
  name: Scalars['String'];
  description: Scalars['String'];
  reportType: ReportType;
  reportEntities: Array<ReportEntityUnion>;
  season: Season;
  operator: Operator;
  preInspection?: Maybe<PreInspection>;
  postInspection?: Maybe<PostInspection>;
};

export enum ReportType {
  List = 'LIST',
  PairList = 'PAIR_LIST',
  Summary = 'SUMMARY',
  ExecutionRequirement = 'EXECUTION_REQUIREMENT'
}

export type ReportEntityUnion = Departure | Equipment | DeparturePair | ProcurementUnit | ExecutionRequirement;

export type DeparturePair = {
   __typename?: 'DeparturePair';
  departureA: Departure;
  departureB: Departure;
};

export type PostInspection = {
   __typename?: 'PostInspection';
  id: Scalars['ID'];
  status: InspectionStatus;
};

export type Mutation = {
   __typename?: 'Mutation';
  createPreInspection: PreInspection;
  updatePreInspection: PreInspection;
  publishPreInspection: PreInspection;
  removePreInspection: Scalars['Boolean'];
  generateEquipmentForPreInspection: Scalars['Boolean'];
  updateWeeklyMetersFromSource: ProcurementUnit;
  updateProcurementUnit: ProcurementUnit;
  createEquipment: Equipment;
  updateEquipment?: Maybe<Equipment>;
  updateEquipmentCatalogueQuota?: Maybe<Equipment>;
  updateEquipmentRequirementQuota?: Maybe<Equipment>;
  createEquipmentCatalogue?: Maybe<EquipmentCatalogue>;
  updateEquipmentCatalogue: EquipmentCatalogue;
  removeAllEquipmentFromCatalogue: EquipmentCatalogue;
  createExecutionRequirementsForPreInspection: Array<ExecutionRequirement>;
  createExecutionRequirementsForProcurementUnit?: Maybe<ExecutionRequirement>;
  refreshExecutionRequirementForProcurementUnit?: Maybe<ExecutionRequirement>;
  removeAllEquipmentFromExecutionRequirement: ExecutionRequirement;
  removeExecutionRequirement: Scalars['Boolean'];
  login?: Maybe<User>;
  logout: Scalars['Boolean'];
  removeEquipmentFromCatalogue: Scalars['Boolean'];
  createDepartureBlockFromFile?: Maybe<Array<DepartureBlock>>;
  removeDepartureBlocksForDayTypes: Scalars['Boolean'];
  removeEquipmentFromExecutionRequirement: Scalars['Boolean'];
};


export type MutationCreatePreInspectionArgs = {
  preInspection: InitialPreInspectionInput;
};


export type MutationUpdatePreInspectionArgs = {
  preInspection: PreInspectionInput;
  preInspectionId: Scalars['String'];
};


export type MutationPublishPreInspectionArgs = {
  preInspectionId: Scalars['String'];
};


export type MutationRemovePreInspectionArgs = {
  preInspectionId: Scalars['String'];
};


export type MutationGenerateEquipmentForPreInspectionArgs = {
  preInspectionId: Scalars['String'];
};


export type MutationUpdateWeeklyMetersFromSourceArgs = {
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


export type MutationCreateExecutionRequirementsForPreInspectionArgs = {
  preInspectionId: Scalars['String'];
};


export type MutationCreateExecutionRequirementsForProcurementUnitArgs = {
  preInspectionId: Scalars['String'];
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


export type MutationRemoveEquipmentFromCatalogueArgs = {
  catalogueId: Scalars['String'];
  equipmentId: Scalars['String'];
};


export type MutationCreateDepartureBlockFromFileArgs = {
  preInspectionId: Scalars['String'];
  dayTypes: Array<DayType>;
  file?: Maybe<Scalars['Upload']>;
};


export type MutationRemoveDepartureBlocksForDayTypesArgs = {
  preInspectionId: Scalars['String'];
  dayTypes: Array<DayType>;
};


export type MutationRemoveEquipmentFromExecutionRequirementArgs = {
  executionRequirementId: Scalars['String'];
  equipmentId: Scalars['String'];
};

export type InitialPreInspectionInput = {
  operatorId: Scalars['Int'];
  seasonId: Scalars['String'];
  startDate?: Maybe<Scalars['BulttiDate']>;
  endDate?: Maybe<Scalars['BulttiDate']>;
};

export type PreInspectionInput = {
  operatorId?: Maybe<Scalars['Int']>;
  seasonId?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['BulttiDate']>;
  endDate?: Maybe<Scalars['BulttiDate']>;
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


export type VersionedEntity = {
   __typename?: 'VersionedEntity';
  version: Scalars['Int'];
  startDate: Scalars['BulttiDate'];
  endDate: Scalars['BulttiDate'];
  minStartDate?: Maybe<Scalars['BulttiDate']>;
  versionStackIdentifier?: Maybe<Scalars['String']>;
};

export type ProcurementUnitRouteInput = {
  routeId: Scalars['String'];
  length: Scalars['Float'];
};

export type ProcurementUnitInput = {
  id: Scalars['ID'];
  procurementUnitId: Scalars['ID'];
  operatorId: Scalars['Int'];
  area: Scalars['Int'];
  weeklyMeters: Scalars['Float'];
  routes?: Maybe<Array<ProcurementUnitRouteInput>>;
  startDate: Scalars['BulttiDate'];
  endDate: Scalars['BulttiDate'];
};

export type EquipmentCatalogueQuotaInput = {
  id?: Maybe<Scalars['ID']>;
  offeredPercentageQuota?: Maybe<Scalars['Float']>;
  percentageQuota?: Maybe<Scalars['Float']>;
  equipmentId: Scalars['String'];
  equipmentCatalogueId: Scalars['String'];
};

export type DepartureInput = {
  departureTime: Scalars['String'];
  direction: Scalars['String'];
  routeId: Scalars['String'];
  vehicleId: Scalars['String'];
};

export type DepartureBlockInput = {
  dayType: DayType;
  departures: Array<DepartureInput>;
};

export type ExecutionRequirementQuotaInput = {
  id?: Maybe<Scalars['ID']>;
  percentageQuota?: Maybe<Scalars['Float']>;
  equipmentId: Scalars['String'];
  equipmentCatalogueId: Scalars['String'];
};
