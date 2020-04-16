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
import { searchEquipmentQuery } from './equipmentQuery'
import { emptyOrNumber } from '../util/emptyOrNumber'
import { numval } from '../util/numval'
import { EquipmentInput } from '../schema-types'
import { EquipmentWithQuota } from './equipmentUtils'

type PendingEquipment = { _exists: boolean } & EquipmentInput

export type PropTypes = {
  equipment: EquipmentWithQuota[]
  operatorId: number
  onEquipmentChanged: () => unknown
  hasEquipment: (checkEquipment?: PendingEquipment) => boolean
  addEquipment: (equipmentInput: EquipmentInput) => Promise<unknown>
  removeAllEquipment: () => Promise<unknown>
  editableKeys: string[]
  fieldLabels: { [key: string]: string }
}

export const renderEquipmentInput = (
  key: string,
  val: any,
  onChange: (value: any, key: string) => unknown,
  onAccept?: () => unknown,
  onCancel?: () => unknown
) => {
  if (['id'].includes(key)) {
    return <FieldValueDisplay>{val}</FieldValueDisplay>
  }

  return (
    <EquipmentFormInput
      value={val}
      valueName={key}
      onChange={onChange}
      onAccept={onAccept}
      onCancel={onCancel}
    />
  )
}

const equipmentInputValues = {
  percentageQuota: (val) => emptyOrNumber(numval(val, true)),
  emissionClass: (val) => emptyOrNumber(numval(val)),
}

const defaultGetVal = (val) => val
const getType = (key) => equipmentInputValues[key] || defaultGetVal

const equipmentIsValid = (e: EquipmentInput): boolean =>
  !!(e?.model && e?.emissionClass && e?.type && e?.percentageQuota && e?.registryDate)

const AddEquipment: React.FC<PropTypes> = observer(
  ({
    operatorId,
    hasEquipment,
    addEquipment,
    removeAllEquipment,
    editableKeys,
    onEquipmentChanged,
    fieldLabels,
  }) => {
    let [pendingEquipment, setPendingEquipment] = useState<PendingEquipment | null>(null)

    let [searchFormVisible, setSearchFormVisible] = useState(false)
    let [searchResultActive, setSearchResultActive] = useState(false)
    let [searchVehicleId, setSearchVehicleId] = useState('')
    let [searchRegistryNr, setSearchRegistryNr] = useState('')

    let [
      searchEquipment,
      { data: foundEquipment, loading: searchLoading, called: searchCalled },
    ] = useLazyQueryData<PendingEquipment>(searchEquipmentQuery)

    let doSearch = useCallback(async () => {
      if (searchVehicleId || searchRegistryNr) {
        let useSearchTerm = searchVehicleId ? 'vehicleId' : searchRegistryNr ? 'registryNr' : null
        let useSearchValue = searchVehicleId
          ? searchVehicleId
          : searchRegistryNr
          ? searchRegistryNr
          : ''

        if (useSearchTerm) {
          await searchEquipment({
            variables: {
              operatorId,
              [useSearchTerm]: useSearchValue,
            },
          })

          setSearchResultActive(true)
        }
      }
    }, [searchEquipment, searchVehicleId, searchRegistryNr, operatorId])

    let findRandomEquipment = useCallback(async () => {
      await searchEquipment({
        variables: {
          operatorId,
        },
      })

      setSearchResultActive(true)
    }, [searchEquipment, operatorId])

    let addDraftEquipment = useCallback(
      (initialValues?: PendingEquipment) => {
        const inputRow: PendingEquipment = {
          vehicleId: initialValues?.vehicleId || '',
          model: initialValues?.model || '',
          type: initialValues?.type || '',
          exteriorColor: initialValues?.exteriorColor || '',
          emissionClass: initialValues?.emissionClass || 1,
          registryDate: initialValues?.registryDate || '',
          registryNr: initialValues?.registryNr || '',
          _exists: initialValues?._exists || false,
        }

        for (let editVal of editableKeys) {
          inputRow[editVal] = 0
        }

        setPendingEquipment(inputRow)
      },
      [editableKeys]
    )

    useEffect(() => {
      if (searchResultActive && foundEquipment) {
        setSearchFormVisible(false)
        setSearchResultActive(false)
        setSearchVehicleId('')
        setSearchRegistryNr('')

        if (!hasEquipment(foundEquipment)) {
          addDraftEquipment(foundEquipment)
        } else {
          alert('Ajoneuvo on jo lisätty.')
        }
      }
    }, [foundEquipment, searchResultActive])

    const onEquipmentInputChange = useCallback((key: string, nextValue) => {
      setPendingEquipment((currentPending) =>
        !currentPending ? null : { ...currentPending, [key]: getType(key)(nextValue) }
      )
    }, [])

    const onAddEquipment = useCallback(async () => {
      if (!pendingEquipment) {
        return
      }

      setPendingEquipment(null)
      await addEquipment(omit(pendingEquipment, '_exists'))
    }, [operatorId, addEquipment, pendingEquipment])

    const onCancelPendingEquipment = useCallback(() => {
      setPendingEquipment(null)
    }, [])

    return (
      <>
        {!pendingEquipment && (
          <FlexRow>
            <Button style={{ marginRight: '1rem' }} onClick={() => addDraftEquipment()}>
              Lisää ajoneuvo
            </Button>
            <Button style={{ marginRight: '1rem' }} onClick={() => setSearchFormVisible(true)}>
              Hae ajoneuvo
            </Button>
            <Button style={{ marginRight: '1rem' }} onClick={findRandomEquipment}>
              (DEV) Lisää satunnainen ajoneuvo
            </Button>
            {!searchFormVisible && !searchResultActive && !pendingEquipment && (
              <Button
                style={{ marginLeft: 'auto' }}
                buttonStyle={ButtonStyle.SECONDARY_REMOVE}
                onClick={removeAllEquipment}>
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
              labels={fieldLabels}
              readOnly={
                pendingEquipment._exists
                  ? Object.keys(fieldLabels || {}).filter((key) => !editableKeys.includes(key))
                  : false
              }
              onChange={onEquipmentInputChange}
              onDone={onAddEquipment}
              onCancel={onCancelPendingEquipment}
              doneDisabled={!equipmentIsValid(pendingEquipment)}
              doneLabel="Lisää"
              renderInput={renderEquipmentInput}
            />
          </>
        )}
        {searchFormVisible && (
          <>
            <SubSectionHeading>Hae kylkinumerolla</SubSectionHeading>
            <InputForm
              onCancel={() => setSearchFormVisible(false)}
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

export default AddEquipment
