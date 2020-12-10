import React, { useCallback, useRef, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import ItemForm from '../common/input/ItemForm'
import { Button } from '../common/components/Button'
import { EquipmentCatalogue, EquipmentCatalogueInput, ProcurementUnit } from '../schema-types'
import { isEqual } from 'lodash'
import EquipmentCatalogueFormInput from './EquipmentCatalogueFormInput'
import { useMutationData } from '../util/useMutationData'
import {
  createEquipmentCatalogueMutation,
  updateEquipmentCatalogueMutation,
} from './equipmentCatalogueQuery'
import ValueDisplay from '../common/components/ValueDisplay'
import { text } from '../util/translate'
import { FlexRow } from '../common/components/common'

const EditEquipmentCatalogueView = styled.div`
  margin-top: 1rem;
`

export const equipmentCatalogueLabels = {
  startDate: text('start_date'),
  endDate: text('end_date'),
}

enum CatalogueEditMode {
  UPDATE = 'update',
  CREATE = 'create',
}

export type PropTypes = {
  catalogue?: EquipmentCatalogue
  procurementUnit: ProcurementUnit
  onChange: () => unknown
}

const EditEquipmentCatalogue = observer(
  ({ catalogue, procurementUnit, onChange }: PropTypes) => {
    const catalogueEditMode = useRef<CatalogueEditMode>(
      !catalogue ? CatalogueEditMode.CREATE : CatalogueEditMode.UPDATE
    )

    const [pendingCatalogue, setPendingCatalogue] = useState<EquipmentCatalogueInput | null>(
      null
    )

    const [createCatalogue] = useMutationData(createEquipmentCatalogueMutation)
    const [updateCatalogue] = useMutationData(updateEquipmentCatalogueMutation)

    const addDraftCatalogue = useCallback(() => {
      catalogueEditMode.current = CatalogueEditMode.CREATE

      setPendingCatalogue({
        startDate: procurementUnit.startDate,
        endDate: procurementUnit.endDate,
      })
    }, [procurementUnit])

    const editCurrentCatalogue = useCallback(() => {
      if (!catalogue) {
        return
      }

      catalogueEditMode.current = CatalogueEditMode.UPDATE

      setPendingCatalogue({
        startDate: catalogue.startDate,
        endDate: catalogue.endDate,
      })
    }, [catalogue])

    const onChangeCatalogue = useCallback((key: string, nextValue) => {
      setPendingCatalogue((currentPending) =>
        !currentPending ? null : { ...currentPending, [key]: nextValue }
      )
    }, [])

    const onSaveEquipmentCatalogue = useCallback(async () => {
      if (!pendingCatalogue) {
        return
      }

      setPendingCatalogue(null)

      console.log(pendingCatalogue)

      if (catalogue && catalogueEditMode.current === CatalogueEditMode.UPDATE) {
        await updateCatalogue({
          variables: {
            catalogueId: catalogue.id,
            catalogueData: pendingCatalogue,
          },
        })
      } else {
        await createCatalogue({
          variables: {
            operatorId: procurementUnit.operatorId,
            procurementUnitId: procurementUnit.id,
            catalogueData: pendingCatalogue,
          },
        })
      }

      onChange()
    }, [onChange, procurementUnit, catalogue, pendingCatalogue, catalogueEditMode.current])

    const onCancelPendingEquipmentCatalogue = useCallback(() => {
      setPendingCatalogue(null)
    }, [])

    const renderCatalogueInput = useCallback((key: string, val: any, onChange) => {
      return (
        <EquipmentCatalogueFormInput value={val || ''} valueName={key} onChange={onChange} />
      )
    }, [])

    let isDirty = !isEqual(
      { startDate: catalogue?.startDate, endDate: catalogue?.endDate },
      pendingCatalogue
    )

    return (
      <EditEquipmentCatalogueView>
        <>
          {!pendingCatalogue && catalogue && (
            <ValueDisplay item={catalogue} labels={equipmentCatalogueLabels}>
              <Button style={{ marginLeft: 'auto' }} onClick={editCurrentCatalogue}>
                Muokkaa
              </Button>
            </ValueDisplay>
          )}
          {pendingCatalogue && (
            <ItemForm
              item={pendingCatalogue}
              labels={equipmentCatalogueLabels}
              onChange={onChangeCatalogue}
              onDone={onSaveEquipmentCatalogue}
              onCancel={onCancelPendingEquipmentCatalogue}
              isDirty={isDirty}
              keyFromItem={(item) => item.id}
              renderInput={renderCatalogueInput}
              doneLabel={
                catalogueEditMode.current === CatalogueEditMode.UPDATE
                  ? 'Tallenna'
                  : 'Lisää kalustoluettelo'
              }
            />
          )}
        </>
        {!catalogue && !pendingCatalogue && (
          <FlexRow
            style={{
              backgroundColor: 'var(--lightest-blue)',
              margin: '1rem -1rem -1rem',
              padding: '1rem',
              borderBottomLeftRadius: '0.5rem',
              borderBottomRightRadius: '0.5rem',
              borderTop: '1px solid var(--lighter-grey)',
            }}>
            <Button onClick={addDraftCatalogue}>Luo uusi kalustoluettelo</Button>
          </FlexRow>
        )}
      </EditEquipmentCatalogueView>
    )
  }
)

export default EditEquipmentCatalogue
