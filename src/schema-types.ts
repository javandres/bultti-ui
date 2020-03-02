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

export type Contract = {
   __typename?: 'Contract',
  id: Scalars['ID'],
  operator?: Maybe<Array<Operator>>,
  routes?: Maybe<Array<Route>>,
  operatingUnits?: Maybe<Array<OperatingUnit>>,
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

export type ExecutionEquipment = {
   __typename?: 'ExecutionEquipment',
  id: Scalars['ID'],
  preInspectionId?: Maybe<Scalars['String']>,
  preInspection?: Maybe<PreInspection>,
  area?: Maybe<OperatingArea>,
  operatorId?: Maybe<Scalars['String']>,
  operatingUnit?: Maybe<Scalars['String']>,
  class?: Maybe<Scalars['Int']>,
  brand?: Maybe<Scalars['String']>,
  model?: Maybe<Scalars['String']>,
  type?: Maybe<Scalars['String']>,
  amount?: Maybe<Scalars['Int']>,
  ratio?: Maybe<Scalars['Float']>,
  seats?: Maybe<Scalars['Int']>,
  emissionClass?: Maybe<Scalars['String']>,
  soundLevel?: Maybe<Scalars['Int']>,
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
  uploadDepartureBlocks?: Maybe<Array<DepartureBlock>>,
  uploadEquipmentCatalogue?: Maybe<Array<ExecutionEquipment>>,
};


export type MutationUploadDepartureBlocksArgs = {
  file?: Maybe<Scalars['Upload']>,
  inspectionId: Scalars['String']
};


export type MutationUploadEquipmentCatalogueArgs = {
  file?: Maybe<Scalars['Upload']>,
  inspectionId: Scalars['String'],
  area: OperatingArea
};

export enum OperatingArea {
  Center = 'CENTER',
  Other = 'OTHER'
}

export type OperatingUnit = {
   __typename?: 'OperatingUnit',
  id: Scalars['ID'],
  operatorId: Scalars['String'],
  operator?: Maybe<Operator>,
  routes?: Maybe<Array<Maybe<OperatingUnitRoute>>>,
  operatingArea?: Maybe<OperatingArea>,
  startDate?: Maybe<Scalars['Date']>,
  endDate?: Maybe<Scalars['Date']>,
  operationStartDate?: Maybe<Scalars['Date']>,
  operationEndDate?: Maybe<Scalars['Date']>,
};

export type OperatingUnitRoute = {
   __typename?: 'OperatingUnitRoute',
  routeId: Scalars['String'],
  length?: Maybe<Scalars['Int']>,
};

export type Operator = {
   __typename?: 'Operator',
  id: Scalars['String'],
  name?: Maybe<Scalars['String']>,
  vehicles?: Maybe<Array<Vehicle>>,
  contracts?: Maybe<Array<Contract>>,
  operatingUnits?: Maybe<Array<OperatingUnit>>,
  routes?: Maybe<Array<Route>>,
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

export type Query = {
   __typename?: 'Query',
  vehicles?: Maybe<Array<Vehicle>>,
  operators?: Maybe<Array<Operator>>,
  operator?: Maybe<Operator>,
  contracts?: Maybe<Array<Contract>>,
  operatingUnits?: Maybe<Array<OperatingUnit>>,
  operatingUnit?: Maybe<OperatingUnit>,
  routes?: Maybe<Array<Route>>,
  seasons?: Maybe<Array<Season>>,
  uploads?: Maybe<Array<Maybe<Scalars['String']>>>,
};


export type QueryVehiclesArgs = {
  all?: Maybe<Scalars['Boolean']>
};


export type QueryOperatorArgs = {
  id?: Maybe<Scalars['String']>
};


export type QueryOperatingUnitsArgs = {
  operatorId: Scalars['String'],
  startDate: Scalars['Date']
};


export type QueryOperatingUnitArgs = {
  operatorId: Scalars['String'],
  operatingUnitId: Scalars['String'],
  startDate: Scalars['Date']
};


export type QuerySeasonsArgs = {
  date: Scalars['Date']
};

export type Route = {
   __typename?: 'Route',
  id: Scalars['ID'],
  routeId: Scalars['String'],
  direction: Scalars['Int'],
  operatingUnitId?: Maybe<Scalars['String']>,
  operatingUnit?: Maybe<OperatingUnit>,
  contractId?: Maybe<Scalars['String']>,
  contract?: Maybe<Contract>,
  area: OperatingArea,
  currentOperators?: Maybe<Array<Operator>>,
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


export type Vehicle = {
   __typename?: 'Vehicle',
  id: Scalars['ID'],
  vehicleId: Scalars['String'],
  registryNr: Scalars['String'],
  age: Scalars['Int'],
  type: Scalars['String'],
  exteriorColor: Scalars['String'],
  emissionDesc: Scalars['String'],
  emissionClass: Scalars['String'],
  routes?: Maybe<Array<Route>>,
  operatorId?: Maybe<Scalars['String']>,
  operator?: Maybe<Operator>,
};
