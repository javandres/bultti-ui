import React, { useCallback, useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useMutationData } from '../util/useMutationData'
import {
  removeEquipmentMutation,
  updateEquipmentCatalogueQuotaMutation,
} from '../equipment/equipmentQuery'
import Table from '../common/components/Table'
import { FlexRow, MessageView, SmallHeading, SubSectionHeading } from '../common/components/common'
import { EquipmentWithQuota } from './EquipmentCatalogue'
import EditEquipment, { renderEquipmentInput } from '../equipment/EditEquipment'
import ToggleButton from '../common/input/ToggleButton'
import { emissionClassNames } from '../type/values'
import { EquipmentQuotaGroup, groupedEquipment } from '../equipment/equipmentUtils'
import { orderBy, pick } from 'lodash'
import { EquipmentInput } from '../schema-types'
import { round } from '../util/round'
import { getTotal } from '../util/getTotal'

export type PropTypes = {
  equipment: EquipmentWithQuota[]
  catalogueId: string
  operatorId: number
  startDate: Date
  onEquipmentChanged: () => Promise<void>
  equipmentEditable: boolean
  showPreInspectionEquipment: boolean
}

export const equipmentColumnLabels = {
  vehicleId: 'Kylkinumero',
  model: 'Malli',
  type: 'Tyyppi',
  percentageQuota: 'Tarjottu osuus',
  meterRequirement: 'Metriosuus',
  emissionClass: 'Euroluokka',
  registryNr: 'Rek.numero',
  registryDate: 'Rek.päivä',
}

export const groupedEquipmentColumnLabels = {
  model: 'Malli',
  type: 'Tyyppi',
  emissionClass: 'Euroluokka',
  registryDate: 'Rek.päivä',
  percentageQuota: 'Tarjottu osuus',
  amount: 'Määrä',
}

type PendingValType = string | number

type PendingEquipmentValue = {
  key: string
  value: PendingValType
  item: EquipmentWithQuota
}

const editableValues = ['percentageQuota']

const CatalogueEquipmentList: React.FC<PropTypes> = observer(
  ({ equipmentEditable, equipment, catalogueId, operatorId, startDate, onEquipmentChanged }) => {
    let [groupEquipment, setEquipmentGrouped] = useState(true)
    let [pendingValue, setPendingValue] = useState<PendingEquipmentValue | null>(null)
    let [removeEquipment] = useMutationData(removeEquipmentMutation)
    let [updateEquipmentQuota] = useMutationData(updateEquipmentCatalogueQuotaMutation)

    const onEditValue = useCallback(
      (key: string, value: PendingValType, item?: EquipmentWithQuota) => {
        if (groupEquipment || !editableValues.includes(key)) {
          return
        }

        setPendingValue((currentValue) => {
          if (currentValue && currentValue?.key === key) {
            return { ...currentValue, value }
          }

          if (item) {
            return { key, value, item }
          }

          return currentValue
        })
      },
      [groupEquipment, editableValues]
    )

    const onCancelPendingValue = useCallback(() => {
      setPendingValue(null)
    }, [])

    const onSavePendingValue = useCallback(async () => {
      if (!pendingValue) {
        return
      }

      setPendingValue(null)

      const equipmentInput: EquipmentInput = {
        ...(pick(pendingValue.item, [
          'percentageQuota',
          'vehicleId',
          'model',
          'registryNr',
          'registryDate',
          'type',
          'exteriorColor',
          'emissionClass',
        ]) as EquipmentInput),
        [pendingValue.key]: pendingValue.value,
      }

      await updateEquipmentQuota({
        variables: {
          equipmentId: pendingValue.item.id,
          quotaId: pendingValue.item.quotaId,
          equipmentInput,
        },
      })

      await onEquipmentChanged()
    }, [updateEquipmentQuota, pendingValue, onEquipmentChanged])

    let canRemoveEquipment = useCallback((item: EquipmentWithQuota) => equipmentEditable, [
      equipmentEditable,
    ])

    const onRemoveEquipment = useCallback(
      (item: EquipmentWithQuota) => {
        if (canRemoveEquipment(item)) {
          return async () => {
            let canRemove = canRemoveEquipment(item)

            if (!canRemove || !item || !item.id) {
              return
            }

            await removeEquipment({
              variables: { equipmentId: item.id, catalogueId: catalogueId },
            })

            await onEquipmentChanged()
          }
        }

        return undefined
      },
      [onEquipmentChanged, removeEquipment, canRemoveEquipment]
    )

    const onToggleEquipmentGrouped = useCallback((checked: boolean) => {
      setEquipmentGrouped(checked)
    }, [])

    const equipmentGroups: EquipmentQuotaGroup[] = useMemo(
      () => groupedEquipment(equipment, startDate),
      [equipment, startDate]
    )

    const renderCellValue = useCallback((key, val) => {
      switch (key) {
        case 'percentageQuota':
          return round(val) + '%'
        case 'meterRequirement':
          return round(val) + ' m'
        case 'kilometerRequirement':
          return round(val) + ' km'
        case 'emissionClass':
          return emissionClassNames[val + '']
        default:
          return val
      }
    }, [])

    const renderColumnTotals = useCallback(
      (col) => {
        switch (col) {
          case 'percentageQuota':
            return round(getTotal(equipment, 'percentageQuota')) + '%'
          case 'meterRequirement':
            return round(getTotal(equipment, 'meterRequirement')) + ' m'
          case 'kilometerRequirement':
            return round(getTotal(equipment, 'kilometerRequirement')) + ' km'
          case 'amount':
            return round(getTotal(equipmentGroups, 'amount')) + ' kpl'
          default:
            return ''
        }
      },
      [equipment, equipmentGroups]
    )

    let orderedEquipment = useMemo(() => orderBy(equipment, 'emissionClass', 'desc'), [equipment])

    return (
      <>
        {equipment.length !== 0 ? (
          <>
            <SubSectionHeading>Ajoneuvot</SubSectionHeading>
            <FlexRow style={{ marginBottom: '1rem' }}>
              <ToggleButton
                name="grouped-equipment"
                value="grouped"
                checked={groupEquipment}
                onChange={onToggleEquipmentGrouped}>
                Näytä ryhmissä
              </ToggleButton>
            </FlexRow>
            <SmallHeading>Tarjottu kalusto</SmallHeading>
            {!groupEquipment && orderedEquipment.length !== 0 && (
              <Table
                items={orderedEquipment}
                columnLabels={equipmentColumnLabels}
                onRemoveRow={onRemoveEquipment}
                canRemoveRow={canRemoveEquipment}
                renderValue={renderCellValue}
                getColumnTotal={renderColumnTotals}
                onEditValue={equipmentEditable ? onEditValue : undefined}
                editValue={equipmentEditable ? pendingValue : null}
                onCancelEdit={equipmentEditable ? onCancelPendingValue : undefined}
                onSaveEdit={equipmentEditable ? onSavePendingValue : undefined}
                editableValues={equipmentEditable ? editableValues : []}
                renderInput={renderEquipmentInput}
              />
            )}
            {groupEquipment && (
              <Table
                items={equipmentGroups}
                columnLabels={groupedEquipmentColumnLabels}
                renderValue={renderCellValue}
                getColumnTotal={renderColumnTotals}
                editableValues={[]}
              />
            )}
          </>
        ) : (
          <MessageView>Kalustoluettelossa ei ole ajoneuvoja.</MessageView>
        )}
        {equipmentEditable && (
          <EditEquipment
            operatorId={operatorId}
            catalogueId={catalogueId}
            equipment={equipment}
            onEquipmentChanged={onEquipmentChanged}
          />
        )}
      </>
    )
  }
)

export default CatalogueEquipmentList
