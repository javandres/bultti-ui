import React, { useCallback, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { useMutationData } from '../util/useMutationData'
import {
  removeRequirementEquipmentMutation,
  updateEquipmentRequirementQuotaMutation,
} from '../equipment/equipmentQuery'
import { EquipmentWithQuota, getEquipmentAge } from '../equipment/equipmentUtils'
import { ExecutionRequirement } from '../schema-types'
import EquipmentList, { EquipmentUpdate } from '../equipment/EquipmentList'
import { MessageView } from '../common/components/Messages'
import { getDateObject } from '../util/formatDate'

export type PropTypes = {
  equipment: EquipmentWithQuota[]
  executionRequirement: ExecutionRequirement
  startDate: Date
  onEquipmentChanged: () => unknown
  isEditable: boolean
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
  age: 'Ikä',
}

export const groupedEquipmentColumnLabels = {
  model: 'Malli',
  type: 'Tyyppi',
  emissionClass: 'Euroluokka',
  registryDate: 'Rek.päivä',
  age: 'Ikä',
  percentageQuota: 'Osuus',
  kilometerRequirement: 'Kilometriosuus',
  amount: 'Määrä',
}

const RequirementEquipmentList: React.FC<PropTypes> = observer(
  ({ equipment, executionRequirement, startDate, onEquipmentChanged, isEditable }) => {
    let [execRemoveEquipment] = useMutationData(removeRequirementEquipmentMutation)
    let [execUpdateEquipment] = useMutationData(updateEquipmentRequirementQuotaMutation)

    let updateEquipmentData = useCallback(
      async (updates: EquipmentUpdate[]) => {
        if (isEditable) {
          await Promise.all(
            updates.map((update) =>
              execUpdateEquipment({
                variables: update,
              })
            )
          )

          await onEquipmentChanged()
        }
      },
      [execUpdateEquipment, onEquipmentChanged, isEditable]
    )

    const removeEquipment = useCallback(
      async (equipmentId: string) => {
        if (isEditable) {
          await execRemoveEquipment({
            variables: {
              equipmentId,
              requirementId: executionRequirement.id,
            },
          })

          await onEquipmentChanged()
        }
      },
      [onEquipmentChanged, executionRequirement, execRemoveEquipment, isEditable]
    )

    let tableEquipmentRows = useMemo(
      () =>
        equipment.map((equipmentQuotaItem) => ({
          ...equipmentQuotaItem,
          age: getEquipmentAge(getDateObject(equipmentQuotaItem.registryDate), startDate),
        })),
      [equipment]
    )

    return equipment.length !== 0 ? (
      <EquipmentList
        equipment={tableEquipmentRows}
        updateEquipment={updateEquipmentData}
        removeEquipment={!isEditable ? undefined : removeEquipment}
        startDate={startDate}
        columnLabels={equipmentColumnLabels}
        groupedColumnLabels={groupedEquipmentColumnLabels}
        editableValues={!isEditable ? undefined : ['percentageQuota', 'meterRequirement']}
      />
    ) : (
      <MessageView>Suoritevaatimukseen ei ole liitetty ajoneuvoja.</MessageView>
    )
  }
)

export default RequirementEquipmentList
