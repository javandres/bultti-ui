import React, { useCallback, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import Table, { CellContent } from '../common/components/Table'
import {
  Equipment,
  EquipmentCatalogue as EquipmentCatalogueType,
  EquipmentCatalogueInput,
  EquipmentInput,
} from '../schema-types'
import EquipmentFormInput from './EquipmentFormInput'
import ItemForm from '../common/inputs/ItemForm'
import { Button } from '../common/components/Button'
import { useMutationData } from '../utils/useMutationData'
import { createEquipmentMutation } from './equipmentQuery'
import { MessageView } from '../common/components/common'
import EquipmentCatalogueFormInput from './EquipmentCatalogueFormInput'
import {
  createEquipmentCatalogueMutation,
  updateEquipmentCatalogueMutation,
} from './equipmentCatalogueQuery'
import { useStateValue } from '../state/useAppState'
import ValueDisplay from '../common/components/ValueDisplay'

const EquipmentCatalogueView = styled.div``

const TableHeading = styled.h5`
  font-size: 0.875rem;
  margin-top: 2rem;
  margin-bottom: 0.5rem;

  &:first-child {
    margin-top: 0;
  }
`

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

const equipmentColumnLabels = {
  vehicleId: 'Kylkinumero',
  make: 'Merkki',
  model: 'Malli',
  type: 'Tyyppi',
  percentageQuota: 'Osuus',
  emissionClass: 'Euroluokka',
  co2: 'CO2 arvo',
  registryNr: 'Rek.numero',
  registryDate: 'Rek.päivä',
}

const equipmentInputValues = {
  percentageQuota: (val) => parseFloat(val),
  emissionClass: (val) => parseInt(val, 10),
}

const defaultGetVal = (val) => val
const getType = (key) => equipmentInputValues[key] || defaultGetVal

const equipmentIsValid = (e: EquipmentInput): boolean =>
  !!(e?.make && e?.model && e?.emissionClass && e?.type && e?.percentageQuota && e?.registryDate)

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

    const [pendingEquipment, setPendingEquipment] = useState<EquipmentInput | null>(null)
    const [createEquipment] = useMutationData(createEquipmentMutation)

    const addDraftEquipment = useCallback(() => {
      const inputRow: EquipmentInput = {
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

    const onAddEquipment = useCallback(async () => {
      if (!catalogue || !pendingEquipment) {
        return
      }

      setPendingEquipment(null)

      await createEquipment({
        variables: {
          operatorId,
          equipmentInput: pendingEquipment,
          catalogueId: catalogue.id,
        },
      })

      await onCatalogueChanged()
    }, [catalogue, operatorId, onCatalogueChanged, pendingEquipment])

    const onCancelPendingEquipment = useCallback(() => {
      setPendingEquipment(null)
    }, [])

    const onRemoveEquipment = useCallback(async (item) => {
      console.log('Remove equipment WIP!')
    }, [])

    const renderEquipmentCell = useCallback((val: any, key: string, onChange) => {
      if (['id'].includes(key)) {
        return <CellContent>{val}</CellContent>
      }

      return <EquipmentFormInput value={val} valueName={key} onChange={onChange} />
    }, [])

    const equipment: EquipmentWithQuota[] = useMemo(
      () =>
        (catalogue?.equipmentQuotas || []).map((quota) => ({
          ...quota.equipment,
          percentageQuota: quota.percentageQuota,
        })),
      [catalogue]
    )

    const renderCatalogueInput = useCallback((val: any, key: string, onChange) => {
      return <EquipmentCatalogueFormInput value={val} valueName={key} onChange={onChange} />
    }, [])

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
          <>
            {equipment.length !== 0 ? (
              <>
                <TableHeading>Ajoneuvot</TableHeading>
                <Table
                  items={equipment}
                  columnLabels={equipmentColumnLabels}
                  onRemoveRow={(item) => () => onRemoveEquipment(item)}
                  getColumnTotal={(col) =>
                    col === 'percentageQuota'
                      ? equipment.reduce((total, item) => {
                          total += item?.percentageQuota
                          return total
                        }, 0) + '%'
                      : ''
                  }
                />
              </>
            ) : (
              <MessageView>Kalustoluettelossa ei ole ajoneuvoja.</MessageView>
            )}
            {!pendingEquipment && <Button onClick={addDraftEquipment}>Lisää ajoneuvo</Button>}
            {pendingEquipment && (
              <>
                <TableHeading>Lisää ajoneuvo</TableHeading>
                <ItemForm
                  item={pendingEquipment}
                  labels={equipmentColumnLabels}
                  onChange={onEquipmentInputChange}
                  onDone={onAddEquipment}
                  onCancel={onCancelPendingEquipment}
                  doneDisabled={!equipmentIsValid(pendingEquipment)}
                  doneLabel="Lisää luetteloon"
                  renderInput={renderEquipmentCell}
                />
              </>
            )}
          </>
        )}
      </EquipmentCatalogueView>
    )
  }
)

export default EquipmentCatalogue
