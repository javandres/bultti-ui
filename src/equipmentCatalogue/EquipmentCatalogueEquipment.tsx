import React, { useCallback, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { EquipmentInput } from '../schema-types'
import { useMutationData } from '../util/useMutationData'
import {
  createEquipmentMutation,
  removeEquipmentMutation,
  searchEquipmentQuery,
} from './equipmentQuery'
import Table, { CellContent } from '../common/components/Table'
import EquipmentFormInput from './EquipmentFormInput'
import { FlexRow, MessageView, SubSectionHeading } from '../common/components/common'
import { Button } from '../common/components/Button'
import ItemForm from '../common/input/ItemForm'
import { EquipmentWithQuota } from './EquipmentCatalogue'
import { useLazyQueryData } from '../util/useLazyQueryData'
import Input from '../common/input/Input'
import InputForm from '../common/input/InputForm'
import { numval } from '../util/numval'
import { emptyOrNumber } from '../util/emptyOrNumber'
import { omit } from 'lodash'

export type PropTypes = {
  equipment: EquipmentWithQuota[]
  catalogueId: string
  operatorId: number
  onEquipmentChanged: () => Promise<void>
}

const equipmentColumnLabels = {
  vehicleId: 'Kylkinumero',
  model: 'Malli',
  type: 'Tyyppi',
  percentageQuota: 'Osuus',
  emissionClass: 'Euroluokka',
  registryNr: 'Rek.numero',
  registryDate: 'Rek.päivä',
}

const equipmentInputValues = {
  percentageQuota: (val) => emptyOrNumber(numval(val, true)),
  emissionClass: (val) => emptyOrNumber(numval(val)),
}

const defaultGetVal = (val) => val
const getType = (key) => equipmentInputValues[key] || defaultGetVal

const equipmentIsValid = (e: EquipmentInput): boolean =>
  !!(e?.model && e?.emissionClass && e?.type && e?.percentageQuota && e?.registryDate)

type PendingEquipment = { _exists: boolean } & EquipmentInput

// Naming things...
const EquipmentCatalogueEquipment: React.FC<PropTypes> = observer(
  ({ equipment, catalogueId, operatorId, onEquipmentChanged }) => {
    let [pendingEquipment, setPendingEquipment] = useState<PendingEquipment | null>(null)

    let [searchActive, setSearchActive] = useState(false)
    let [searchVehicleId, setSearchVehicleId] = useState('')

    let [
      searchEquipment,
      { data: foundEquipment, loading: searchLoading, called: searchCalled },
    ] = useLazyQueryData<PendingEquipment>(searchEquipmentQuery)

    let onChangeSearchValue = useCallback((value) => {
      setSearchVehicleId(value)
    }, [])

    let [createEquipment] = useMutationData(createEquipmentMutation)
    let [removeEquipment] = useMutationData(removeEquipmentMutation)

    let doSearch = useCallback(() => {
      if (searchVehicleId) {
        searchEquipment({
          variables: {
            operatorId,
            vehicleId: searchVehicleId,
          },
        })
      }
    }, [searchEquipment, searchVehicleId, operatorId])

    let addDraftEquipment = useCallback((initialValues?: PendingEquipment) => {
      const inputRow: PendingEquipment = {
        vehicleId: initialValues?.vehicleId || '',
        model: initialValues?.model || '',
        type: initialValues?.type || '',
        exteriorColor: initialValues?.exteriorColor || '',
        emissionClass: initialValues?.emissionClass || 1,
        registryDate: initialValues?.registryDate || '',
        registryNr: initialValues?.registryNr || '',
        percentageQuota: 0,
        _exists: initialValues?._exists || false,
      }

      setPendingEquipment(inputRow)
    }, [])

    useEffect(() => {
      if (foundEquipment && searchActive) {
        setSearchActive(false)
        setSearchVehicleId('')

        if (!equipment.some((eq) => eq.vehicleId === foundEquipment?.vehicleId)) {
          addDraftEquipment(foundEquipment)
        } else {
          alert('Ajoneuvo on jo lisätty tähän kalustoluetteloon.')
        }
      }
    }, [foundEquipment, searchActive])

    const onEquipmentInputChange = useCallback((key: string, nextValue) => {
      setPendingEquipment((currentPending) =>
        !currentPending ? null : { ...currentPending, [key]: getType(key)(nextValue) }
      )
    }, [])

    const onAddEquipment = useCallback(async () => {
      if (!catalogueId || !pendingEquipment) {
        return
      }

      setPendingEquipment(null)

      await createEquipment({
        variables: {
          operatorId,
          equipmentInput: omit(pendingEquipment, '_exists'),
          catalogueId: catalogueId,
        },
      })

      await onEquipmentChanged()
    }, [catalogueId, operatorId, onEquipmentChanged, createEquipment, pendingEquipment])

    const onCancelPendingEquipment = useCallback(() => {
      setPendingEquipment(null)
    }, [])

    const onRemoveEquipment = useCallback(
      async (item) => {
        if (!item || !item.id) {
          return
        }

        await removeEquipment({
          variables: { equipmentId: item.id, catalogueId: catalogueId },
        })

        await onEquipmentChanged()
      },
      [onEquipmentChanged, removeEquipment]
    )

    const renderEquipmentCell = useCallback((val: any, key: string, onChange) => {
      if (['id'].includes(key)) {
        return <CellContent>{val}</CellContent>
      }

      return <EquipmentFormInput value={val} valueName={key} onChange={onChange} />
    }, [])

    return (
      <>
        {equipment.length !== 0 ? (
          <>
            <SubSectionHeading>Ajoneuvot</SubSectionHeading>
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
        {!pendingEquipment && (
          <FlexRow>
            <Button style={{ marginRight: '1rem' }} onClick={() => addDraftEquipment()}>
              Lisää ajoneuvo
            </Button>
            <Button onClick={() => setSearchActive(true)}>Hae ajoneuvo</Button>
          </FlexRow>
        )}
        {pendingEquipment && (
          <>
            <SubSectionHeading>Lisää ajoneuvo</SubSectionHeading>
            <ItemForm
              item={pendingEquipment}
              labels={equipmentColumnLabels}
              readOnly={
                pendingEquipment._exists
                  ? Object.keys(equipmentColumnLabels).filter((key) => key !== 'percentageQuota')
                  : false
              }
              onChange={onEquipmentInputChange}
              onDone={onAddEquipment}
              onCancel={onCancelPendingEquipment}
              doneDisabled={!equipmentIsValid(pendingEquipment)}
              doneLabel="Lisää luetteloon"
              renderInput={renderEquipmentCell}
            />
          </>
        )}
        {searchActive && (
          <>
            <SubSectionHeading>Hae kylkinumerolla</SubSectionHeading>
            <InputForm
              onCancel={() => setSearchActive(false)}
              onDone={doSearch}
              doneLabel="Hae kalusto"
              doneDisabled={!searchVehicleId}
              fields={[
                {
                  label: 'Kylkinumero',
                  field: <Input onChange={onChangeSearchValue} value={searchVehicleId} />,
                },
              ]}>
              {searchVehicleId && searchCalled && !foundEquipment && !searchLoading && (
                <MessageView>Kalustoa ei löydetty.</MessageView>
              )}
            </InputForm>
          </>
        )}
      </>
    )
  }
)

export default EquipmentCatalogueEquipment
