import { ProcurementUnit } from '../schema-types'

export function calculateMaximumAverageAge(
  procurementUnit: ProcurementUnit,
  referenceDate: string | Date
) {
  let optionsUsed = procurementUnit?.optionsUsed || 0
  let maximumAverageAge = procurementUnit?.maximumAverageAge || 0
  return maximumAverageAge + 0.5 * optionsUsed
}
