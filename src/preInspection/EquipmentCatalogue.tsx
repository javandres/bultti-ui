import React, { useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import Table, { CellContent } from '../common/components/Table'
import { Equipment } from '../schema-types'
import EquipmentCatalogueTableInput from './EquipmentCatalogueTableInput'
import { useCollectionState } from '../utils/useCollectionState'
import { Button, ButtonSize } from '../common/components/Button'

const EquipmentCatalogueView = styled.div``

const TableHeading = styled.h5`
  margin-top: 0;
  margin-bottom: 0.5rem;
`

export type PropTypes = {
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
  make: 'Merkki*',
  model: 'Malli',
  type: 'Kalustotyyppi*',
  percentageQuota: 'Osuus',
  emissionClass: 'Euroluokka*',
  co2: 'CO2 arvo',
  exteriorColor: 'Ulkoväri',
  registryNumber: 'Rekisterinumero',
  registryDate: 'Rekisteröintipäivä',
}

const pendingEquipmentColumnLabels = {
  ...equipmentColumnLabels,
  addToCatalogue: 'Lisää luetteloon',
}

const createEquipmentKey = (e: Equipment) =>
  !(e?.make && e?.model && e?.emissionClass && e?.type)
    ? null
    : `${e?.make}${e?.model}${e.emissionClass}${e.type}`

type PendingEquipmentType = { _editable: boolean; valid } & Equipment

const EquipmentCatalogue: React.FC<PropTypes> = observer(
  ({ equipment, addEquipment, removeEquipment, updateEquipment }) => {
    const [
      pendingEquipment,
      { add: addPending, remove: removePending, update: updatePending },
    ] = useCollectionState<PendingEquipmentType>([])

    useEffect(() => {
      if (pendingEquipment.some(({ id }) => id === 'new')) {
        return
      }

      const inputRow: { _editable: boolean; addToCatalogue: string } & Equipment = {
        _editable: true,
        id: 'new',
        vehicleId: '',
        make: '',
        model: '',
        type: '',
        emissionClass: '',
        co2: 0,
        registryDate: '',
        registryNr: '',
        exteriorColor: '',
        addToCatalogue: '',
      }

      addPending(inputRow)
    }, [pendingEquipment, addPending])

    const onEquipmentInputChange = useCallback(
      (item) => (nextValue, key) => {
        const onEdit = (nextItem) => {
          if (nextItem.id === 'new') {
            nextItem['id'] = createEquipmentKey(nextItem) || 'new'
          }

          return nextItem
        }

        updatePending(item, key, nextValue, onEdit)
      },
      [updateEquipment]
    )

    const onAddEquipment = useCallback(
      (item) => {
        addEquipment(item)
        removePending(item)
      },
      [addEquipment, removePending]
    )

    const renderEquipmentCell = useCallback((val, key, item) => {
      if (key === 'addToCatalogue') {
        const isValid = !!createEquipmentKey(item)

        return (
          <CellContent>
            <Button
              size={ButtonSize.SMALL}
              disabled={!isValid}
              onClick={() => onAddEquipment(item)}>
              Lisää luetteloon
            </Button>
          </CellContent>
        )
      }

      if (item?._editable) {
        return (
          <EquipmentCatalogueTableInput
            value={val}
            valueName={key}
            onChange={onEquipmentInputChange(item)}
          />
        )
      }

      return <CellContent>{val}</CellContent>
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
            />
          </>
        )}
        {pendingEquipment.length !== 0 && (
          <>
            <TableHeading>Lisää ajoneuvo</TableHeading>
            <Table
              items={pendingEquipment}
              columnLabels={pendingEquipmentColumnLabels}
              renderCell={renderEquipmentCell}
              onRemoveRow={(item) => {
                if (item.id === 'new') {
                  return false
                }

                return () => removePending(item)
              }}
            />
          </>
        )}
      </EquipmentCatalogueView>
    )
  }
)

export default EquipmentCatalogue
