import {
  Equipment,
  EquipmentCatalogue,
  EquipmentCatalogueQuota,
  ExecutionRequirementQuota,
  PlannedUnitExecutionRequirement,
} from '../schema-types'
import { compact, groupBy, omit, trim } from 'lodash'
import { strval } from '../util/strval'
import { round } from '../util/round'
import { differenceInCalendarDays, parseISO } from 'date-fns'
import { getTotal } from '../util/getTotal'
import { useMutationData } from '../util/useMutationData'
import { removeAllEquipmentFromCatalogueMutation } from '../equipmentCatalogue/equipmentCatalogueQuery'
import {
  addBatchEquipmentMutation,
  addEquipmentToCatalogueMutation,
  addEquipmentToRequirementMutation,
} from './equipmentQuery'
import { useCallback } from 'react'
import { removeAllEquipmentFromExecutionRequirement } from '../executionRequirement/executionRequirementsQueries'
import Big from 'big.js'
import { isObjectLike } from '../util/isObjectLike'

export type EquipmentQuotaGroup = Omit<Equipment, 'vehicleId' | 'registryNr'> & {
  percentageQuota: number | string
  meterRequirement: number | string
  kilometerRequirement?: number | string
  amount: number
  age: number | string
}

export type EquipmentWithQuota = Equipment & {
  percentageQuota: number
  meterRequirement?: number
  kilometerRequirement?: number
  quotaId: string
  requirementOnly?: boolean
}

export function catalogueEquipment(catalogue?: EquipmentCatalogue): EquipmentWithQuota[] {
  if (!catalogue) {
    return []
  }

  let equipmentQuotas = (catalogue?.equipmentQuotas || []).map(
    (quota: EquipmentCatalogueQuota) => {
      if (!quota.equipment) {
        return null
      }

      return {
        ...quota?.equipment,
        percentageQuota: quota.percentageQuota || 0,
        quotaId: quota.id,
      }
    }
  )

  return compact(equipmentQuotas)
}

export function createRequirementEquipment(
  executionRequirement?: PlannedUnitExecutionRequirement
): EquipmentWithQuota[] {
  if (!executionRequirement) {
    return []
  }

  let equipmentQuotas = (executionRequirement?.equipmentQuotas || []).map(
    (quota: ExecutionRequirementQuota): EquipmentWithQuota | null => {
      if (!quota.equipment) {
        return null
      }

      // noinspection PointlessBooleanExpressionJS
      return {
        ...quota?.equipment,
        percentageQuota: quota.percentageQuota || 0,
        meterRequirement: quota.meterRequirement || 0,
        kilometerRequirement: (quota.meterRequirement || 0) / 1000,
        quotaId: quota.id,
        requirementOnly: !!quota.requirementOnly,
      }
    }
  )

  return compact(equipmentQuotas)
}

export function getEquipmentAge(equipmentRegistryDate: Date, compareDate: Date) {
  return round(differenceInCalendarDays(compareDate, equipmentRegistryDate) / 365)
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

    let kilometerRequirement = Big(meterRequirement).div(1000).toString()
    let age = getEquipmentAge(parseISO(equipmentGroup[0].registryDate), startDate)

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

function isCatalogue(item?: unknown): item is EquipmentCatalogue {
  return (
    isObjectLike(item) &&
    !!item &&
    typeof item?.equipmentQuotas !== 'undefined' &&
    typeof item?.requirements === 'undefined'
  )
}

function isRequirement(item?: unknown): item is PlannedUnitExecutionRequirement {
  return (
    isObjectLike(item) &&
    !!item &&
    typeof item?.equipmentQuotas !== 'undefined' &&
    typeof item?.requirements !== 'undefined'
  )
}

export function useEquipmentCrud(
  catalogueOrRequirement?: EquipmentCatalogue | PlannedUnitExecutionRequirement,
  onChanged: () => unknown = () => Promise.resolve()
) {
  let mode: 'catalogue' | 'requirement' | false = false

  if (isCatalogue(catalogueOrRequirement)) {
    mode = 'catalogue'
  } else if (isRequirement(catalogueOrRequirement)) {
    mode = 'requirement'
  }

  let [execRemoveAllRequirementEquipment] = useMutationData(
    removeAllEquipmentFromExecutionRequirement
  )

  let [execRemoveAllCatalogueEquipment] = useMutationData(
    removeAllEquipmentFromCatalogueMutation
  )

  let [execAddEquipmentToCatalogue] = useMutationData(addEquipmentToCatalogueMutation)
  let [execAddEquipmentToRequirement] = useMutationData(addEquipmentToRequirementMutation)

  let [execAddBatchEquipment] = useMutationData(addBatchEquipmentMutation)

  let removeAllEquipment = useCallback(async () => {
    if (!catalogueOrRequirement) {
      return
    }

    if (mode === 'catalogue') {
      await execRemoveAllCatalogueEquipment({
        variables: {
          catalogueId: catalogueOrRequirement.id,
        },
      })
    }

    if (mode === 'requirement') {
      await execRemoveAllRequirementEquipment({
        variables: {
          requirementId: catalogueOrRequirement.id,
        },
      })
    }

    await onChanged()
  }, [
    execRemoveAllRequirementEquipment,
    execRemoveAllCatalogueEquipment,
    catalogueOrRequirement,
    mode,
    onChanged,
  ])

  let addEquipment = useCallback(
    async (equipmentId: string, quota: number = 0) => {
      if (!catalogueOrRequirement || (mode === 'catalogue' && typeof quota === 'undefined')) {
        return
      }

      if (mode === 'catalogue') {
        await execAddEquipmentToCatalogue({
          variables: {
            equipmentId,
            quota,
            catalogueId: catalogueOrRequirement.id,
          },
        })
      } else if (mode === 'requirement') {
        await execAddEquipmentToRequirement({
          variables: {
            equipmentId,
            requirementId: catalogueOrRequirement.id,
          },
        })
      }

      await onChanged()
    },
    [
      onChanged,
      catalogueOrRequirement,
      mode,
      execAddEquipmentToCatalogue,
      execAddEquipmentToRequirement,
    ]
  )

  let addBatchEquipment = useCallback(
    async (batchInput: string) => {
      if (mode !== 'catalogue' || !batchInput) {
        return
      }

      let vehicleIds = (batchInput.split('\n') || [])
        .map((vehId) => trim(vehId))
        .filter((vehId) => !!vehId)

      await execAddBatchEquipment({
        variables: {
          catalogueId: catalogueOrRequirement?.id,
          vehicleIds,
        },
      })

      await onChanged()
    },
    [onChanged, execAddBatchEquipment, catalogueOrRequirement, mode]
  )

  return { removeAllEquipment, addEquipment, addBatchEquipment }
}
