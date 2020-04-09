import { EquipmentWithQuota } from './EquipmentCatalogue'
import { Equipment, EquipmentCatalogue } from '../schema-types'
import { groupBy, omit } from 'lodash'
import { strval } from '../util/strval'
import { round } from '../util/round'
import { differenceInCalendarDays, parseISO } from 'date-fns'
import { getTotal } from '../util/getTotal'

export type EquipmentQuotaGroup = Omit<Equipment, 'vehicleId' | 'registryNr'> & {
  percentageQuota: number
  offeredPercentageQuota: number
  meterRequirement: number
  kilometerRequirement?: number
  amount: number
  age: number
}

export function catalogueEquipment(catalogue?: EquipmentCatalogue): EquipmentWithQuota[] {
  if (!catalogue) {
    return []
  }

  return (catalogue?.equipmentQuotas || []).map((quota) => ({
    ...quota.equipment,
    percentageQuota: quota.percentageQuota || 0,
    offeredPercentageQuota: quota.offeredPercentageQuota || 0,
    meterRequirement: quota.meterRequirement || 0,
    kilometerRequirement: quota.meterRequirement / 1000,
    quotaId: quota.id,
  }))
}

export function groupedEquipment(
  equipment: EquipmentWithQuota[],
  startDate: Date
): EquipmentQuotaGroup[] {
  let grouped = groupBy(
    equipment,
    ({ model, emissionClass, type, registryDate }) =>
      model + strval(emissionClass) + type + strval(registryDate)
  )

  return Object.values(grouped).map((equipmentGroup) => {
    let percentageQuota = getTotal(equipmentGroup, 'percentageQuota')
    let offeredPercentageQuota = getTotal(equipmentGroup, 'offeredPercentageQuota')
    let meterRequirement = getTotal(equipmentGroup, 'meterRequirement')

    let kilometerRequirement = meterRequirement / 1000

    let age = round(
      differenceInCalendarDays(startDate, parseISO(equipmentGroup[0].registryDate)) / 365
    )

    return {
      ...omit(equipmentGroup[0], 'vehicleId', 'registryNr'),
      amount: equipmentGroup.length,
      age,
      percentageQuota,
      offeredPercentageQuota,
      meterRequirement,
      kilometerRequirement,
    }
  })
}
