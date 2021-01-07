import React, { useCallback, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { FlexRow } from '../common/components/common'
import { Button, ButtonStyle } from '../common/components/Button'
import ItemForm, { ActionsWrapper } from '../common/input/ItemForm'
import InputForm from '../common/input/InputForm'
import Input, { TextArea, TextInput } from '../common/input/Input'
import EquipmentFormInput from './EquipmentFormInput'
import { omit } from 'lodash'
import { useLazyQueryData } from '../util/useLazyQueryData'
import { searchEquipmentQuery } from './equipmentQuery'
import { emptyOrNumber } from '../util/emptyOrNumber'
import { numval } from '../util/numval'
import { EquipmentInput } from '../schema-types'
import { EquipmentWithQuota } from './equipmentUtils'
import Modal from '../common/components/Modal'
import styled from 'styled-components'
import { MessageView } from '../common/components/Messages'
import { SubHeading } from '../common/components/Typography'
import { text, Text } from '../util/translate'

const AddEquipmentFormWrapper = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 0.5rem;
`

type PendingEquipment = { _exists: boolean } & EquipmentInput

export type PropTypes = {
  equipment: EquipmentWithQuota[]
  operatorId: number
  onEquipmentChanged: () => unknown
  hasEquipment: (checkEquipment?: PendingEquipment) => boolean
  addEquipment: (equipmentInput: EquipmentInput) => Promise<unknown>
  addBatchEquipment?: (batchInput: string) => Promise<unknown>
  removeAllEquipment?: () => Promise<unknown>
  removeLabel?: string
  editableKeys: string[]
  fieldLabels: { [key: string]: string }
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
    addBatchEquipment,
    removeAllEquipment,
    removeLabel = text('catalogue.remove_all_equipment'),
    editableKeys,
    onEquipmentChanged,
    fieldLabels,
  }) => {
    let [pendingEquipment, setPendingEquipment] = useState<PendingEquipment | null>(null)
    let [batchInput, setBatchInput] = useState<string>('')

    let [searchFormVisible, setSearchFormVisible] = useState(false)
    let [batchFormVisible, setBatchFormVisible] = useState(false)
    let [searchResultActive, setSearchResultActive] = useState(false)
    let [searchVehicleId, setSearchVehicleId] = useState('')
    let [searchRegistryNr, setSearchRegistryNr] = useState('')

    let [
      searchEquipment,
      { data: foundEquipment, loading: searchLoading, called: searchCalled },
    ] = useLazyQueryData<PendingEquipment>(searchEquipmentQuery)

    let doSearch = useCallback(async () => {
      if (searchVehicleId || searchRegistryNr) {
        let useSearchTerm = searchVehicleId
          ? 'vehicleId'
          : searchRegistryNr
          ? 'registryNr'
          : null
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

    let onAddBatchEquipment = useCallback(async () => {
      if (batchInput && addBatchEquipment) {
        setBatchInput('')
        setBatchFormVisible(false)
        await addBatchEquipment(batchInput)
      }
    }, [batchInput, addBatchEquipment])

    return (
      <>
        {!pendingEquipment && (
          <FlexRow>
            <Button style={{ marginRight: '1rem' }} onClick={() => addDraftEquipment()}>
              <Text>catalogue.add_equipment</Text>
            </Button>
            {addBatchEquipment && (
              <Button
                style={{ marginRight: '1rem' }}
                onClick={() => setBatchFormVisible(true)}>
                <Text>catalogue.batch_add_equipment</Text>
              </Button>
            )}
            <Button style={{ marginRight: '1rem' }} onClick={() => setSearchFormVisible(true)}>
              <Text>catalogue.find.equipment</Text>
            </Button>
            <Button style={{ marginRight: '1rem' }} onClick={findRandomEquipment}>
              (DEV) Lisää satunnainen ajoneuvo
            </Button>
            {removeAllEquipment &&
              !batchFormVisible &&
              !searchFormVisible &&
              !searchResultActive &&
              !pendingEquipment && (
                <Button
                  style={{ marginLeft: 'auto' }}
                  buttonStyle={ButtonStyle.SECONDARY_REMOVE}
                  onClick={removeAllEquipment}>
                  {removeLabel}
                </Button>
              )}
          </FlexRow>
        )}
        {pendingEquipment && (
          <Modal>
            <AddEquipmentFormWrapper>
              <SubHeading>
                <Text>catalogue.add_equipment</Text>
              </SubHeading>
              <ItemForm
                item={pendingEquipment}
                labels={fieldLabels}
                readOnly={
                  pendingEquipment._exists
                    ? Object.keys(fieldLabels || {}).filter(
                        (key) => !editableKeys.includes(key)
                      )
                    : false
                }
                onChange={onEquipmentInputChange}
                onDone={onAddEquipment}
                onCancel={onCancelPendingEquipment}
                doneDisabled={!equipmentIsValid(pendingEquipment)}
                doneLabel={text('general.app.add')}
                renderInput={(key, val, onChange) => (
                  <EquipmentFormInput
                    fieldComponent={TextInput}
                    value={val}
                    valueName={key}
                    onChange={onChange}
                  />
                )}
              />
            </AddEquipmentFormWrapper>
          </Modal>
        )}
        {batchFormVisible && addBatchEquipment && (
          <>
            <SubHeading>
              <Text>catalogue.batch_add_equipment</Text>
            </SubHeading>
            <p>
              Liitä tekstikenttään lista ajoneuvojen kylkinumeroita jotka haluat lisätä tähän
              kalustoluetteloon. Kylkinumerot tulee olla yksi per rivi.
            </p>
            <TextArea
              theme="light"
              value={batchInput}
              onChange={(e) => setBatchInput(e.target.value)}
              style={{ width: '100%' }}
              name="equipmentbatch"
            />
            <ActionsWrapper style={{ marginTop: '1rem' }}>
              <Button
                disabled={!batchInput}
                style={{ marginRight: '1rem' }}
                onClick={onAddBatchEquipment}>
                <Text>catalogue.batch_add_equipment</Text>
              </Button>
              <Button
                buttonStyle={ButtonStyle.SECONDARY_REMOVE}
                onClick={() => setBatchFormVisible(false)}>
                <Text>general.app.cancel</Text>
              </Button>
            </ActionsWrapper>
          </>
        )}
        {searchFormVisible && (
          <>
            <SubHeading>
              <Text>catalogue.find.equipment</Text>
            </SubHeading>
            <InputForm
              onCancel={() => setSearchFormVisible(false)}
              onDone={doSearch}
              doneLabel={`${text('catalogue.find.equipment')}${
                searchVehicleId
                  ? ' ' + text('catalogue.find.by_vehicle_id')
                  : searchRegistryNr
                  ? ' ' + text('catalogue.find.by_registry_number')
                  : ''
              }`}
              doneDisabled={!searchVehicleId && !searchRegistryNr}
              fields={[
                {
                  label: text('catalogue.vehicle_id'),
                  field: (
                    <Input
                      onChange={(val) => setSearchVehicleId(val)}
                      value={searchVehicleId}
                    />
                  ),
                },
                {
                  label: text('catalogue.registry_number'),
                  field: (
                    <Input
                      onChange={(val) => setSearchRegistryNr(val)}
                      value={searchRegistryNr}
                    />
                  ),
                },
              ]}>
              {searchVehicleId && searchCalled && !foundEquipment && !searchLoading && (
                <MessageView>
                  <Text>catalogue.equipment_not_found</Text>
                </MessageView>
              )}
            </InputForm>
          </>
        )}
      </>
    )
  }
)

export default AddEquipment
