import React, { useCallback, useRef, useState } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import ItemForm from '../common/input/ItemForm'
import { Button, ButtonStyle } from '../common/components/buttons/Button'
import { EquipmentCatalogue, EquipmentCatalogueInput, ProcurementUnit } from '../schema-types'
import { isEqual } from 'lodash'
import EquipmentCatalogueFormInput from './EquipmentCatalogueFormInput'
import { useMutationData } from '../util/useMutationData'
import {
  createEquipmentCatalogueMutation,
  removeEquipmentCatalogueMutation,
  updateEquipmentCatalogueMutation,
} from './equipmentCatalogueQuery'
import ValueDisplay from '../common/components/ValueDisplay'
import { text, Text } from '../util/translate'
import { FlexRow } from '../common/components/common'
import { pickGraphqlData } from '../util/pickGraphqlData'

const EditEquipmentCatalogueView = styled.div`
  margin-top: 1rem;
`

export const equipmentCatalogueLabels = {
  startDate: text('startDate'),
  endDate: text('endDate'),
}

const equipmentCatalogueHints = {
  startDate: text('equipmentCatalogue_startDateHint'),
  endDate: text('equipmentCatalogue_endDateHint'),
}

enum CatalogueEditMode {
  UPDATE = 'update',
  CREATE = 'create',
}

export type PropTypes = {
  catalogue?: EquipmentCatalogue
  procurementUnit: ProcurementUnit
  onChange: () => unknown
  hasEquipment?: boolean
}

const EditEquipmentCatalogue = observer(
  ({ catalogue, procurementUnit, onChange, hasEquipment }: PropTypes) => {
    const catalogueEditMode = useRef<CatalogueEditMode>(
      !catalogue ? CatalogueEditMode.CREATE : CatalogueEditMode.UPDATE
    )

    const [pendingCatalogue, setPendingCatalogue] = useState<EquipmentCatalogueInput | null>(
      null
    )

    const [createCatalogue] = useMutationData(createEquipmentCatalogueMutation)
    const [updateCatalogue] = useMutationData(updateEquipmentCatalogueMutation)

    let [removeCatalogue, { loading: removeCatalogueLoading }] = useMutationData(
      removeEquipmentCatalogueMutation,
      {
        variables: {
          catalogueId: catalogue?.id,
        },
        update: (cache, { data }) => {
          let result = pickGraphqlData(data)
          let removeCatalogueId = catalogue?.id

          if (result && removeCatalogueId) {
            let procurementUnitCacheId = cache.identify(procurementUnit)

            cache.modify({
              id: procurementUnitCacheId,
              fields: {
                equipmentCatalogues(existingCatalogueRefs, { readField }) {
                  return existingCatalogueRefs.filter(
                    (catalogueRef) => removeCatalogueId !== readField('id', catalogueRef)
                  )
                },
              },
            })
          }
        },
      }
    )

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

    let isDirty =
      !!pendingCatalogue &&
      !isEqual(
        { startDate: catalogue?.startDate, endDate: catalogue?.endDate },
        pendingCatalogue
      )
    return (
      <EditEquipmentCatalogueView>
        <>
          {!pendingCatalogue && catalogue && (
            <ValueDisplay item={catalogue} labels={equipmentCatalogueLabels}>
              <FlexRow style={{ marginLeft: 'auto' }}>
                <Button onClick={editCurrentCatalogue}>
                  <Text>edit</Text>
                </Button>
                {!hasEquipment && (
                  <Button
                    style={{ marginLeft: '1rem' }}
                    buttonStyle={ButtonStyle.SECONDARY_REMOVE}
                    onClick={() => removeCatalogue()}
                    loading={removeCatalogueLoading}>
                    <Text>catalogue_removeEquipment</Text>
                  </Button>
                )}
              </FlexRow>
            </ValueDisplay>
          )}
          {pendingCatalogue && (
            <ItemForm
              item={pendingCatalogue}
              labels={equipmentCatalogueLabels}
              hints={equipmentCatalogueHints}
              onChange={onChangeCatalogue}
              onDone={onSaveEquipmentCatalogue}
              onCancel={onCancelPendingEquipmentCatalogue}
              isDirty={isDirty}
              keyFromItem={(item) => item.id}
              renderInput={renderCatalogueInput}
              doneLabel={
                catalogueEditMode.current === CatalogueEditMode.UPDATE
                  ? text('save')
                  : text('catalogue_addCatalogue')
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
            <Button onClick={addDraftCatalogue}>
              <Text>catalogue_newCatalogue</Text>
            </Button>
          </FlexRow>
        )}
      </EditEquipmentCatalogueView>
    )
  }
)

export default EditEquipmentCatalogue
