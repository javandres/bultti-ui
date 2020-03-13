import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import Table, { CellContent } from '../common/components/Table'
import { Equipment, EquipmentInput } from '../schema-types'
import EquipmentCatalogueFormInput from './EquipmentCatalogueFormInput'
import ItemForm from '../common/inputs/ItemForm'
import { Button } from '../common/components/Button'
import { get } from 'lodash'
import { useMutationData } from '../utils/useMutationData'
import { createEquipmentMutation } from './equipmentQuery'

const EquipmentCatalogueView = styled.div``

const TableHeading = styled.h5`
  margin-top: 2rem;
  margin-bottom: 0.5rem;

  &:first-child {
    margin-top: 0;
  }
`

export type PropTypes = {
  operatorId: number
  equipment: Equipment[]
  addEquipment: (item: Equipment) => void
  removeEquipment: (item: Equipment) => void
  updateEquipment: (
    item: Equipment,
    key: string,
    value: any,
    onEdit?: (item: Equipment) => Equipment
  ) => void
}

const equipmentColumnLabels = {
  vehicleId: 'Kylkinumero',
  make: 'Merkki',
  model: 'Malli',
  type: 'Kalustotyyppi',
  percentageQuota: 'Osuus',
  emissionClass: 'Euroluokka',
  co2: 'CO2 arvo',
  registryNr: 'Rekisterinumero',
  registryDate: 'Rekisteröintipäivä',
}

const equipmentInputValues = {
  percentageQuota: (val) => parseFloat(val),
  emissionClass: (val) => parseInt(val, 10),
}

const defaultGetVal = (val) => val
const getType = (key) => equipmentInputValues[key] || defaultGetVal

const equipmentIsValid = (e: EquipmentInput): boolean =>
  !!(
    e?.make &&
    e?.model &&
    e?.emissionClass &&
    e?.type &&
    e?.percentageQuota &&
    e?.registryDate
  )

const createEquipmentKey = (e: Equipment) =>
  !equipmentIsValid(e) ? null : `${e?.make}${e?.model}${e.emissionClass}${e.type}`

const EquipmentCatalogue: React.FC<PropTypes> = observer(
  ({ operatorId, equipment, addEquipment, removeEquipment }) => {
    const [pendingEquipment, setPendingEquipment] = useState<EquipmentInput | null>(null)

    const [
      mutate,
      { data: createdEquipment, loading: createdEquipmentLoading },
    ] = useMutationData(createEquipmentMutation)

    console.log(createdEquipment)

    const addDraftEquipment = useCallback(() => {
      const inputRow: EquipmentInput = {
        id: 'new',
        vehicleId: '',
        make: '',
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

    const onAddEquipment = useCallback(
      (item) => {
        addEquipment(item)
        setPendingEquipment(null)

        mutate({
          variables: {
            operatorId,
            equipmentInput: item,
          },
        })
      },
      [addEquipment]
    )

    const renderEquipmentCell = useCallback((val: any, key: string, onChange) => {
      if (['id'].includes(key)) {
        return <CellContent>{val}</CellContent>
      }

      return <EquipmentCatalogueFormInput value={val} valueName={key} onChange={onChange} />
    }, [])

    return (
      <EquipmentCatalogueView>
        {equipment.length !== 0 && (
          <>
            <TableHeading>Ajoneuvot</TableHeading>
            <Table
              items={equipment}
              columnLabels={equipmentColumnLabels}
              onRemoveRow={(item) => () => removeEquipment(item)}
              getColumnTotal={(col) =>
                col === 'percentageQuota'
                  ? equipment.reduce((total, item) => {
                      total += parseFloat(
                        get(item, 'percentageQuota[0].percentageQuota', '0') as string
                      )
                      return total
                    }, 0) + '%'
                  : ''
              }
            />
          </>
        )}
        <>
          {!pendingEquipment && <Button onClick={addDraftEquipment}>Lisää ajoneuvo</Button>}
          {pendingEquipment && (
            <>
              <TableHeading>Lisää ajoneuvo</TableHeading>
              <ItemForm
                item={pendingEquipment}
                labels={equipmentColumnLabels}
                onChange={onEquipmentInputChange}
                onDone={() => onAddEquipment(pendingEquipment)}
                doneDisabled={!equipmentIsValid(pendingEquipment)}
                doneLabel="Lisää luetteloon"
                renderInput={renderEquipmentCell}
              />
            </>
          )}
        </>
      </EquipmentCatalogueView>
    )
  }
)

export default EquipmentCatalogue
