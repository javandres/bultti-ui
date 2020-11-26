import React, { useCallback, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import {
  EquipmentCatalogue as EquipmentCatalogueType,
  EquipmentCatalogueInput,
  ProcurementUnit,
} from '../schema-types'
import ItemForm from '../common/input/ItemForm'
import { Button } from '../common/components/Button'
import { useMutationData } from '../util/useMutationData'
import EquipmentCatalogueFormInput from './EquipmentCatalogueFormInput'
import {
  createEquipmentCatalogueMutation,
  updateEquipmentCatalogueMutation,
} from './equipmentCatalogueQuery'
import ValueDisplay from '../common/components/ValueDisplay'
import CatalogueEquipmentList, { equipmentColumnLabels } from './CatalogueEquipmentList'
import {
  catalogueEquipment,
  EquipmentWithQuota,
  useEquipmentCrud,
} from '../equipment/equipmentUtils'
import AddEquipment from '../equipment/AddEquipment'
import { MessageView } from '../common/components/Messages'

const EquipmentCatalogueView = styled.div``

export type PropTypes = {
  procurementUnit: ProcurementUnit
  startDate: Date
  catalogue?: EquipmentCatalogueType
  operatorId: number
  onCatalogueChanged: () => unknown
  editable: boolean
}

const equipmentCatalogueLabels = {
  startDate: 'Alkupäivä',
  endDate: 'Loppupäivä',
}

enum CatalogueEditMode {
  UPDATE = 'update',
  CREATE = 'create',
}

const EquipmentCatalogue: React.FC<PropTypes> = observer(
  ({ editable, procurementUnit, catalogue, startDate, operatorId, onCatalogueChanged }) => {
    const catalogueEditMode = useRef<CatalogueEditMode>(
      !catalogue ? CatalogueEditMode.CREATE : CatalogueEditMode.UPDATE
    )

    const [pendingCatalogue, setPendingCatalogue] = useState<EquipmentCatalogueInput | null>(
      null
    )

    let { removeAllEquipment, addEquipment, addBatchEquipment } = useEquipmentCrud(
      catalogue,
      onCatalogueChanged
    )

    const [createCatalogue] = useMutationData(createEquipmentCatalogueMutation)
    const [updateCatalogue] = useMutationData(updateEquipmentCatalogueMutation)

    const addDraftCatalogue = useCallback(() => {
      if (!editable) {
        return
      }

      catalogueEditMode.current = CatalogueEditMode.CREATE

      setPendingCatalogue({
        startDate: procurementUnit.startDate,
        endDate: procurementUnit.endDate,
      })
    }, [procurementUnit, editable])

    const editCurrentCatalogue = useCallback(() => {
      if (!editable || !catalogue) {
        return
      }

      catalogueEditMode.current = CatalogueEditMode.UPDATE

      setPendingCatalogue({
        startDate: catalogue.startDate,
        endDate: catalogue.endDate,
      })
    }, [catalogue, editable])

    const onChangeCatalogue = useCallback((key: string, nextValue) => {
      setPendingCatalogue((currentPending) =>
        !currentPending ? null : { ...currentPending, [key]: nextValue }
      )
    }, [])

    const onSaveEquipmentCatalogue = useCallback(async () => {
      if (!editable || !pendingCatalogue) {
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
            operatorId: operatorId,
            procurementUnitId: procurementUnit.id,
            catalogueData: pendingCatalogue,
          },
        })
      }

      onCatalogueChanged()
    }, [
      operatorId,
      procurementUnit,
      catalogue,
      pendingCatalogue,
      catalogueEditMode.current,
      editable,
    ])

    const onCancelPendingEquipmentCatalogue = useCallback(() => {
      setPendingCatalogue(null)
    }, [])

    const renderCatalogueInput = useCallback((key: string, val: any, onChange) => {
      return (
        <EquipmentCatalogueFormInput value={val || ''} valueName={key} onChange={onChange} />
      )
    }, [])

    const equipment: EquipmentWithQuota[] = useMemo(() => catalogueEquipment(catalogue), [
      catalogue,
    ])

    let hasEquipment = useCallback(
      (checkItem?: any) =>
        !checkItem ? false : equipment.some((eq) => eq.vehicleId === checkItem?.vehicleId),
      [equipment]
    )

    return (
      <EquipmentCatalogueView>
        {catalogue && !pendingCatalogue && (
          <ValueDisplay item={catalogue} labels={equipmentCatalogueLabels}>
            {editable && (
              <Button style={{ marginLeft: 'auto' }} onClick={editCurrentCatalogue}>
                Muokkaa
              </Button>
            )}
          </ValueDisplay>
        )}
        {editable && pendingCatalogue && (
          <ItemForm
            item={pendingCatalogue}
            labels={equipmentCatalogueLabels}
            onChange={onChangeCatalogue}
            onDone={onSaveEquipmentCatalogue}
            onCancel={onCancelPendingEquipmentCatalogue}
            keyFromItem={(item) => item.id}
            renderInput={renderCatalogueInput}
            doneLabel={
              catalogueEditMode.current === CatalogueEditMode.UPDATE
                ? 'Tallenna'
                : 'Lisää kalustoluettelo'
            }
          />
        )}
        {!catalogue && !pendingCatalogue && (
          <>
            <MessageView>Kilpailukohteella ei ole kalustoluetteloa.</MessageView>
            {editable && <Button onClick={addDraftCatalogue}>Luo kalustoluettelo</Button>}
          </>
        )}
        {catalogue && (
          <>
            <CatalogueEquipmentList
              catalogueId={catalogue.id}
              operatorId={operatorId}
              equipment={equipment}
              startDate={startDate}
              onEquipmentChanged={onCatalogueChanged}
              equipmentEditable={editable}
            />
            {editable && (
              <AddEquipment
                operatorId={operatorId}
                equipment={equipment}
                onEquipmentChanged={onCatalogueChanged}
                hasEquipment={hasEquipment}
                editableKeys={['percentageQuota']}
                fieldLabels={equipmentColumnLabels}
                removeAllEquipment={removeAllEquipment}
                addEquipment={addEquipment}
                addBatchEquipment={addBatchEquipment}
              />
            )}
          </>
        )}
      </EquipmentCatalogueView>
    )
  }
)

export default EquipmentCatalogue
