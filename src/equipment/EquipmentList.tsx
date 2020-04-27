import React, { useCallback, useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite'
import Table, { EditValue, CellValType, TableInput } from '../common/components/Table'
import { FlexRow } from '../common/components/common'
import ToggleButton from '../common/input/ToggleButton'
import { emissionClassNames } from '../type/values'
import { EquipmentQuotaGroup, EquipmentWithQuota, groupedEquipment } from './equipmentUtils'
import { groupBy, orderBy } from 'lodash'
import { EquipmentInput } from '../schema-types'
import { round } from '../util/round'
import { getTotal } from '../util/getTotal'
import { createEquipmentFormInput } from './EquipmentFormInput'

export type EquipmentUpdate = {
  equipmentId: string
  equipmentInput: EquipmentInput
  quotaId: string
}

export type PropTypes = {
  equipment: EquipmentWithQuota[]
  updateEquipment?: (equipmentUpdates: EquipmentUpdate[]) => Promise<unknown>
  removeEquipment?: (equipmentId: string) => Promise<unknown>
  startDate: Date
  columnLabels: { [key: string]: string }
  groupedColumnLabels: { [key: string]: string }
  editableValues?: string[]
}

const renderEquipmentInput = createEquipmentFormInput(TableInput)

const EquipmentList: React.FC<PropTypes> = observer(
  ({
    equipment,
    updateEquipment,
    removeEquipment,
    startDate,
    columnLabels,
    groupedColumnLabels,
    editableValues = [],
  }) => {
    let [groupEquipment, setEquipmentGrouped] = useState(true)
    let [pendingValues, setPendingValues] = useState<EditValue<EquipmentWithQuota>[]>([])

    const onEditValue = useCallback(
      (key: string, value: CellValType, item: EquipmentWithQuota) => {
        if (groupEquipment || !editableValues.includes(key)) {
          return
        }

        let editValue = { key, value, item }

        setPendingValues((currentValues) => {
          let existingEditValueIndex = currentValues.findIndex(
            (val) => val.key === key && val.item.id === item.id
          )

          if (existingEditValueIndex !== -1) {
            currentValues.splice(existingEditValueIndex, 1)
          }

          return [...currentValues, editValue]
        })
      },
      [groupEquipment, editableValues]
    )

    const onCancelPendingValue = useCallback(() => {
      setPendingValues([])
    }, [])

    const onSavePendingValue = useCallback(async () => {
      if (pendingValues.length === 0 || !updateEquipment) {
        return
      }

      setPendingValues([])

      let pendingEquipmentInput = Object.entries(groupBy(pendingValues, 'item.id'))
      let updates: EquipmentUpdate[] = []

      for (let [itemId, pendingEditValues] of pendingEquipmentInput) {
        let updatedValues = {}
        let item = pendingEditValues[0].item

        for (let val of pendingEditValues) {
          updatedValues[val.key] = val.value
        }

        updates.push({
          equipmentId: itemId,
          equipmentInput: updatedValues,
          quotaId: item.quotaId,
        })
      }

      await updateEquipment(updates)
    }, [updateEquipment, pendingValues])

    const onRemoveEquipment = useCallback(
      (item: EquipmentWithQuota) => () => {
        if (removeEquipment) {
          removeEquipment(item.id)
        }
      },
      [removeEquipment]
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

    let orderedEquipment = useMemo(() => orderBy(equipment, 'emissionClass', 'desc'), [
      equipment,
    ])

    return equipment.length !== 0 ? (
      <>
        <FlexRow style={{ marginTop: '1rem', marginBottom: '1rem' }}>
          <ToggleButton
            name="grouped-equipment"
            value="grouped"
            checked={groupEquipment}
            onChange={onToggleEquipmentGrouped}>
            Näytä ryhmissä
          </ToggleButton>
        </FlexRow>
        {!groupEquipment && orderedEquipment.length !== 0 && (
          <Table<EquipmentWithQuota>
            items={orderedEquipment}
            columnLabels={columnLabels}
            onRemoveRow={removeEquipment ? onRemoveEquipment : undefined}
            renderValue={renderCellValue}
            getColumnTotal={renderColumnTotals}
            onEditValue={updateEquipment ? onEditValue : undefined}
            pendingValues={pendingValues}
            onCancelEdit={onCancelPendingValue}
            onSaveEdit={updateEquipment ? onSavePendingValue : undefined}
            editableValues={editableValues}
            renderInput={renderEquipmentInput}
          />
        )}
        {groupEquipment && (
          <Table<EquipmentQuotaGroup>
            items={equipmentGroups}
            columnLabels={groupedColumnLabels}
            renderValue={renderCellValue}
            getColumnTotal={renderColumnTotals}
            editableValues={[]}
          />
        )}
      </>
    ) : null
  }
)

export default EquipmentList
