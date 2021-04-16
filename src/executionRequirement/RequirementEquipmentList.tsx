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
import { text } from '../util/translate'

export type PropTypes = {
  equipment: EquipmentWithQuota[]
  executionRequirement: ExecutionRequirement
  startDate: Date
  onEquipmentChanged: () => unknown
  isEditable: boolean
}

export const equipmentColumnLabels = {
  vehicleId: text('executionRequirement_equipmentList_vehicleId'),
  model: text('executionRequirement_equipmentList_model'),
  type: text('executionRequirement_equipmentList_type'),
  percentageQuota: text('executionRequirement_equipmentList_percentageQuota'),
  meterRequirement: text('executionRequirement_equipmentList_meterRequirement'),
  emissionClass: text('executionRequirement_equipmentList_emissionClass'),
  registryNr: text('executionRequirement_equipmentList_registryNr'),
  registryDate: text('executionRequirement_equipmentList_registryDate'),
  age: text('executionRequirement_equipmentList_age'),
}

export const groupedEquipmentColumnLabels = {
  model: text('executionRequirement_model'),
  type: text('executionRequirement_type'),
  emissionClass: text('executionRequirement_emissionClass'),
  registryDate: text('executionRequirement_registryDate'),
  age: text('executionRequirement_age'),
  percentageQuota: text('executionRequirement_percentageQuota'),
  kilometerRequirement: text('executionRequirement_kilometerRequirement'),
  amount: text('executionRequirement_amount'),
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
