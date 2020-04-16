import React, { useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { useMutationData } from '../util/useMutationData'
import { updateEquipmentRequirementQuotaMutation } from '../equipment/equipmentQuery'
import { MessageView } from '../common/components/common'
import EditEquipment from '../equipment/EditEquipment'
import { EquipmentWithQuota } from '../equipment/equipmentUtils'
import { ExecutionRequirement } from '../schema-types'
import { removeRequirementEquipmentMutation } from './executionRequirementsQueries'
import EquipmentList from '../equipment/EquipmentList'

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

const RequirementEquipmentList: React.FC<PropTypes> = observer(
  ({ equipment, executionRequirement, startDate, onEquipmentChanged }) => {
    let [execRemoveEquipment] = useMutationData(removeRequirementEquipmentMutation)
    let [execUpdateEquipment] = useMutationData(updateEquipmentRequirementQuotaMutation)

    let updateEquipmentData = useCallback(
      async (equipmentId, equipmentInput, quotaId) => {
        await execUpdateEquipment({
          variables: {
            equipmentId,
            quotaId,
            equipmentInput,
          },
        })

        await onEquipmentChanged()
      },
      [execUpdateEquipment, onEquipmentChanged]
    )

    const removeEquipment = useCallback(
      async (equipmentId: string) => {
        await execRemoveEquipment({
          variables: {
            equipmentId,
            requirementId: executionRequirement.id,
          },
        })

        await onEquipmentChanged()
      },
      [onEquipmentChanged, executionRequirement, execRemoveEquipment]
    )

    return (
      <>
        {equipment.length !== 0 ? (
          <EquipmentList
            equipment={equipment}
            updateEquipment={updateEquipmentData}
            removeEquipment={removeEquipment}
            startDate={startDate}
            columnLabels={equipmentColumnLabels}
            groupedColumnLabels={groupedEquipmentColumnLabels}
            editableValues={['percentageQuota', 'meterRequirement']}
          />
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
