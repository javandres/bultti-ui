// O = from depot
// N = normal
// I = to depot
export type DepartureType = 'O' | 'N' | 'I'

export interface DepartureBlocks {
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
  departureBlocks?: DepartureBlocks
  createdAt?: string
  createdBy?: string
}
