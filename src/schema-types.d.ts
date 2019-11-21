export type Maybe<T> = T | null
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** The `Upload` scalar type represents a file upload. */
  Upload: any
}

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE',
}

export type Contract = {
  __typename?: 'Contract'
  id: Scalars['ID']
  targets?: Maybe<Array<Scalars['String']>>
  operatorId: Scalars['String']
  operatorName?: Maybe<Scalars['String']>
  routes?: Maybe<Array<Route>>
  subjects?: Maybe<Array<ContractObject>>
}

export type ContractObject = {
  __typename?: 'ContractObject'
  id: Scalars['ID']
  currentOperators?: Maybe<Array<Operator>>
  routes?: Maybe<Array<Route>>
  contract: Contract
}

export enum OperatingArea {
  Center = 'CENTER',
  OutsideCenter = 'OUTSIDE_CENTER',
}

export type Operator = {
  __typename?: 'Operator'
  operatorId: Scalars['String']
  operatorName?: Maybe<Scalars['String']>
  vehicles?: Maybe<Array<Vehicle>>
  contracts?: Maybe<Array<Contract>>
  subjects?: Maybe<Array<ContractObject>>
  routes?: Maybe<Array<Route>>
}

export type Query = {
  __typename?: 'Query'
  vehicles?: Maybe<Array<Vehicle>>
  operators?: Maybe<Array<Operator>>
  contracts?: Maybe<Array<Contract>>
  contractObjects?: Maybe<Array<ContractObject>>
  routes?: Maybe<Array<Route>>
}

export type QueryVehiclesArgs = {
  all?: Maybe<Scalars['Boolean']>
}

export type Route = {
  __typename?: 'Route'
  id: Scalars['ID']
  routeId: Scalars['String']
  direction: Scalars['Int']
  contractObject: ContractObject
  contract: Contract
  area: OperatingArea
  currentOperators?: Maybe<Array<Operator>>
}

export type Vehicle = {
  __typename?: 'Vehicle'
  id: Scalars['ID']
  vehicleId: Scalars['String']
  registryNr: Scalars['String']
  age: Scalars['Int']
  type: Scalars['String']
  exteriorColor: Scalars['String']
  emissionDesc: Scalars['String']
  emissionClass: Scalars['String']
  routes?: Maybe<Array<Route>>
  operator: Operator
}
