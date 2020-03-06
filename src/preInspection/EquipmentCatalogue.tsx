import React, { useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import Table, { CellContent } from '../common/components/Table'
import { Equipment } from '../schema-types'
import EquipmentCatalogueFormInput from './EquipmentCatalogueFormInput'
import { useCollectionState } from '../utils/useCollectionState'
import ItemForm from '../common/inputs/ItemForm'

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
  make: 'Merkki',
  model: 'Malli',
  type: 'Kalustotyyppi',
  percentageQuota: 'Osuus',
  emissionClass: 'Euroluokka',
  co2: 'CO2 arvo',
  exteriorColor: 'Ulkoväri',
  registryNumber: 'Rekisterinumero',
  registryDate: 'Rekisteröintipäivä',
}

const equipmentIsValid = (e: Equipment): boolean =>
  !!(e?.make && e?.model && e?.emissionClass && e?.type && e?.percentageQuota)

const createEquipmentKey = (e: Equipment) =>
  !equipmentIsValid(e) ? null : `${e?.make}${e?.model}${e.emissionClass}${e.type}`

type PendingEquipmentType = { _editable: boolean; valid } & Equipment

const EquipmentCatalogue: React.FC<PropTypes> = observer(
  ({ equipment, addEquipment, removeEquipment, updateEquipment }) => {
    const [
      pendingEquipment,
      { add: addPending, remove: removePending, update: updatePending },
    ] = useCollectionState<PendingEquipmentType>([])

    useEffect(() => {
      if (pendingEquipment.length > 0) {
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
        percentageQuota: 0,
        exteriorColor: '',
        addToCatalogue: '',
      }

      addPending(inputRow)
    }, [pendingEquipment, addPending])

    const onEquipmentInputChange = useCallback(
      (item) => (key, nextValue) => {
        const onEdit = (nextItem) => {
          if (nextItem.id === 'new') {
            nextItem['id'] = createEquipmentKey(nextItem) || 'new'
          }

          return nextItem
        }

        updatePending(item, key, nextValue, onEdit)
      },
      [updatePending]
    )

    const onAddEquipment = useCallback(
      (item) => {
        addEquipment(item)
        removePending(item)
      },
      [addEquipment, removePending]
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
                      total += parseFloat((item?.percentageQuota || '0') as string)
                      return total
                    }, 0) + '%'
                  : ''
              }
            />
          </>
        )}
        {pendingEquipment.length !== 0 && (
          <>
            <TableHeading style={{ marginTop: '2rem' }}>Lisää ajoneuvo</TableHeading>
            {pendingEquipment.map((item) => (
              <ItemForm
                key={item.id}
                item={item}
                labels={equipmentColumnLabels}
                onChange={onEquipmentInputChange(item)}
                onDone={() => onAddEquipment(item)}
                doneDisabled={!equipmentIsValid(item)}
                doneLabel="Lisää luetteloon"
                renderInput={renderEquipmentCell}
              />
            ))}
          </>
        )}
      </EquipmentCatalogueView>
    )
  }
)

export default EquipmentCatalogue
