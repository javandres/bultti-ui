import { EquipmentWithQuota } from './EquipmentCatalogue'
import { Equipment, EquipmentCatalogue } from '../schema-types'
import { groupBy, omit } from 'lodash'
import { strval } from '../util/strval'
import { round } from '../util/round'
import { differenceInCalendarDays, parseISO } from 'date-fns'

export type EquipmentQuotaGroup = Omit<Equipment, 'vehicleId' | 'registryNr'> & {
  percentageQuota: number
  amount: number
  age: number
}

export function catalogueEquipment(catalogue?: EquipmentCatalogue): EquipmentWithQuota[] {
  if (!catalogue) {
    return []
  }

  return (catalogue?.equipmentQuotas || []).map((quota) => ({
    ...quota.equipment,
    percentageQuota: quota.percentageQuota,
    quotaId: quota.id
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
    let percentageQuota = equipmentGroup.reduce((total, item) => {
      total += item?.percentageQuota || 0
      return total
    }, 0)

    let age = round(
      differenceInCalendarDays(startDate, parseISO(equipmentGroup[0].registryDate)) / 365
    )

    return {
      ...omit(equipmentGroup[0], 'vehicleId', 'registryNr'),
      amount: equipmentGroup.length,
      age,
      percentageQuota,
    }
  })
}
