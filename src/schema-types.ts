export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  BulttiDateTime: any,
  DateTime: any,
  Upload: any,
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

export type Departure = {
   __typename?: 'Departure',
  id: Scalars['ID'],
  blockNumber: Scalars['Int'],
  journeyStartTime: Scalars['String'],
  journeyEndTime: Scalars['String'],
  routeId?: Maybe<Scalars['String']>,
  direction?: Maybe<Scalars['String']>,
  departureBlocks: Array<DepartureBlock>,
};

export type DepartureBlock = {
   __typename?: 'DepartureBlock',
  id: Scalars['ID'],
  dayType: DayType,
  equipmentRegistryNumber: Scalars['String'],
  operator: Operator,
  equipment?: Maybe<Equipment>,
  preInspectionId: Scalars['String'],
  preInspection: PreInspection,
  departures: Array<Departure>,
};

export type DepartureBlockInput = {
  dayType: DayType,
  departures: Array<DepartureInput>,
};

export type DepartureInput = {
  departureTime: Scalars['String'],
  direction: Scalars['String'],
  routeId: Scalars['String'],
  vehicleId: Scalars['String'],
};

export type Equipment = {
   __typename?: 'Equipment',
  id: Scalars['ID'],
  vehicleId: Scalars['String'],
  operatorId: Scalars['Int'],
  uniqueVehicleId: Scalars['String'],
  operator: Operator,
  model: Scalars['String'],
  registryNr?: Maybe<Scalars['String']>,
  registryDate?: Maybe<Scalars['BulttiDateTime']>,
  type: Scalars['String'],
  exteriorColor: Scalars['String'],
  emissionClass: Scalars['Int'],
  equipmentCatalogueQuotas: Array<EquipmentCatalogueQuota>,
  departureBlocks: Array<DepartureBlock>,
};

export type EquipmentCatalogue = {
   __typename?: 'EquipmentCatalogue',
  id: Scalars['ID'],
  equipmentCatalogueId: Scalars['String'],
  operatorId: Scalars['Int'],
  operator: Operator,
  procurementUnitId: Scalars['String'],
  procurementUnit: ProcurementUnit,
  startDate: Scalars['BulttiDateTime'],
  endDate: Scalars['BulttiDateTime'],
  equipmentQuotas: Array<EquipmentCatalogueQuota>,
};

export type EquipmentCatalogueInput = {
  startDate: Scalars['BulttiDateTime'],
  endDate: Scalars['BulttiDateTime'],
};

export type EquipmentCatalogueQuota = {
   __typename?: 'EquipmentCatalogueQuota',
  id: Scalars['ID'],
  percentageQuota: Scalars['Float'],
  equipmentId: Scalars['String'],
  equipmentCatalogueId: Scalars['String'],
  equipment: Equipment,
  equipmentCatalogue: EquipmentCatalogue,
  catalogueStartDate: Scalars['BulttiDateTime'],
  catalogueEndDate: Scalars['BulttiDateTime'],
};

export type EquipmentCatalogueQuotaInput = {
  id?: Maybe<Scalars['ID']>,
  percentageQuota: Scalars['Float'],
  equipmentId: Scalars['String'],
  equipmentCatalogueId: Scalars['String'],
};

export type EquipmentInput = {
  percentageQuota?: Maybe<Scalars['Float']>,
  vehicleId?: Maybe<Scalars['String']>,
  model?: Maybe<Scalars['String']>,
  registryNr?: Maybe<Scalars['String']>,
  registryDate?: Maybe<Scalars['BulttiDateTime']>,
  type?: Maybe<Scalars['String']>,
  exteriorColor?: Maybe<Scalars['String']>,
  emissionClass?: Maybe<Scalars['Int']>,
};

export type EquipmentSearchResult = {
   __typename?: 'EquipmentSearchResult',
  vehicleId: Scalars['String'],
  model: Scalars['String'],
  registryNr?: Maybe<Scalars['String']>,
  registryDate?: Maybe<Scalars['BulttiDateTime']>,
  type: Scalars['String'],
  exteriorColor: Scalars['String'],
  emissionClass: Scalars['Int'],
  _exists: Scalars['Boolean'],
};

export type ExecutionRequirement = {
   __typename?: 'ExecutionRequirement',
  id: Scalars['ID'],
  requirements: Array<ExecutionRequirementValue>,
  operator: Operator,
  area: OperatingArea,
  preInspection: PreInspection,
};

export type ExecutionRequirementInput = {
  operatorId: Scalars['Int'],
  requirements: Array<ExecutionRequirementValueInput>,
};

export type ExecutionRequirementValue = {
   __typename?: 'ExecutionRequirementValue',
  id: Scalars['ID'],
  equipmentClass: Scalars['String'],
  quotaRequirement: Scalars['Float'],
  kilometerRequirement: Scalars['Float'],
  executionRequirement: ExecutionRequirement,
};

export type ExecutionRequirementValueInput = {
  equipmentClass: Scalars['String'],
  quotaRequirement: Scalars['Float'],
  kilometerRequirement: Scalars['Float'],
};

export type InitialPreInspectionInput = {
  operatorId: Scalars['Int'],
  seasonId: Scalars['String'],
  startDate?: Maybe<Scalars['BulttiDateTime']>,
  endDate?: Maybe<Scalars['BulttiDateTime']>,
  status?: Maybe<InspectionStatus>,
};

export enum InspectionStatus {
  Draft = 'Draft',
  InProduction = 'InProduction'
}

export type Mutation = {
   __typename?: 'Mutation',
  createPreInspection?: Maybe<PreInspection>,
  updatePreInspection: PreInspection,
  updateWeeklyMetersFromSource: ProcurementUnit,
  updateProcurementUnit: ProcurementUnit,
  createEquipment: Equipment,
  updateEquipment?: Maybe<Equipment>,
  createEquipmentCatalogue?: Maybe<EquipmentCatalogue>,
  updateEquipmentCatalogue: EquipmentCatalogue,
  populateCatalogueFromDepartures?: Maybe<EquipmentCatalogue>,
  removeAllEquipmentFromCatalogue: EquipmentCatalogue,
  createExecutionRequirement?: Maybe<ExecutionRequirement>,
  login?: Maybe<User>,
  logout: Scalars['Boolean'],
  removeEquipmentFromCatalogue: Scalars['Boolean'],
  createDepartureBlockFromFile?: Maybe<Array<DepartureBlock>>,
  removeDepartureBlocksForDayTypes: Scalars['Boolean'],
};


export type MutationCreatePreInspectionArgs = {
  preInspection: InitialPreInspectionInput
};


export type MutationUpdatePreInspectionArgs = {
  preInspection: PreInspectionInput,
  preInspectionId: Scalars['String']
};


export type MutationUpdateWeeklyMetersFromSourceArgs = {
  procurementUnitId: Scalars['String']
};


export type MutationUpdateProcurementUnitArgs = {
  procurementUnit: ProcurementUnitEditInput,
  procurementUnitId: Scalars['String']
};


export type MutationCreateEquipmentArgs = {
  catalogueId: Scalars['String'],
  operatorId: Scalars['Int'],
  equipment: EquipmentInput
};


export type MutationUpdateEquipmentArgs = {
  quotaId?: Maybe<Scalars['String']>,
  equipment: EquipmentInput,
  equipmentId: Scalars['String']
};


export type MutationCreateEquipmentCatalogueArgs = {
  procurementUnitId: Scalars['String'],
  operatorId: Scalars['Int'],
  equipmentCatalogue: EquipmentCatalogueInput
};


export type MutationUpdateEquipmentCatalogueArgs = {
  equipmentCatalogue: EquipmentCatalogueInput,
  catalogueId: Scalars['String']
};


export type MutationPopulateCatalogueFromDeparturesArgs = {
  preInspectionId: Scalars['String'],
  catalogueId: Scalars['String']
};


export type MutationRemoveAllEquipmentFromCatalogueArgs = {
  catalogueId: Scalars['String']
};


export type MutationCreateExecutionRequirementArgs = {
  executionRequirement: ExecutionRequirementInput
};


export type MutationLoginArgs = {
  isTest?: Maybe<Scalars['Boolean']>,
  redirectUri?: Maybe<Scalars['String']>,
  authorizationCode: Scalars['String']
};


export type MutationRemoveEquipmentFromCatalogueArgs = {
  catalogueId: Scalars['String'],
  equipmentId: Scalars['String']
};


export type MutationCreateDepartureBlockFromFileArgs = {
  preInspectionId: Scalars['String'],
  dayTypes: Array<DayType>,
  file?: Maybe<Scalars['Upload']>
};


export type MutationRemoveDepartureBlocksForDayTypesArgs = {
  preInspectionId: Scalars['String'],
  dayTypes: Array<DayType>
};

export type OperatingArea = {
   __typename?: 'OperatingArea',
  id: Scalars['Int'],
  name: OperatingAreaName,
  executionRequirements: Array<ExecutionRequirement>,
  procurementUnits: Array<ProcurementUnit>,
};

export enum OperatingAreaName {
  Center = 'CENTER',
  Other = 'OTHER'
}

export type Operator = {
   __typename?: 'Operator',
  id: Scalars['Int'],
  operatorId: Scalars['Int'],
  operatorName: Scalars['String'],
  preInspections: Array<PreInspection>,
  procurementUnits: Array<ProcurementUnit>,
  equipment: Array<Equipment>,
  equipmentCatalogues: Array<EquipmentCatalogue>,
  departureBlocks: Array<DepartureBlock>,
};

export type PreInspection = {
   __typename?: 'PreInspection',
  id: Scalars['ID'],
  operatorId?: Maybe<Scalars['Int']>,
  operator: Operator,
  season: Season,
  executionRequirements?: Maybe<Array<ExecutionRequirement>>,
  departureBlocks: Array<DepartureBlock>,
  startDate: Scalars['BulttiDateTime'],
  endDate: Scalars['BulttiDateTime'],
  status: InspectionStatus,
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  createdBy: User,
};

export type PreInspectionInput = {
  operatorId?: Maybe<Scalars['Int']>,
  seasonId?: Maybe<Scalars['String']>,
  startDate?: Maybe<Scalars['BulttiDateTime']>,
  endDate?: Maybe<Scalars['BulttiDateTime']>,
  status?: Maybe<InspectionStatus>,
};

export type ProcurementUnit = {
   __typename?: 'ProcurementUnit',
  id: Scalars['ID'],
  procurementUnitId: Scalars['String'],
  operatorId: Scalars['Int'],
  operator: Operator,
  equipmentCatalogues: Array<EquipmentCatalogue>,
  weeklyMeters: Scalars['Float'],
  weeklyKilometers: Scalars['Float'],
  medianAgeRequirement: Scalars['Float'],
  areaId: Scalars['Int'],
  area: OperatingArea,
  routes: Array<ProcurementUnitRoute>,
  startDate: Scalars['BulttiDateTime'],
  endDate: Scalars['BulttiDateTime'],
};

export type ProcurementUnitEditInput = {
  weeklyMeters: Scalars['Float'],
  medianAgeRequirement: Scalars['Float'],
};

export type ProcurementUnitInput = {
  id: Scalars['ID'],
  procurementUnitId: Scalars['ID'],
  operatorId: Scalars['Int'],
  area: Scalars['Int'],
  weeklyMeters: Scalars['Float'],
  routes?: Maybe<Array<ProcurementUnitRouteInput>>,
  startDate: Scalars['BulttiDateTime'],
  endDate: Scalars['BulttiDateTime'],
};

export type ProcurementUnitRoute = {
   __typename?: 'ProcurementUnitRoute',
  routeId: Scalars['String'],
  length: Scalars['Float'],
};

export type ProcurementUnitRouteInput = {
  routeId: Scalars['String'],
  length: Scalars['Float'],
};

export type Query = {
   __typename?: 'Query',
  operator?: Maybe<Operator>,
  operators: Array<Operator>,
  seasons: Array<Season>,
  preInspection?: Maybe<PreInspection>,
  preInspectionByOperatorAndSeason?: Maybe<PreInspection>,
  preInspections: Array<PreInspection>,
  procurementUnit?: Maybe<ProcurementUnit>,
  procurementUnitsByOperator: Array<ProcurementUnit>,
  singleEquipment?: Maybe<Equipment>,
  equipment: Array<Equipment>,
  equipmentByOperator: Array<Equipment>,
  queryEquipmentFromSource?: Maybe<EquipmentSearchResult>,
  singleEquipmentCatalogue?: Maybe<EquipmentCatalogue>,
  equipmentCatalogue: Array<EquipmentCatalogue>,
  equipmentCatalogueByOperator: Array<EquipmentCatalogue>,
  singleExecutionRequirement?: Maybe<ExecutionRequirement>,
  executionRequirement: Array<ExecutionRequirement>,
  executionRequirementsByOperator: Array<ExecutionRequirement>,
  executionRequirementsByPreInspection: Array<ExecutionRequirement>,
  user?: Maybe<User>,
  users: Array<User>,
  currentUser?: Maybe<User>,
  departureBlock?: Maybe<DepartureBlock>,
  departureBlocksForPreInspection: Array<DepartureBlock>,
};


export type QueryOperatorArgs = {
  operatorId: Scalars['Int']
};


export type QuerySeasonsArgs = {
  date: Scalars['BulttiDateTime']
};


export type QueryPreInspectionArgs = {
  preInspectionId: Scalars['String']
};


export type QueryPreInspectionByOperatorAndSeasonArgs = {
  seasonId: Scalars['String'],
  operatorId: Scalars['Int']
};


export type QueryProcurementUnitArgs = {
  procurementUnitId: Scalars['String']
};


export type QueryProcurementUnitsByOperatorArgs = {
  operatorId: Scalars['Int'],
  date: Scalars['BulttiDateTime']
};


export type QuerySingleEquipmentArgs = {
  equipmentId: Scalars['String']
};


export type QueryEquipmentByOperatorArgs = {
  operatorId: Scalars['Int']
};


export type QueryQueryEquipmentFromSourceArgs = {
  operatorId: Scalars['Int'],
  vehicleId: Scalars['String']
};


export type QuerySingleEquipmentCatalogueArgs = {
  equipmentCatalogueId: Scalars['String']
};


export type QueryEquipmentCatalogueByOperatorArgs = {
  operatorId: Scalars['Int']
};


export type QuerySingleExecutionRequirementArgs = {
  executionRequirementId: Scalars['String']
};


export type QueryExecutionRequirementsByOperatorArgs = {
  operatorId: Scalars['Int']
};


export type QueryExecutionRequirementsByPreInspectionArgs = {
  preInspectionId: Scalars['Int']
};


export type QueryUserArgs = {
  userId: Scalars['Int']
};


export type QueryDepartureBlockArgs = {
  departureBlockId: Scalars['String']
};


export type QueryDepartureBlocksForPreInspectionArgs = {
  preInspectionId: Scalars['String']
};

export type Season = {
   __typename?: 'Season',
  id: Scalars['ID'],
  season: Scalars['String'],
  startDate: Scalars['BulttiDateTime'],
  endDate: Scalars['BulttiDateTime'],
  preInspections: Array<PreInspection>,
};


export type User = {
   __typename?: 'User',
  id: Scalars['ID'],
  name: Scalars['String'],
  email: Scalars['String'],
  role: UserRole,
  organisation?: Maybe<Scalars['String']>,
  operatorIds?: Maybe<Array<Scalars['Int']>>,
  hslIdGroups?: Maybe<Array<Scalars['String']>>,
  preInspections: Array<PreInspection>,
};

export enum UserRole {
  Admin = 'ADMIN',
  HslUser = 'HSL_USER',
  OperatorUser = 'OPERATOR_USER',
  BlockedUser = 'BLOCKED_USER'
}
