import {
  Equipment,
  EquipmentCatalogue,
  EquipmentCatalogueQuota,
  ExecutionRequirement,
  ExecutionRequirementQuota,
} from '../schema-types'
import { compact, groupBy, omit } from 'lodash'
import { strval } from '../util/strval'
import { round } from '../util/round'
import { differenceInCalendarDays, parseISO } from 'date-fns'
import { getTotal } from '../util/getTotal'

export type EquipmentQuotaGroup = Omit<Equipment, 'vehicleId' | 'registryNr'> & {
  percentageQuota: number
  meterRequirement: number
  kilometerRequirement?: number
  amount: number
  age: number
}

export type EquipmentWithQuota = Equipment & {
  percentageQuota: number
  meterRequirement?: number
  kilometerRequirement?: number
  quotaId: string
}

export function catalogueEquipment(catalogue?: EquipmentCatalogue): EquipmentWithQuota[] {
  if (!catalogue) {
    return []
  }

  let equipmentQuotas = (catalogue?.equipmentQuotas || []).map((quota: EquipmentCatalogueQuota) => {
    if (!quota.equipment) {
      return null
    }

    return {
      ...quota?.equipment,
      percentageQuota: quota.percentageQuota || 0,
      quotaId: quota.id,
    }
  })

  return compact(equipmentQuotas)
}

export function requirementEquipment(
  executionRequirement?: ExecutionRequirement
): EquipmentWithQuota[] {
  if (!executionRequirement) {
    return []
  }

  let equipmentQuotas = (executionRequirement?.equipmentQuotas || []).map(
    (quota: ExecutionRequirementQuota) => {
      if (!quota.equipment) {
        return null
      }

      return {
        ...quota?.equipment,
        percentageQuota: quota.percentageQuota || 0,
        meterRequirement: quota.meterRequirement || 0,
        kilometerRequirement: (quota.meterRequirement || 0) / 1000,
        quotaId: quota.id,
      }
    }
  )

  return compact(equipmentQuotas)
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
      meterRequirement,
      kilometerRequirement,
    }
  })
}
