import React, { useCallback, useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useMutationData } from '../util/useMutationData'
import { updateEquipmentRequirementQuotaMutation } from '../equipment/equipmentQuery'
import Table from '../common/components/Table'
import { FlexRow, MessageView, SmallHeading, SubSectionHeading } from '../common/components/common'
import EditEquipment, { renderEquipmentInput } from '../equipment/EditEquipment'
import ToggleButton from '../common/input/ToggleButton'
import { emissionClassNames } from '../type/values'
import {
  EquipmentQuotaGroup,
  EquipmentWithQuota,
  groupedEquipment,
} from '../equipment/equipmentUtils'
import { orderBy, pick } from 'lodash'
import { EquipmentInput, ExecutionRequirement } from '../schema-types'
import { round } from '../util/round'
import { getTotal } from '../util/getTotal'
import { removeRequirementEquipmentMutation } from './executionRequirementsQueries'

export type PropTypes = {
  equipment: EquipmentWithQuota[]
  executionRequirement: ExecutionRequirement
  startDate: Date
  onEquipmentChanged: () => Promise<void>
}

export const equipmentColumnLabels = {
  vehicleId: 'Kylkinumero',
  model: 'Malli',
  type: 'Tyyppi',
  percentageQuota: 'Osuus',
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
  percentageQuota: 'Osuus',
  kilometerRequirement: 'Kilometriosuus',
  amount: 'Määrä',
}

type PendingValType = string | number

type PendingEquipmentValue = {
  key: string
  value: PendingValType
  item: EquipmentWithQuota
}

const editableValues = ['percentageQuota', 'meterRequirement']

const RequirementEquipmentList: React.FC<PropTypes> = observer(
  ({ equipment, executionRequirement, startDate, onEquipmentChanged }) => {
    let [groupEquipment, setEquipmentGrouped] = useState(true)
    let [pendingValue, setPendingValue] = useState<PendingEquipmentValue | null>(null)
    let [removeEquipment] = useMutationData(removeRequirementEquipmentMutation)
    let [updateEquipmentQuota] = useMutationData(updateEquipmentRequirementQuotaMutation)

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

      await updateEquipmentQuota({
        variables: {
          equipmentId: pendingValue.item.id,
          quotaId: pendingValue.item.quotaId,
          equipmentInput,
        },
      })

      await onEquipmentChanged()
    }, [updateEquipmentQuota, pendingValue, onEquipmentChanged])

    const onRemoveEquipment = useCallback(
      (item: EquipmentWithQuota) => async () => {
        await removeEquipment({
          variables: {
            equipmentId: item.id,
            requirementId: executionRequirement.id,
          },
        })

        await onEquipmentChanged()
      },
      [onEquipmentChanged, removeEquipment]
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
            <FlexRow style={{ marginBottom: '1rem' }}>
              <ToggleButton
                name="grouped-equipment"
                value="grouped"
                checked={groupEquipment}
                onChange={onToggleEquipmentGrouped}>
                Näytä ryhmissä
              </ToggleButton>
            </FlexRow>
            <SmallHeading>Suoritevaatimuksen kalusto</SmallHeading>
            {!groupEquipment && orderedEquipment.length !== 0 && (
              <Table
                items={orderedEquipment}
                columnLabels={equipmentColumnLabels}
                onRemoveRow={onRemoveEquipment}
                renderValue={renderCellValue}
                getColumnTotal={renderColumnTotals}
                onEditValue={onEditValue}
                editValue={pendingValue}
                onCancelEdit={onCancelPendingValue}
                onSaveEdit={onSavePendingValue}
                editableValues={editableValues}
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
          <MessageView>Suoritevaatimukseen ei ole liitetty ajoneuvoja.</MessageView>
        )}
        <EditEquipment
          operatorId={executionRequirement.operator.id}
          executionRequirementId={executionRequirement.id}
          equipment={equipment}
          onEquipmentChanged={onEquipmentChanged}
        />
      </>
    )
  }
)

export default RequirementEquipmentList
