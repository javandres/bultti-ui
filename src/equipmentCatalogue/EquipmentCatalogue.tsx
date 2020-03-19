import React, { useCallback, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import {
  Equipment,
  EquipmentCatalogue as EquipmentCatalogueType,
  EquipmentCatalogueInput,
} from '../schema-types'
import ItemForm from '../common/input/ItemForm'
import { Button } from '../common/components/Button'
import { useMutationData } from '../util/useMutationData'
import { MessageView } from '../common/components/common'
import EquipmentCatalogueFormInput from './EquipmentCatalogueFormInput'
import {
  createEquipmentCatalogueMutation,
  updateEquipmentCatalogueMutation,
} from './equipmentCatalogueQuery'
import { useStateValue } from '../state/useAppState'
import ValueDisplay from '../common/components/ValueDisplay'
import EquipmentCatalogueEquipment from './EquipmentCatalogueEquipment'
import { groupBy } from 'lodash'

const EquipmentCatalogueView = styled.div``

export type PropTypes = {
  procurementUnitId: string
  catalogue?: EquipmentCatalogueType
  operatorId: number
  onCatalogueChanged: () => Promise<void>
}

export type EquipmentWithQuota = Equipment & { percentageQuota: number }

const equipmentCatalogueLabels = {
  startDate: 'Alkupäivä',
  endDate: 'Loppupäivä',
}

enum CatalogueEditMode {
  UPDATE = 'update',
  CREATE = 'create',
}

const EquipmentCatalogue: React.FC<PropTypes> = observer(
  ({ procurementUnitId, catalogue, operatorId, onCatalogueChanged }) => {
    const catalogueEditMode = useRef<CatalogueEditMode>(
      !catalogue ? CatalogueEditMode.CREATE : CatalogueEditMode.UPDATE
    )

    const [globalSeason] = useStateValue('globalSeason')
    const [pendingCatalogue, setPendingCatalogue] = useState<EquipmentCatalogueInput | null>(null)

    const [createCatalogue] = useMutationData(createEquipmentCatalogueMutation)
    const [updateCatalogue] = useMutationData(updateEquipmentCatalogueMutation)

    const addDraftCatalogue = useCallback(() => {
      catalogueEditMode.current = CatalogueEditMode.CREATE

      setPendingCatalogue({
        startDate: globalSeason?.startDate,
        endDate: globalSeason?.endDate,
      })
    }, [globalSeason])

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
            operatorId: operatorId,
            procurementUnitId: procurementUnitId,
            catalogueData: pendingCatalogue,
          },
        })
      }

      await onCatalogueChanged()
    }, [operatorId, procurementUnitId, catalogue, pendingCatalogue, catalogueEditMode.current])

    const onCancelPendingEquipmentCatalogue = useCallback(() => {
      setPendingCatalogue(null)
    }, [])

    const renderCatalogueInput = useCallback((val: any, key: string, onChange) => {
      return <EquipmentCatalogueFormInput value={val} valueName={key} onChange={onChange} />
    }, [])

    const equipment: EquipmentWithQuota[] = useMemo(
      () =>
        (catalogue?.equipmentQuotas || []).map((quota) => ({
          ...quota.equipment,
          percentageQuota: quota.percentageQuota,
        })),
      [catalogue]
    )

    return (
      <EquipmentCatalogueView>
        {catalogue && !pendingCatalogue && (
          <ValueDisplay item={catalogue} labels={equipmentCatalogueLabels}>
            <Button style={{ marginLeft: 'auto' }} onClick={editCurrentCatalogue}>
              Muokkaa
            </Button>
          </ValueDisplay>
        )}
        {pendingCatalogue && (
          <ItemForm
            item={pendingCatalogue}
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
            <Button onClick={addDraftCatalogue}>Uusi kalustoluettelo</Button>
          </>
        )}
        {catalogue && (
          <EquipmentCatalogueEquipment
            catalogueId={catalogue.id}
            operatorId={operatorId}
            equipment={equipment}
            onEquipmentChanged={onCatalogueChanged}
          />
        )}
      </EquipmentCatalogueView>
    )
  }
)

export default EquipmentCatalogue
