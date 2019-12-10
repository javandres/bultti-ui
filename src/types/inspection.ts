// O = from depot
// N = normal
// I = to depot
import { ExecutionRequirement } from '../inputs/WeeklyExecutionRequirements'

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
