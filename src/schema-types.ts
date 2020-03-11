export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  DateTime: any,
};


export enum InspectionStatus {
  Draft = 'Draft',
  InProduction = 'InProduction'
}

export type Mutation = {
   __typename?: 'Mutation',
  createPreInspection?: Maybe<PreInspection>,
};


export type MutationCreatePreInspectionArgs = {
  preInspection: PreInspectionInput
};

export type OperatingArea = {
   __typename?: 'OperatingArea',
  id: Scalars['Int'],
  name: OperatingAreaName,
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
};

export type PreInspection = {
   __typename?: 'PreInspection',
  id: Scalars['ID'],
  operatorId?: Maybe<Scalars['Int']>,
  operator: Operator,
  season?: Maybe<Season>,
  startDate?: Maybe<Scalars['DateTime']>,
  endDate?: Maybe<Scalars['DateTime']>,
  productionStart?: Maybe<Scalars['DateTime']>,
  productionEnd?: Maybe<Scalars['DateTime']>,
  status: InspectionStatus,
  createdAt: Scalars['DateTime'],
  updatedDate: Scalars['DateTime'],
};

export type PreInspectionInput = {
  operatorId: Scalars['Int'],
};

export type ProcurementUnit = {
   __typename?: 'ProcurementUnit',
  id: Scalars['ID'],
  procurementUnitId: Scalars['String'],
  operatorId: Scalars['Int'],
  operator: Operator,
  weeklyMeters: Scalars['Float'],
  weeklyKilometers: Scalars['Float'],
  area: OperatingArea,
  routes?: Maybe<Array<ProcurementUnitRoute>>,
  startDate: Scalars['DateTime'],
  endDate: Scalars['DateTime'],
  operationStartDate: Scalars['DateTime'],
  operationEndDate: Scalars['DateTime'],
};

export type ProcurementUnitRoute = {
   __typename?: 'ProcurementUnitRoute',
  routeId: Scalars['String'],
  length: Scalars['Float'],
};

export type Query = {
   __typename?: 'Query',
  operator?: Maybe<Operator>,
  operators: Array<Operator>,
  seasons: Array<Season>,
  preInspection?: Maybe<PreInspection>,
  preInspections: Array<PreInspection>,
  procurementUnit?: Maybe<ProcurementUnit>,
  procurementUnitsForOperator: Array<ProcurementUnit>,
};


export type QueryOperatorArgs = {
  operatorId: Scalars['Int']
};


export type QuerySeasonsArgs = {
  date: Scalars['DateTime']
};


export type QueryPreInspectionArgs = {
  preInspectionId: Scalars['Int']
};


export type QueryProcurementUnitArgs = {
  procurementUnitId: Scalars['String']
};


export type QueryProcurementUnitsForOperatorArgs = {
  operatorId: Scalars['Int'],
  date: Scalars['DateTime']
};

export type Season = {
   __typename?: 'Season',
  id: Scalars['ID'],
  season: Scalars['Int'],
  startDate: Scalars['DateTime'],
  endDate: Scalars['DateTime'],
  preInspections: Array<PreInspection>,
};
