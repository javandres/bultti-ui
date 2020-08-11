import {
  Equipment,
  EquipmentCatalogue,
  EquipmentCatalogueQuota,
  EquipmentInput,
  ExecutionRequirement,
  ExecutionRequirementQuota,
} from '../schema-types'
import { compact, groupBy, omit, trim } from 'lodash'
import { strval } from '../util/strval'
import { round } from '../util/round'
import { differenceInCalendarDays, parseISO } from 'date-fns'
import { getTotal } from '../util/getTotal'
import { useMutationData } from '../util/useMutationData'
import { removeAllEquipmentFromCatalogueMutation } from '../equipmentCatalogue/equipmentCatalogueQuery'
import { addBatchEquipmentMutation, createEquipmentMutation } from './equipmentQuery'
import { useCallback } from 'react'
import { removeAllEquipmentFromExecutionRequirement } from '../executionRequirement/executionRequirementsQueries'

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

function isCatalogue(item?: any): item is EquipmentCatalogue {
  return (
    !!item &&
    typeof item?.equipmentQuotas !== 'undefined' &&
    typeof item?.requirements === 'undefined'
  )
}

function isRequirement(item?: any): item is ExecutionRequirement {
  return (
    !!item &&
    typeof item?.equipmentQuotas !== 'undefined' &&
    typeof item?.requirements !== 'undefined'
  )
}

export function useEquipmentCrud(
  catalogueOrRequirement?: EquipmentCatalogue | ExecutionRequirement,
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
  let [execCreateEquipment] = useMutationData(createEquipmentMutation)
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
    async (equipmentInput: EquipmentInput) => {
      let idProp =
        mode === 'catalogue'
          ? 'catalogueId'
          : mode === 'requirement'
          ? 'executionRequirementId'
          : false

      if (!catalogueOrRequirement || !idProp) {
        return
      }

      await execCreateEquipment({
        variables: {
          operatorId: catalogueOrRequirement.operator.id,
          equipmentInput,
          [idProp]: catalogueOrRequirement.id,
        },
      })

      await onChanged()
    },
    [onChanged, catalogueOrRequirement, mode, execCreateEquipment]
  )

  let addBatchEquipment = useCallback(
    async (batchInput: string) => {
      if (mode !== 'catalogue' || !batchInput) {
        return
      }

      let vehicleIds = batchInput
        .split('\n')
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
