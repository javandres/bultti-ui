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

export interface Inspection {
  operatorId: string
  season: string
  startDate: string
  endDate: string
  productionFrom: string
  departureBlocks?: DepartureBlocks
  createdAt: string
  createdBy: string
}
