import React, { useCallback, useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useMutationData } from '../util/useMutationData'
import { removeEquipmentMutation } from './equipmentQuery'
import Table from '../common/components/Table'
import { FlexRow, MessageView, SubSectionHeading } from '../common/components/common'
import { EquipmentWithQuota } from './EquipmentCatalogue'
import EditEquipment from './EditEquipment'
import ToggleButton from '../common/input/ToggleButton'
import { groupBy, omit } from 'lodash'
import { Equipment } from '../schema-types'
import { strval } from '../util/strval'
import { emissionClassNames } from '../type/values'

export type PropTypes = {
  equipment: EquipmentWithQuota[]
  catalogueId: string
  operatorId: number
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

// Naming things...
const EquipmentCatalogueEquipment: React.FC<PropTypes> = observer(
  ({ equipment, catalogueId, operatorId, onEquipmentChanged }) => {
    let [groupEquipment, setEquipmentGrouped] = useState(true)
    let [removeEquipment] = useMutationData(removeEquipmentMutation)

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

    const equipmentGroups: Array<Omit<Equipment, 'vehicleId' | 'registryNr'> & {
      amount: number
    }> = useMemo(() => {
      let grouped = groupBy(
        equipment,
        ({ model, emissionClass, type, registryDate }) =>
          model + strval(emissionClass) + type + strval(registryDate)
      )

      return Object.values(grouped).map((equipmentGroup) => {
        return {
          ...omit(equipmentGroup[0], 'vehicleId', 'registryNr'),
          percentageQuota: equipmentGroup.reduce((total, item) => {
            total += item?.percentageQuota || 0
            return total
          }, 0),
          amount: equipmentGroup.length,
        }
      })
    }, [equipment])

    const renderCellValue = useCallback((val, key) => {
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

export default EquipmentCatalogueEquipment
