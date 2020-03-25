import React, { useCallback, useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useMutationData } from '../util/useMutationData'
import { removeEquipmentMutation, updateEquipmentMutation } from './equipmentQuery'
import Table from '../common/components/Table'
import { FlexRow, MessageView, SubSectionHeading } from '../common/components/common'
import { EquipmentWithQuota } from './EquipmentCatalogue'
import EditEquipment, { renderEquipmentInput } from './EditEquipment'
import ToggleButton from '../common/input/ToggleButton'
import { emissionClassNames } from '../type/values'
import { EquipmentQuotaGroup, groupedEquipment } from './equipmentUtils'
import { pick } from 'lodash'
import { EquipmentInput } from '../schema-types'

export type PropTypes = {
  equipment: EquipmentWithQuota[]
  catalogueId: string
  operatorId: number
  startDate: Date
  onEquipmentChanged: () => Promise<void>
}

export const equipmentColumnLabels = {
  vehicleId: 'Kylkinumero',
  model: 'Malli',
  type: 'Tyyppi',
  percentageQuota: 'Osuus',
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
  amount: 'Määrä',
}

type PendingValType = string | number

type PendingEquipmentValue = {
  key: string
  value: PendingValType
  item: EquipmentWithQuota
}

const CatalogueEquipment: React.FC<PropTypes> = observer(
  ({ equipment, catalogueId, operatorId, startDate, onEquipmentChanged }) => {
    let [groupEquipment, setEquipmentGrouped] = useState(true)
    let [pendingValue, setPendingValue] = useState<PendingEquipmentValue | null>(null)
    let [removeEquipment] = useMutationData(removeEquipmentMutation)
    let [updateEquipment] = useMutationData(updateEquipmentMutation)

    const onEditValue = useCallback(
      (key: string, value: PendingValType, item?: EquipmentWithQuota) => {
        if (groupEquipment || key !== 'percentageQuota') {
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
      [groupEquipment]
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

    const onRemoveEquipment = useCallback(
      async (item) => {
        if (!item || !item.id) {
          return
        }

        await removeEquipment({
          variables: { equipmentId: item.id, catalogueId: catalogueId },
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
          return val + '%'
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
            return (
              equipment.reduce((total, item) => {
                total += item?.percentageQuota || 0
                return total
              }, 0) + '%'
            )
          case 'amount':
            return (
              equipmentGroups.reduce((total, item) => {
                total += item?.amount || 0
                return total
              }, 0) + ' kpl'
            )
          default:
            return ''
        }
      },
      [equipment, equipmentGroups]
    )

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
            <Table
              items={groupEquipment ? equipmentGroups : equipment}
              columnLabels={groupEquipment ? groupedEquipmentColumnLabels : equipmentColumnLabels}
              onRemoveRow={(item) => () => onRemoveEquipment(item)}
              renderValue={renderCellValue}
              getColumnTotal={renderColumnTotals}
              onEditValue={onEditValue}
              editValue={pendingValue}
              onCancelEdit={onCancelPendingValue}
              onSaveEdit={onSavePendingValue}
              renderInput={renderEquipmentInput}
            />
          </>
        ) : (
          <MessageView>Kalustoluettelossa ei ole ajoneuvoja.</MessageView>
        )}
        <EditEquipment
          operatorId={operatorId}
          catalogueId={catalogueId}
          equipment={equipment}
          onEquipmentChanged={onEquipmentChanged}
        />
      </>
    )
  }
)

export default CatalogueEquipment
