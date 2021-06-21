import React, { useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { useMutationData } from '../util/useMutationData'
import {
  removeEquipmentMutation,
  refreshEquipmentInCatalogueMutation,
  updateEquipmentCatalogueQuotaMutation,
} from '../equipment/equipmentQuery'
import { EquipmentWithQuota } from '../equipment/equipmentUtils'
import EquipmentList, { EquipmentUpdate } from '../equipment/EquipmentList'
import { MessageView } from '../common/components/Messages'
import { Text } from '../util/translate'
import { Button } from '../common/components/buttons/Button'
import { FlexRow } from '../common/components/common'

export type PropTypes = {
  equipment: EquipmentWithQuota[]
  catalogueId: string
  operatorId: number
  startDate: Date
  onEquipmentChanged: () => unknown
  isCatalogueEditable: boolean
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
  ({
    isCatalogueEditable,
    equipment,
    catalogueId,
    operatorId,
    startDate,
    onEquipmentChanged,
  }) => {
    let [execRemoveEquipment] = useMutationData(removeEquipmentMutation)
    let [execUpdateEquipment] = useMutationData(updateEquipmentCatalogueQuotaMutation)

    let [execUpdateEquipmentData, { loading: equipmentUpdateLoading }] = useMutationData(
      refreshEquipmentInCatalogueMutation
    )

    let updateEquipment = useCallback(
      async (updates: EquipmentUpdate[]) => {
        await Promise.all(
          updates.map((update) =>
            execUpdateEquipment({
              variables: update,
            })
          )
        )

        onEquipmentChanged()
      },
      [execUpdateEquipment, onEquipmentChanged]
    )

    let updateAllEquipmentData = useCallback(async () => {
      await execUpdateEquipmentData({
        variables: {
          catalogueId,
        },
      })

      onEquipmentChanged()
    }, [execUpdateEquipmentData, catalogueId, onEquipmentChanged])

    const removeEquipment = useCallback(
      async (equipmentId: string) => {
        await execRemoveEquipment({
          variables: {
            equipmentId,
            catalogueId,
          },
        })

        onEquipmentChanged()
      },
      [onEquipmentChanged, catalogueId, execRemoveEquipment]
    )

    return equipment.length !== 0 ? (
      <>
        <EquipmentList
          equipment={equipment}
          updateEquipment={isCatalogueEditable ? updateEquipment : undefined}
          removeEquipment={isCatalogueEditable ? removeEquipment : undefined}
          startDate={startDate}
          columnLabels={equipmentColumnLabels}
          groupedColumnLabels={groupedEquipmentColumnLabels}
          editableValues={isCatalogueEditable ? ['percentageQuota'] : undefined}
        />
        <FlexRow
          style={{
            marginLeft: 'auto',
            justifyContent: 'flex-end',
            marginBottom: '1rem',
            marginTop: '1rem',
          }}>
          <Button loading={equipmentUpdateLoading} onClick={updateAllEquipmentData}>
            <Text>catalogue_updateEquipment</Text>
          </Button>
        </FlexRow>
      </>
    ) : (
      <MessageView>
        <Text>catalogue_emptyCatalogue</Text>
      </MessageView>
    )
  }
)

export default CatalogueEquipmentList
