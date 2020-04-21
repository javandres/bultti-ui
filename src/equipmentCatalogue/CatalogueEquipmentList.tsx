import React, { useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { useMutationData } from '../util/useMutationData'
import {
  removeEquipmentMutation,
  updateEquipmentCatalogueQuotaMutation,
} from '../equipment/equipmentQuery'
import { MessageView } from '../common/components/common'
import { EquipmentWithQuota } from '../equipment/equipmentUtils'
import EquipmentList, { EquipmentUpdate } from '../equipment/EquipmentList'

export type PropTypes = {
  equipment: EquipmentWithQuota[]
  catalogueId: string
  operatorId: number
  startDate: Date
  onEquipmentChanged: () => Promise<void>
  equipmentEditable: boolean
}

export const equipmentColumnLabels = {
  vehicleId: 'Kylkinumero',
  model: 'Malli',
  type: 'Tyyppi',
  percentageQuota: 'Tarjottu osuus',
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

const CatalogueEquipmentList: React.FC<PropTypes> = observer(
  ({ equipmentEditable, equipment, catalogueId, operatorId, startDate, onEquipmentChanged }) => {
    let [execRemoveEquipment] = useMutationData(removeEquipmentMutation)
    let [execUpdateEquipment] = useMutationData(updateEquipmentCatalogueQuotaMutation)

    let updateEquipmentData = useCallback(
      async (updates: EquipmentUpdate[]) => {
        await Promise.all(
          updates.map((update) =>
            execUpdateEquipment({
              variables: update,
            })
          )
        )

        await onEquipmentChanged()
      },
      [execUpdateEquipment, onEquipmentChanged]
    )

    const removeEquipment = useCallback(
      async (equipmentId: string) => {
        await execRemoveEquipment({
          variables: {
            equipmentId,
            catalogueId,
          },
        })

        await onEquipmentChanged()
      },
      [onEquipmentChanged, catalogueId, execRemoveEquipment]
    )

    return equipment.length !== 0 ? (
      <EquipmentList
        equipment={equipment}
        updateEquipment={updateEquipmentData}
        removeEquipment={removeEquipment}
        startDate={startDate}
        columnLabels={equipmentColumnLabels}
        groupedColumnLabels={groupedEquipmentColumnLabels}
        editableValues={['percentageQuota']}
      />
    ) : (
      <MessageView>Kalustoluettelossa ei ole ajoneuvoja.</MessageView>
    )
  }
)

export default CatalogueEquipmentList
