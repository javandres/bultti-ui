import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import UploadFile from '../common/inputs/UploadFile'
import { FlexRow } from '../common/components/common'
import Table, { CellContent } from '../common/components/Table'
import { Checkmark2 } from '../common/icons/Checkmark2'
import { CrossThick } from '../common/icons/CrossThick'
import EquipmentCollectionInput from './EquipmentCollectionInput'
import { EquipmentCollection } from '../schema-types'
import { Button } from '../common/components/Button'

const EquipmentCatalogueView = styled.div``

const ResetButton = styled(Button)`
  margin-left: auto;
`

export type PropTypes = {
  equipment: EquipmentCollection[]
  addEquipment: (item: EquipmentCollection) => void
  removeEquipment: (item: EquipmentCollection) => void
  updateEquipment: (
    item: EquipmentCollection,
    key: string,
    value: any,
    onEdit?: (item: EquipmentCollection) => EquipmentCollection
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

const createEquipmentKey = (e: EquipmentCollection) =>
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

      const inputRow: { _editable: boolean; valid } & EquipmentCollection = {
        _editable: true,
        valid: false,
        id: 'new',
        make: '',
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
          <EquipmentCollectionInput
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
        <UploadFile
          label="Lisää kalustoluettelosta"
          value={uploadValue}
          onChange={setUploadValue}
        />
        {uploadValue && uploadValue.length !== 0 && (
          <FlexRow style={{ marginBottom: '1rem' }}>
            <ResetButton onClick={onReset}>Reset</ResetButton>
          </FlexRow>
        )}
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
