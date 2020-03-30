import React, { useCallback, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { FlexRow, MessageView, SubSectionHeading } from '../common/components/common'
import { Button, ButtonStyle } from '../common/components/Button'
import ItemForm, { FieldValueDisplay } from '../common/input/ItemForm'
import InputForm from '../common/input/InputForm'
import Input from '../common/input/Input'
import EquipmentFormInput from './EquipmentFormInput'
import { omit } from 'lodash'
import { useLazyQueryData } from '../util/useLazyQueryData'
import { createEquipmentMutation, searchEquipmentQuery } from './equipmentQuery'
import { useMutationData } from '../util/useMutationData'
import { emptyOrNumber } from '../util/emptyOrNumber'
import { numval } from '../util/numval'
import { EquipmentInput } from '../schema-types'
import { equipmentColumnLabels } from './CatalogueEquipment'
import { EquipmentWithQuota } from './EquipmentCatalogue'
import { removeAllEquipmentFromCatalogueMutation } from './equipmentCatalogueQuery'

export type PropTypes = {
  equipment: EquipmentWithQuota[]
  catalogueId: string
  operatorId: number
  onEquipmentChanged: () => Promise<void>
}

export const renderEquipmentInput = (key: string, val: any, onChange) => {
  if (['id'].includes(key)) {
    return <FieldValueDisplay>{val}</FieldValueDisplay>
  }

  return <EquipmentFormInput value={val} valueName={key} onChange={onChange} />
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

const EditEquipment: React.FC<PropTypes> = observer(
  ({ operatorId, equipment, catalogueId, onEquipmentChanged }) => {
    let [pendingEquipment, setPendingEquipment] = useState<PendingEquipment | null>(null)

    let [searchActive, setSearchActive] = useState(false)
    let [searchVehicleId, setSearchVehicleId] = useState('')
    let [searchRegistryNr, setSearchRegistryNr] = useState('')

    let [
      searchEquipment,
      { data: foundEquipment, loading: searchLoading, called: searchCalled },
    ] = useLazyQueryData<PendingEquipment>(searchEquipmentQuery)

    let [removeAllEquipment] = useMutationData(removeAllEquipmentFromCatalogueMutation)
    let [createEquipment] = useMutationData(createEquipmentMutation)

    let doSearch = useCallback(() => {
      if (searchVehicleId || searchRegistryNr) {
        let useSearchTerm = searchVehicleId ? 'vehicleId' : searchRegistryNr ? 'registryNr' : null
        let useSearchValue = searchVehicleId
          ? searchVehicleId
          : searchRegistryNr
          ? searchRegistryNr
          : ''

        if (useSearchTerm) {
          searchEquipment({
            variables: {
              operatorId,
              [useSearchTerm]: useSearchValue,
            },
          })
        }
      }
    }, [searchEquipment, searchVehicleId, searchRegistryNr, operatorId])

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
      if (foundEquipment && searchActive && (searchRegistryNr || searchVehicleId)) {
        setSearchActive(false)
        setSearchVehicleId('')
        setSearchRegistryNr('')

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

    const onRemoveAll = useCallback(() => {
      removeAllEquipment({
        variables: {
          catalogueId,
        },
      })
    }, [catalogueId])

    return (
      <>
        {!pendingEquipment && (
          <FlexRow>
            <Button style={{ marginRight: '1rem' }} onClick={() => addDraftEquipment()}>
              Lisää ajoneuvo
            </Button>
            <Button style={{ marginRight: '1rem' }} onClick={() => setSearchActive(true)}>
              Hae ajoneuvo
            </Button>
            {!searchActive && equipment.length !== 0 && !pendingEquipment && (
              <Button
                style={{ marginLeft: 'auto' }}
                buttonStyle={ButtonStyle.SECONDARY_REMOVE}
                onClick={onRemoveAll}>
                Poista kaikki ajoneuvot
              </Button>
            )}
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
              renderInput={renderEquipmentInput}
            />
          </>
        )}
        {searchActive && (
          <>
            <SubSectionHeading>Hae kylkinumerolla</SubSectionHeading>
            <InputForm
              onCancel={() => setSearchActive(false)}
              onDone={doSearch}
              doneLabel={`Hae kalusto${
                searchVehicleId ? ' kylkinumerolla' : searchRegistryNr ? ' rekisterinumerolla' : ''
              }`}
              doneDisabled={!searchVehicleId && !searchRegistryNr}
              fields={[
                {
                  label: 'Kylkinumero',
                  field: (
                    <Input onChange={(val) => setSearchVehicleId(val)} value={searchVehicleId} />
                  ),
                },
                {
                  label: 'Rekisterinumero',
                  field: (
                    <Input onChange={(val) => setSearchRegistryNr(val)} value={searchRegistryNr} />
                  ),
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

export default EditEquipment
