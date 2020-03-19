import React, { useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { useMutationData } from '../util/useMutationData'
import { removeEquipmentMutation } from './equipmentQuery'
import Table from '../common/components/Table'
import { MessageView, SubSectionHeading } from '../common/components/common'
import { EquipmentWithQuota } from './EquipmentCatalogue'
import EditEquipment from './EditEquipment'

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

// Naming things...
const EquipmentCatalogueEquipment: React.FC<PropTypes> = observer(
  ({ equipment, catalogueId, operatorId, onEquipmentChanged }) => {
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

    return (
      <>
        {equipment.length !== 0 ? (
          <>
            <SubSectionHeading>Ajoneuvot</SubSectionHeading>
            <Table
              items={equipment}
              columnLabels={equipmentColumnLabels}
              onRemoveRow={(item) => () => onRemoveEquipment(item)}
              getColumnTotal={(col) =>
                col === 'percentageQuota'
                  ? equipment.reduce((total, item) => {
                      total += item?.percentageQuota
                      return total
                    }, 0) + '%'
                  : ''
              }
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
