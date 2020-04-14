import React, { useCallback, useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useMutationData } from '../util/useMutationData'
import { removeEquipmentMutation, updateEquipmentMutation } from './equipmentQuery'
import Table from '../common/components/Table'
import { FlexRow, MessageView, SmallHeading, SubSectionHeading } from '../common/components/common'
import { EquipmentWithQuota } from './EquipmentCatalogue'
import EditEquipment, { renderEquipmentInput } from './EditEquipment'
import ToggleButton from '../common/input/ToggleButton'
import { emissionClassNames } from '../type/values'
import { EquipmentQuotaGroup, groupedEquipment } from './equipmentUtils'
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
  offeredEditable: boolean
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

const CatalogueEquipment: React.FC<PropTypes> = observer(
  ({
    offeredEditable,
    showPreInspectionEquipment = false,
    equipment,
    catalogueId,
    operatorId,
    startDate,
    onEquipmentChanged,
  }) => {
    let [groupEquipment, setEquipmentGrouped] = useState(true)
    let [pendingValue, setPendingValue] = useState<PendingEquipmentValue | null>(null)
    let [removeEquipment] = useMutationData(removeEquipmentMutation)
    let [updateEquipment] = useMutationData(updateEquipmentMutation)

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

      await updateEquipment({
        variables: {
          equipmentId: pendingValue.item.id,
          quotaId: pendingValue.item.quotaId,
          equipmentInput,
        },
      })

      await onEquipmentChanged()
    }, [updateEquipment, pendingValue, onEquipmentChanged])

    // TODO: allow remove only on catalogue edit page, not pre-inspection.
    let canRemoveEquipment = useCallback((item: EquipmentWithQuota) => offeredEditable, [
      offeredEditable,
    ])

    const onRemoveEquipment = useCallback(
      async (item: EquipmentWithQuota) => {
        let canRemove = canRemoveEquipment(item)

        if (!canRemove || !item || !item.id) {
          return
        }

        await removeEquipment({
          variables: { equipmentId: item.id, catalogueId: catalogueId },
        })

        await onEquipmentChanged()
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

    // Create the table component for ungrouped offered or not offered equipment.
    let equipmentTable = (equipmentCollection: EquipmentWithQuota[], isOffered: boolean = true) => {
      // The table is editable only when the "offered equipment is editable" is true and
      // the table is showing offered equipment OR when offered equipment is NOT editable
      // and the table is showing NOT offered equipment.
      let isEditable = offeredEditable && isOffered

      return (
        <Table
          items={equipmentCollection}
          columnLabels={equipmentColumnLabels}
          onRemoveRow={isEditable ? (item) => () => onRemoveEquipment(item) : undefined}
          canRemoveRow={isEditable ? canRemoveEquipment : () => false}
          renderValue={renderCellValue}
          getColumnTotal={renderColumnTotals}
          onEditValue={isEditable ? onEditValue : undefined}
          editValue={isEditable ? pendingValue : null}
          onCancelEdit={isEditable ? onCancelPendingValue : undefined}
          onSaveEdit={isEditable ? onSavePendingValue : undefined}
          editableValues={isEditable ? editableValues : []}
          renderInput={renderEquipmentInput}
        />
      )
    }

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
            {!groupEquipment && orderedEquipment.length !== 0 && (
              <>
                <SmallHeading>Tarjottu kalusto</SmallHeading>
                {equipmentTable(orderedEquipment, true)}
              </>
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
        <EditEquipment
          operatorId={operatorId}
          catalogueId={catalogueId}
          equipment={equipment}
          onEquipmentChanged={onEquipmentChanged}
          offeredEditable={offeredEditable}
        />
      </>
    )
  }
)

export default CatalogueEquipment
