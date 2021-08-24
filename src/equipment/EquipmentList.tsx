import React, { useCallback, useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { TableTextInput } from '../common/table/Table'
import { FlexRow } from '../common/components/common'
import ToggleButton from '../common/input/ToggleButton'
import { emissionClassNames } from '../type/values'
import { EquipmentQuotaGroup, EquipmentWithQuota, groupedEquipment } from './equipmentUtils'
import { groupBy } from 'lodash'
import { round } from '../util/round'
import { getTotal } from '../util/getTotal'
import EquipmentFormInput from './EquipmentFormInput'
import { text, Text } from '../util/translate'
import { undefinedOrNumber } from '../util/emptyOrNumber'
import PagedTable from '../common/table/PagedTable'
import { EditValue } from '../common/table/tableUtils'
import { averageByProp } from '../util/averageByProp'
import { DEFAULT_DECIMALS, DEFAULT_PERCENTAGE_DECIMALS } from '../constants'
import { ValueOf } from '../type/common'

export type EquipmentUpdate = {
  quota?: number
  kilometers?: number
  quotaId: string
}

export type PropTypes = {
  equipment: EquipmentWithQuota[]
  updateEquipment?: (equipmentUpdates: EquipmentUpdate[]) => Promise<unknown>
  removeEquipment?: (equipmentId: string) => Promise<unknown>
  startDate: Date
  columnLabels: { [key: string]: string }
  groupedColumnLabels: { [key: string]: string }
  editableValues?: (keyof EquipmentWithQuota)[]
  testId?: string
}

const getQuotaId = (item) => `${item.quotaId}_${item.id}`

const EquipmentList: React.FC<PropTypes> = observer(
  ({
    equipment,
    updateEquipment,
    removeEquipment,
    startDate,
    columnLabels,
    groupedColumnLabels,
    editableValues = [],
    testId,
  }) => {
    let [isEquipmentShownInGroup, setIsEquipmentShownInGroup] = useState(false)
    let [pendingValues, setPendingValues] = useState<EditValue<EquipmentWithQuota>[]>([])

    const onEditValue = useCallback(
      // EquipmentFormInput parses the value as float, so it will be a number type here.
      // Table props require it to be optional.
      (
        key: keyof EquipmentWithQuota,
        value: ValueOf<EquipmentWithQuota>,
        item: EquipmentWithQuota
      ) => {
        if (
          isEquipmentShownInGroup ||
          !editableValues.includes(key) ||
          typeof value === 'undefined' ||
          typeof item === 'undefined'
        ) {
          return
        }

        let validValue = !value && value !== 0 ? '' : Math.max(0, value as number)

        let itemId = getQuotaId(item)
        let editValue: EditValue<EquipmentWithQuota> = { key, value: validValue, item, itemId }

        setPendingValues((currentValues) => {
          let existingEditValueIndex = currentValues.findIndex(
            (val) => val.key === key && val.itemId === itemId
          )

          if (existingEditValueIndex !== -1) {
            currentValues.splice(existingEditValueIndex, 1)
          }

          return [...currentValues, editValue]
        })
      },
      [isEquipmentShownInGroup, editableValues]
    )

    const onCancelPendingValue = useCallback(() => {
      setPendingValues([])
    }, [])

    const onSavePendingValue = useCallback(async () => {
      if (pendingValues.length === 0 || !updateEquipment) {
        return
      }

      setPendingValues([])

      let pendingEquipmentInput = Object.entries(groupBy(pendingValues, 'itemId'))
      let updates: EquipmentUpdate[] = []

      for (let [, pendingEditValues] of pendingEquipmentInput) {
        let item = pendingEditValues[0].item

        let percentageQuota = pendingEditValues.find((val) => val.key === 'percentageQuota')
          ?.value

        let kilometerRequirement = pendingEditValues.find(
          (val) => val.key === 'kilometerRequirement'
        )?.value

        updates.push({
          quota: undefinedOrNumber(percentageQuota),
          kilometers: undefinedOrNumber(kilometerRequirement),
          quotaId: item.quotaId,
        })
      }

      await updateEquipment(updates)
    }, [updateEquipment, pendingValues])

    const onRemoveEquipment = useCallback(
      (item: EquipmentWithQuota) => {
        if (removeEquipment && confirm(text('catalogue_equipmentConfirmRemove'))) {
          removeEquipment(item.id)
        }
      },
      [removeEquipment]
    )

    const onToggleEquipmentGrouped = useCallback((checked: boolean) => {
      setIsEquipmentShownInGroup(checked)
    }, [])

    const equipmentGroups: EquipmentQuotaGroup[] = useMemo(
      () => groupedEquipment(equipment, startDate),
      [equipment, startDate]
    )

    const renderCellValue = useCallback((key, val) => {
      switch (key) {
        case 'percentageQuota':
          return round(val, DEFAULT_PERCENTAGE_DECIMALS) + '%'
        case 'meterRequirement':
          return round(val, DEFAULT_DECIMALS) + ' m'
        case 'kilometerRequirement':
          return round(val, DEFAULT_DECIMALS) + ' km'
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
            return round(getTotal(equipment, 'percentageQuota'), DEFAULT_DECIMALS) + '%'
          case 'kilometerRequirement':
            return round(getTotal(equipment, 'kilometerRequirement'), DEFAULT_DECIMALS) + ' km'
          default:
            return ''
        }
      },
      [equipment]
    )

    let renderGroupedColumnTotals = useCallback(
      (col) => {
        switch (col) {
          case 'amount':
            return round(getTotal(equipmentGroups, 'amount'), DEFAULT_DECIMALS) + ' kpl'
          case 'age':
            // Show the unweighted average in the total row
            return `${text('average')} ${averageByProp(equipmentGroups, 'age')}v`
          default:
            return ''
        }
      },
      [equipmentGroups]
    )

    let isEquipmentListEditable = !isEquipmentShownInGroup && equipment.length !== 0

    return equipment.length !== 0 ? (
      <>
        <FlexRow style={{ marginTop: '1rem', marginBottom: '1rem' }}>
          <ToggleButton
            name="grouped-equipment"
            value="grouped"
            checked={isEquipmentShownInGroup}
            onChange={onToggleEquipmentGrouped}>
            <Text>catalogue_showGrouped</Text>
          </ToggleButton>
        </FlexRow>
        {isEquipmentListEditable && (
          <PagedTable<EquipmentWithQuota>
            testId={`${testId}_equipment_list`}
            items={equipment}
            keyFromItem={getQuotaId}
            columnLabels={columnLabels}
            onRemoveRow={removeEquipment ? onRemoveEquipment : undefined}
            renderValue={renderCellValue}
            getColumnTotal={renderColumnTotals}
            onEditValue={updateEquipment ? onEditValue : undefined}
            pendingValues={pendingValues}
            onCancelEdit={onCancelPendingValue}
            onSaveEdit={updateEquipment ? onSavePendingValue : undefined}
            editableValues={editableValues}
            getRowHighlightColor={(itemRow) =>
              itemRow.item.requirementOnly ? 'var(--lightest-yellow)' : ''
            }
            renderInput={(key, val, onChange, item, onAccept, onCancel) => (
              <EquipmentFormInput
                fieldComponent={TableTextInput}
                value={val as string}
                valueName={key}
                onChange={onChange}
                onAccept={onAccept}
                onCancel={onCancel}
              />
            )}
          />
        )}
        {isEquipmentShownInGroup && (
          <PagedTable<EquipmentQuotaGroup>
            testId={`${testId}_equipment_list_grouped`}
            items={equipmentGroups}
            columnLabels={groupedColumnLabels}
            renderValue={renderCellValue}
            getColumnTotal={renderGroupedColumnTotals}
            editableValues={[]}
            onRemoveRow={() =>
              alert(text('catalogue_itemRemovalNotAllowedInGroupedListModeNotification'))
            }
          />
        )}
      </>
    ) : null
  }
)

export default EquipmentList
