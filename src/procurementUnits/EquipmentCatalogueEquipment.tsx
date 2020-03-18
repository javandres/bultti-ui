import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { EquipmentInput } from '../schema-types'
import { useMutationData } from '../utils/useMutationData'
import { createEquipmentMutation, removeEquipmentMutation } from './equipmentQuery'
import Table, { CellContent } from '../common/components/Table'
import EquipmentFormInput from './EquipmentFormInput'
import { MessageView } from '../common/components/common'
import { Button } from '../common/components/Button'
import ItemForm from '../common/inputs/ItemForm'
import { EquipmentWithQuota } from './EquipmentCatalogue'

const EquipmentCatalogueEquipmentView = styled.div``

const TableHeading = styled.h5`
  font-size: 0.875rem;
  margin-top: 2rem;
  margin-bottom: 0.5rem;

  &:first-child {
    margin-top: 0;
  }
`

export type PropTypes = {
  equipment: EquipmentWithQuota[]
  catalogueId: string
  operatorId: number
  onEquipmentChanged: () => Promise<void>
}

const equipmentColumnLabels = {
  vehicleId: 'Kylkinumero',
  model: 'Malli',
  type: 'Tyyppi',
  percentageQuota: 'Osuus',
  emissionClass: 'Euroluokka',
  co2: 'CO2 arvo',
  registryNr: 'Rek.numero',
  registryDate: 'Rek.päivä',
}

const equipmentInputValues = {
  percentageQuota: (val) => parseFloat(val),
  emissionClass: (val) => parseInt(val, 10),
}

const defaultGetVal = (val) => val
const getType = (key) => equipmentInputValues[key] || defaultGetVal

const equipmentIsValid = (e: EquipmentInput): boolean =>
  !!(e?.model && e?.emissionClass && e?.type && e?.percentageQuota && e?.registryDate)

// Naming things...
const EquipmentCatalogueEquipment: React.FC<PropTypes> = observer(
  ({ equipment, catalogueId, operatorId, onEquipmentChanged }) => {
    const [pendingEquipment, setPendingEquipment] = useState<EquipmentInput | null>(null)
    const [createEquipment] = useMutationData(createEquipmentMutation)
    const [removeEquipment] = useMutationData(removeEquipmentMutation)

    const addDraftEquipment = useCallback(() => {
      const inputRow: EquipmentInput = {
        vehicleId: '',
        model: '',
        type: '',
        exteriorColor: '',
        emissionClass: 1,
        co2: 0,
        registryDate: '',
        registryNr: '',
        percentageQuota: 0,
      }

      setPendingEquipment(inputRow)
    }, [])

    const onEquipmentInputChange = useCallback((key: string, nextValue) => {
      setPendingEquipment((currentPending) =>
        !currentPending ? null : { ...currentPending, [key]: getType(key)(nextValue) }
      )
    }, [])

    const onAddEquipment = useCallback(async () => {
      if (!catalogueId || !pendingEquipment) {
        return
      }

      setPendingEquipment(null)

      await createEquipment({
        variables: {
          operatorId,
          equipmentInput: pendingEquipment,
          catalogueId: catalogueId,
        },
      })

      await onEquipmentChanged()
    }, [catalogueId, operatorId, onEquipmentChanged, createEquipment, pendingEquipment])

    const onCancelPendingEquipment = useCallback(() => {
      setPendingEquipment(null)
    }, [])

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

    const renderEquipmentCell = useCallback((val: any, key: string, onChange) => {
      if (['id'].includes(key)) {
        return <CellContent>{val}</CellContent>
      }

      return <EquipmentFormInput value={val} valueName={key} onChange={onChange} />
    }, [])

    return (
      <>
        {equipment.length !== 0 ? (
          <>
            <TableHeading>Ajoneuvot</TableHeading>
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
        {!pendingEquipment && <Button onClick={addDraftEquipment}>Lisää ajoneuvo</Button>}
        {pendingEquipment && (
          <>
            <TableHeading>Lisää ajoneuvo</TableHeading>
            <ItemForm
              item={pendingEquipment}
              labels={equipmentColumnLabels}
              onChange={onEquipmentInputChange}
              onDone={onAddEquipment}
              onCancel={onCancelPendingEquipment}
              doneDisabled={!equipmentIsValid(pendingEquipment)}
              doneLabel="Lisää luetteloon"
              renderInput={renderEquipmentCell}
            />
          </>
        )}
      </>
    )
  }
)

export default EquipmentCatalogueEquipment
