import React, { useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import Table, { CellContent } from '../common/components/Table'
import { Checkmark2 } from '../common/icons/Checkmark2'
import { CrossThick } from '../common/icons/CrossThick'
import { Equipment } from '../schema-types'
import EquipmentCatalogueTableInput from './EquipmentCatalogueTableInput'
import { useCollectionState } from '../utils/useCollectionState'

const EquipmentCatalogueView = styled.div``

const TableHeading = styled.h5`
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

    const renderEquipmentCell = useCallback((val, key, item) => {
      if (key === 'addToCatalogue') {
        return (
          <CellContent>
            {val ? (
              <Checkmark2 width="1rem" height="1rem" fill="var(--light-green)" />
            ) : (
              <CrossThick width="1rem" height="1rem" fill="var(--red)" />
            )}
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
        <Table
          items={equipment}
          columnLabels={equipmentColumnLabels}
          onRemoveRow={(item) => () => removeEquipment(item)}
        />
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
      </EquipmentCatalogueView>
    )
  }
)

export default EquipmentCatalogue
