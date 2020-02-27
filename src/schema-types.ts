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
  outDepot: Scalars['String'],
  inDepot: Scalars['String'],
  departureType: DepartureType,
  routeId: Scalars['String'],
  direction: Scalars['String'],
  departureTime: Scalars['String'],
  arrivalTime: Scalars['String'],
  vehicleId: Scalars['String'],
  preInspectionId?: Maybe<Scalars['String']>,
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
  id?: Maybe<Scalars['ID']>,
  preInspectionId: Scalars['String'],
  area: OperatingArea,
  operatorId: Scalars['String'],
  operatingUnit: Scalars['String'],
  class: Scalars['Int'],
  brand: Scalars['String'],
  model: Scalars['String'],
  type: Scalars['String'],
  amount: Scalars['Int'],
  ratio: Scalars['Float'],
  seats: Scalars['Int'],
  emissionClass: Scalars['String'],
  soundLevel: Scalars['Int'],
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

export type Mutation = {
   __typename?: 'Mutation',
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
  routeIds?: Maybe<Array<Scalars['String']>>,
  startDate?: Maybe<Scalars['Date']>,
  endDate?: Maybe<Scalars['Date']>,
  operationStartDate?: Maybe<Scalars['Date']>,
  operationEndDate?: Maybe<Scalars['Date']>,
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
  operatorId: Scalars['String'],
  seasonId: Scalars['String'],
  season: Season,
  startDate: Scalars['String'],
  endDate: Scalars['String'],
  productionStart: Scalars['String'],
  productionEnd: Scalars['String'],
  executionRequirements: Array<ExecutionRequirement>,
  departureBlocks: Array<DepartureBlock>,
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
  year: Scalars['Int'],
  season: Scalars['String'],
  dateBegin: Scalars['String'],
  dateEnd: Scalars['String'],
};

export type SeasonInput = {
  id: Scalars['String'],
  year?: Maybe<Scalars['Int']>,
  season?: Maybe<Scalars['String']>,
  dateBegin?: Maybe<Scalars['String']>,
  dateEnd?: Maybe<Scalars['String']>,
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
