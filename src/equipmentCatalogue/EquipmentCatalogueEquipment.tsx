import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Equipment, EquipmentInput } from '../schema-types'
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

// Naming things...
const EquipmentCatalogueEquipment: React.FC<PropTypes> = observer(
  ({ equipment, catalogueId, operatorId, onEquipmentChanged }) => {
    let [pendingEquipment, setPendingEquipment] = useState<EquipmentInput | null>(null)
    let [searchActive, setSearchActive] = useState(false)
    let [searchVehicleId, setSearchVehicleId] = useState('')

    let onChangeSearchValue = useCallback((value) => {
      setSearchVehicleId(value)
    }, [])

    let [createEquipment] = useMutationData(createEquipmentMutation)
    let [removeEquipment] = useMutationData(removeEquipmentMutation)
    let [searchEquipment, { data: foundEquipment }] = useLazyQueryData<
      Equipment
    >(searchEquipmentQuery)

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

    let addDraftEquipment = useCallback((initialValues?: Equipment | EquipmentInput) => {
      const inputRow: EquipmentInput = {
        vehicleId: initialValues?.vehicleId || '',
        model: initialValues?.model || '',
        type: initialValues?.type || '',
        exteriorColor: initialValues?.exteriorColor || '',
        emissionClass: initialValues?.emissionClass || 1,
        registryDate: initialValues?.registryDate || '',
        registryNr: initialValues?.registryNr || '',
        percentageQuota: 0,
      }

      setPendingEquipment(inputRow)
    }, [])

    useEffect(() => {
      if (foundEquipment && searchActive) {
        setSearchActive(false)
        setSearchVehicleId('')
        addDraftEquipment(foundEquipment)
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
          equipmentInput: pendingEquipment,
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
            <Button onClick={() => addDraftEquipment()}>Lisää ajoneuvo</Button>
            <Button onClick={() => setSearchActive(true)}>Hae ja liitä ajoneuvo</Button>
          </FlexRow>
        )}
        {pendingEquipment && (
          <>
            <SubSectionHeading>Lisää ajoneuvo</SubSectionHeading>
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
              ]}
            />
          </>
        )}
      </>
    )
  }
)

export default EquipmentCatalogueEquipment
