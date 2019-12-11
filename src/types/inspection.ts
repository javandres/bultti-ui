// O = from depot
// N = normal
// I = to depot

import { OperatingArea } from '../schema-types'

export type DepartureType = 'O' | 'N' | 'I'

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
}

export interface Season {
  name: string
  year: number
  season: string
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
  operatorId: string
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
