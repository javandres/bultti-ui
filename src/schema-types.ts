export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  Date: any,
  Upload: any,
  DateTime: any,
};



export type DepartureBlock = {
   __typename?: 'DepartureBlock',
  id: Scalars['String'],
  routeId: Scalars['String'],
  variant?: Maybe<Scalars['String']>,
  direction: Scalars['String'],
  departureTime: Scalars['String'],
  vehicleId: Scalars['String'],
  preInspectionId: Scalars['String'],
  preInspection?: Maybe<PreInspection>,
  dayType?: Maybe<Scalars['String']>,
  blockFile: Scalars['String'],
};

export enum DepartureType {
  O = 'O',
  N = 'N',
  I = 'I'
}

export type Equipment = {
   __typename?: 'Equipment',
  id: Scalars['ID'],
  make?: Maybe<Scalars['String']>,
  model?: Maybe<Scalars['String']>,
  vehicleId?: Maybe<Scalars['String']>,
  registryNr?: Maybe<Scalars['String']>,
  type?: Maybe<Scalars['String']>,
  exteriorColor?: Maybe<Scalars['String']>,
  emissionClass?: Maybe<Scalars['String']>,
  co2?: Maybe<Scalars['Float']>,
  operatorId?: Maybe<Scalars['String']>,
  operator?: Maybe<Operator>,
  registryDate?: Maybe<Scalars['Date']>,
  percentageQuota?: Maybe<Scalars['Int']>,
  equipmentCatalogueId?: Maybe<Scalars['String']>,
  equipmentCatalogue?: Maybe<EquipmentCatalogue>,
};

export type EquipmentCatalogue = {
   __typename?: 'EquipmentCatalogue',
  id: Scalars['ID'],
  operatorId?: Maybe<Scalars['String']>,
  operator?: Maybe<Operator>,
  procurementUnitId?: Maybe<Scalars['String']>,
  procurementUnit?: Maybe<ProcurementUnit>,
  startDate?: Maybe<Scalars['Date']>,
  endDate?: Maybe<Scalars['Date']>,
  equipment: Array<Equipment>,
};

export type EquipmentCatalogueInput = {
  operatorId?: Maybe<Scalars['String']>,
  procurementUnitId?: Maybe<Scalars['String']>,
  startDate?: Maybe<Scalars['Date']>,
  endDate?: Maybe<Scalars['Date']>,
};

export type ExecutionRequirement = {
   __typename?: 'ExecutionRequirement',
  week: Scalars['Int'],
  year: Scalars['Int'],
  equipmentClass: Scalars['Int'],
  requirement: Scalars['String'],
  area: OperatingArea,
};

export type ExecutionRequirementInput = {
  week: Scalars['Int'],
  year: Scalars['Int'],
  equipmentClass: Scalars['Int'],
  requirement: Scalars['String'],
  area: OperatingArea,
};

export type File = {
   __typename?: 'File',
  filename: Scalars['String'],
  mimetype: Scalars['String'],
  encoding: Scalars['String'],
};

export enum InspectionStatus {
  Draft = 'DRAFT',
  InProduction = 'IN_PRODUCTION'
}

export type Mutation = {
   __typename?: 'Mutation',
  createPreInspection?: Maybe<PreInspection>,
  createEquipmentCatalogue?: Maybe<EquipmentCatalogue>,
  uploadDepartureBlocks?: Maybe<Array<DepartureBlock>>,
};


export type MutationCreateEquipmentCatalogueArgs = {
  catalogueData?: Maybe<EquipmentCatalogueInput>
};


export type MutationUploadDepartureBlocksArgs = {
  file?: Maybe<Scalars['Upload']>,
  inspectionId: Scalars['String']
};

export enum OperatingArea {
  Center = 'CENTER',
  Other = 'OTHER'
}

export type Operator = {
   __typename?: 'Operator',
  id: Scalars['String'],
  name?: Maybe<Scalars['String']>,
  equipment?: Maybe<Array<Equipment>>,
  equipmentCatalogues?: Maybe<Array<EquipmentCatalogue>>,
  procurementUnits?: Maybe<Array<ProcurementUnit>>,
};


export type OperatorProcurementUnitsArgs = {
  startDate?: Maybe<Scalars['Date']>
};

export type PreInspection = {
   __typename?: 'PreInspection',
  id: Scalars['String'],
  operatorId?: Maybe<Scalars['String']>,
  operator?: Maybe<Operator>,
  seasonId?: Maybe<Scalars['String']>,
  season?: Maybe<Season>,
  startDate?: Maybe<Scalars['String']>,
  endDate?: Maybe<Scalars['String']>,
  productionStart?: Maybe<Scalars['String']>,
  productionEnd?: Maybe<Scalars['String']>,
  executionRequirements?: Maybe<Array<ExecutionRequirement>>,
  departureBlocks?: Maybe<Array<DepartureBlock>>,
  status: InspectionStatus,
  createdAt: Scalars['String'],
  createdBy: Scalars['String'],
};

export type PreInspectionInput = {
  operatorId: Scalars['String'],
  season: SeasonInput,
  startDate: Scalars['String'],
  endDate: Scalars['String'],
  productionStart: Scalars['String'],
  productionEnd: Scalars['String'],
  executionRequirements: Array<ExecutionRequirementInput>,
};

export type ProcurementUnit = {
   __typename?: 'ProcurementUnit',
  id: Scalars['ID'],
  procurementUnitId: Scalars['String'],
  operatorId: Scalars['String'],
  operator?: Maybe<Operator>,
  equipmentCatalogues?: Maybe<Array<EquipmentCatalogue>>,
  routes?: Maybe<Array<Maybe<ProcurementUnitRoute>>>,
  operatingArea?: Maybe<OperatingArea>,
  startDate?: Maybe<Scalars['Date']>,
  endDate?: Maybe<Scalars['Date']>,
  operationStartDate?: Maybe<Scalars['Date']>,
  operationEndDate?: Maybe<Scalars['Date']>,
  weeklyExecutionMeters?: Maybe<Scalars['Int']>,
};

export type ProcurementUnitRoute = {
   __typename?: 'ProcurementUnitRoute',
  routeId: Scalars['String'],
  length?: Maybe<Scalars['Int']>,
};

export type Query = {
   __typename?: 'Query',
  equipment?: Maybe<Array<Equipment>>,
  equipmentCatalogues?: Maybe<Array<EquipmentCatalogue>>,
  equipmentCatalogue?: Maybe<EquipmentCatalogue>,
  operators?: Maybe<Array<Operator>>,
  operator?: Maybe<Operator>,
  procurementUnits?: Maybe<Array<ProcurementUnit>>,
  procurementUnit?: Maybe<ProcurementUnit>,
  routes?: Maybe<Array<Route>>,
  seasons?: Maybe<Array<Season>>,
  uploads?: Maybe<Array<Maybe<Scalars['String']>>>,
};


export type QueryEquipmentArgs = {
  equipmentCatalogueId?: Maybe<Scalars['String']>,
  operatorId?: Maybe<Scalars['String']>
};


export type QueryEquipmentCataloguesArgs = {
  operatorId?: Maybe<Scalars['String']>,
  procurementUnitId?: Maybe<Scalars['String']>
};


export type QueryEquipmentCatalogueArgs = {
  operatorId?: Maybe<Scalars['String']>,
  equipmentCatalogueId?: Maybe<Scalars['String']>
};


export type QueryOperatorArgs = {
  operatorId?: Maybe<Scalars['String']>
};


export type QueryProcurementUnitsArgs = {
  operatorId?: Maybe<Scalars['String']>,
  startDate?: Maybe<Scalars['Date']>
};


export type QueryProcurementUnitArgs = {
  operatorId?: Maybe<Scalars['String']>,
  procurementUnitId?: Maybe<Scalars['String']>,
  startDate?: Maybe<Scalars['Date']>
};


export type QuerySeasonsArgs = {
  date?: Maybe<Scalars['Date']>
};

export type Route = {
   __typename?: 'Route',
  id: Scalars['ID'],
  routeId: Scalars['String'],
  direction: Scalars['Int'],
  procurementUnitId?: Maybe<Scalars['String']>,
  procurementUnit?: Maybe<ProcurementUnit>,
  area: OperatingArea,
};

export type Season = {
   __typename?: 'Season',
  id: Scalars['String'],
  season: Scalars['String'],
  startDate: Scalars['Date'],
  endDate: Scalars['Date'],
};

export type SeasonInput = {
  id: Scalars['String'],
  season?: Maybe<Scalars['String']>,
  startDate?: Maybe<Scalars['Date']>,
  endDate?: Maybe<Scalars['Date']>,
};

