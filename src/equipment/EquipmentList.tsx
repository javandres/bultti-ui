import React, { useCallback, useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite'
import Table from '../common/components/Table'
import { FlexRow } from '../common/components/common'
import ToggleButton from '../common/input/ToggleButton'
import { emissionClassNames } from '../type/values'
import { EquipmentQuotaGroup, EquipmentWithQuota, groupedEquipment } from './equipmentUtils'
import { orderBy, pick } from 'lodash'
import { EquipmentInput } from '../schema-types'
import { round } from '../util/round'
import { getTotal } from '../util/getTotal'
import { renderEquipmentInput } from './AddEquipment'

export type PropTypes = {
  equipment: EquipmentWithQuota[]
  updateEquipment?: (
    equipmentId: string,
    equipmentInput: EquipmentInput,
    quotaId: string
  ) => Promise<unknown>
  removeEquipment?: (equipmentId: string) => Promise<unknown>
  startDate: Date
  columnLabels: { [key: string]: string }
  groupedColumnLabels: { [key: string]: string }
  editableValues?: string[]
}

type PendingValType = string | number

type PendingEquipmentValue = {
  key: string
  value: PendingValType
  item: EquipmentWithQuota
}

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
    let [pendingValue, setPendingValue] = useState<PendingEquipmentValue | null>(null)

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
      if (!pendingValue || !updateEquipment) {
        return
      }

      setPendingValue(null)

      const equipmentInput: EquipmentInput = {
        ...(pick(pendingValue.item, [
          'percentageQuota',
          'meterRequirement',
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

      await updateEquipment(pendingValue.item.id, equipmentInput, pendingValue.item.quotaId)
    }, [updateEquipment, pendingValue])

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

    let orderedEquipment = useMemo(() => orderBy(equipment, 'emissionClass', 'desc'), [equipment])

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
          <Table
            items={orderedEquipment}
            columnLabels={columnLabels}
            onRemoveRow={removeEquipment ? onRemoveEquipment : undefined}
            renderValue={renderCellValue}
            getColumnTotal={renderColumnTotals}
            onEditValue={updateEquipment ? onEditValue : undefined}
            editValue={pendingValue}
            onCancelEdit={onCancelPendingValue}
            onSaveEdit={updateEquipment ? onSavePendingValue : undefined}
            editableValues={editableValues}
            renderInput={renderEquipmentInput}
          />
        )}
        {groupEquipment && (
          <Table
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
