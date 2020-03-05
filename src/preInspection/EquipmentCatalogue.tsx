import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import Table, { CellContent } from '../common/components/Table'
import { Checkmark2 } from '../common/icons/Checkmark2'
import { CrossThick } from '../common/icons/CrossThick'
import { Button } from '../common/components/Button'
import { EquipmentCatalogue } from '../schema-types'
import EquipmentCatalogueTableInput from './EquipmentCatalogueTableInput'

const EquipmentCatalogueView = styled.div``

const ResetButton = styled(Button)`
  margin-left: auto;
`

export type PropTypes = {
  equipment: EquipmentCatalogue[]
  addEquipment: (item: EquipmentCatalogue) => void
  removeEquipment: (item: EquipmentCatalogue) => void
  updateEquipment: (
    item: EquipmentCatalogue,
    key: string,
    value: any,
    onEdit?: (item: EquipmentCatalogue) => EquipmentCatalogue
  ) => void
}

const equipmentColumnLabels = {
  valid: 'OK',
  make: 'Merkki*',
  model: 'Malli*',
  type: 'Kalustotyyppi*',
  count: 'Määrä',
  seats: 'Istuinpaikat',
  emissionClass: 'Euroluokka*',
  age: 'Ikä',
}

const createEquipmentKey = (e: EquipmentCatalogue) =>
  !(e?.make && e?.model && e?.emissionClass && e?.type)
    ? null
    : `${e?.make}${e?.model}${e.emissionClass}${e.type}`

const EquipmentCatalogue: React.FC<PropTypes> = observer(
  ({ equipment, addEquipment, removeEquipment, updateEquipment }) => {
    const [uploadValue, setUploadValue] = useState<File[]>([])

    useEffect(() => {
      if (equipment.some(({ id }) => id === 'new')) {
        return
      }

      const inputRow: { _editable: boolean; valid } & EquipmentCatalogue = {
        _editable: true,
        valid: false,
        id: 'new',
        model: '',
        type: '',
        count: 0,
        seats: 0,
        emissionClass: '',
        age: 0,
      }

      addEquipment(inputRow)
    }, [equipment, addEquipment])

    const onReset = useCallback(() => {
      setUploadValue([])
    }, [])

    const onEquipmentInputChange = useCallback(
      (item) => (nextValue, key) => {
        const onEdit = (nextItem) => {
          if (nextItem.id === 'new') {
            const nextId = createEquipmentKey(nextItem) || 'new'
            nextItem['id'] = nextId

            if (nextId !== 'new') {
              nextItem['valid'] = true
            }
          }

          return nextItem
        }

        updateEquipment(item, key, nextValue, onEdit)
      },
      [updateEquipment]
    )

    const renderEquipmentCell = useCallback((val, key, item) => {
      if (key === 'valid') {
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
          renderCell={renderEquipmentCell}
          onRemoveRow={(item) => {
            if (item.id === 'new') {
              return false
            }

            return () => removeEquipment(item)
          }}
        />
      </EquipmentCatalogueView>
    )
  }
)

export default EquipmentCatalogue
