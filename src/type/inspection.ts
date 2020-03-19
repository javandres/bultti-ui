// O = from depot
// N = normal
// I = to depot

import { OperatingArea } from '../schema-types'

export type DepartureType = 'O' | 'N' | 'I'

export enum DayType {
  Ma = 'Ma',
  Ti = 'Ti',
  Ke = 'Ke',
  To = 'To',
  Pe = 'Pe',
  La = 'La',
  Su = 'Su',
}

export interface DepartureBlock {
  id: string
  outDepot: string
  inDepot: string
  departureType: DepartureType
  routeId: string
  direction: string
  departureTime: string
  arrivalTime: string
  vehicleId: string
  dayType?: DayType
}

export interface ExecutionRequirement {
  week: number
  year: number
  equipmentClass: number
  requirement: string
  area: OperatingArea
}

export interface Inspection {
  id: string
  operatorId: number
  season: string
  startDate: string
  endDate: string
  productionStart: string
  productionEnd: string
  executionRequirements: ExecutionRequirement[]
  departureBlocks: DepartureBlock[]
  createdAt?: string
  createdBy?: string
}