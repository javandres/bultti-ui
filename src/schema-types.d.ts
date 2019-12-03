export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  /** The `Upload` scalar type represents a file upload. */
  Upload: any,
};


export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}

export type Contract = {
   __typename?: 'Contract',
  id: Scalars['ID'],
  operator?: Maybe<Array<Operator>>,
  routes?: Maybe<Array<Route>>,
  operatingUnits?: Maybe<Array<OperatingUnit>>,
};

export enum OperatingArea {
  Center = 'CENTER',
  Other = 'OTHER'
}

export type OperatingUnit = {
   __typename?: 'OperatingUnit',
  id: Scalars['ID'],
  currentOperators?: Maybe<Array<Operator>>,
  routes?: Maybe<Array<Route>>,
  contractId?: Maybe<Scalars['String']>,
  contract?: Maybe<Contract>,
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

export type Query = {
   __typename?: 'Query',
  vehicles?: Maybe<Array<Vehicle>>,
  operators?: Maybe<Array<Operator>>,
  contracts?: Maybe<Array<Contract>>,
  operatingUnits?: Maybe<Array<OperatingUnit>>,
  routes?: Maybe<Array<Route>>,
};


export type QueryVehiclesArgs = {
  all?: Maybe<Scalars['Boolean']>
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
