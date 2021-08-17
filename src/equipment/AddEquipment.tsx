import React, { useCallback, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { FlexRow } from '../common/components/common'
import { Button, ButtonStyle } from '../common/components/buttons/Button'
import { ActionsWrapper } from '../common/input/ItemForm'
import InputForm from '../common/input/InputForm'
import Input, { TextArea } from '../common/input/Input'
import { useLazyQueryData } from '../util/useLazyQueryData'
import { searchEquipmentQuery } from './equipmentQuery'
import { EquipmentWithQuota } from './equipmentUtils'
import Modal from '../common/components/Modal'
import styled from 'styled-components/macro'
import { MessageView } from '../common/components/Messages'
import { SubHeading } from '../common/components/Typography'
import { text, Text } from '../util/translate'
import { Equipment } from '../schema-types'
import ValueDisplay from '../common/components/ValueDisplay'
import { DEBUG } from '../constants'
import { useShowErrorNotification } from '../util/useShowNotification'

const AddEquipmentFormWrapper = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 0.5rem;
`

export type PropTypes = {
  equipment: EquipmentWithQuota[]
  operatorId: number
  onEquipmentChanged: () => unknown
  hasEquipment: boolean
  addEquipment: (equipmentId: string, quota?: number) => Promise<unknown>
  addBatchEquipment?: (batchInput: string) => Promise<unknown>
  removeAllEquipment?: () => Promise<unknown>
  removeLabel?: string
  editableKeys: string[]
  fieldLabels: { [key: string]: string }
  updateQuota?: boolean
}

const AddEquipment: React.FC<PropTypes> = observer(
  ({
    operatorId,
    hasEquipment,
    addEquipment,
    addBatchEquipment,
    removeAllEquipment,
    removeLabel = text('catalogue_removeAllEquipment'),
    editableKeys,
    onEquipmentChanged,
    fieldLabels,
    updateQuota,
  }) => {
    let [quotaInput, setQuotaInput] = useState<number>(0)
    let [batchInput, setBatchInput] = useState<string>('')

    let [searchFormVisible, setSearchFormVisible] = useState(false)
    let [batchFormVisible, setBatchFormVisible] = useState(false)
    let [searchResultActive, setSearchResultActive] = useState(false)
    let [searchVehicleId, setSearchVehicleId] = useState('')
    let [searchRegistryNr, setSearchRegistryNr] = useState('')

    let [
      searchEquipment,
      { data: foundEquipment, loading: searchLoading, called: searchCalled, error },
    ] = useLazyQueryData<Equipment>(searchEquipmentQuery, {
      fetchPolicy: 'network-only',
    })

    let showError = useShowErrorNotification()

    useEffect(() => {
      if (error) {
        showError(error.message)
      }
    }, [error, showError])

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
          searchEquipment({
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
      searchEquipment({
        variables: {
          operatorId,
        },
      })

      setSearchResultActive(true)
    }, [searchEquipment, operatorId])

    const onAddEquipment = useCallback(async () => {
      if (foundEquipment) {
        await addEquipment(foundEquipment.id, quotaInput)
        setQuotaInput(0)
        setSearchResultActive(false)
        setSearchRegistryNr('')
        setSearchVehicleId('')
      }
    }, [addEquipment, foundEquipment, quotaInput])

    let onAddBatchEquipment = useCallback(async () => {
      if (batchInput && addBatchEquipment) {
        setBatchInput('')
        setBatchFormVisible(false)
        await addBatchEquipment(batchInput)
      }
    }, [batchInput, addBatchEquipment])

    let onCancel = useCallback(() => {
      setBatchFormVisible(false)
      setQuotaInput(0)
      setSearchResultActive(false)
      setSearchFormVisible(false)
    }, [])

    return (
      <>
        <FlexRow style={{ marginTop: '1rem' }}>
          {addBatchEquipment && (
            <Button style={{ marginRight: '1rem' }} onClick={() => setBatchFormVisible(true)}>
              <Text>catalogue_batchAddEquipment</Text>
            </Button>
          )}
          <Button style={{ marginRight: '1rem' }} onClick={() => setSearchFormVisible(true)}>
            <Text>catalogue_findEquipment</Text>
          </Button>
          {DEBUG && (
            <Button style={{ marginRight: '1rem' }} onClick={findRandomEquipment}>
              (DEV) Lisää satunnainen ajoneuvo
            </Button>
          )}
          {removeAllEquipment && !searchResultActive && hasEquipment && (
            <Button
              style={{ marginLeft: 'auto' }}
              buttonStyle={ButtonStyle.SECONDARY_REMOVE}
              onClick={removeAllEquipment}>
              {removeLabel}
            </Button>
          )}
        </FlexRow>
        {foundEquipment && searchResultActive && (
          <Modal>
            <AddEquipmentFormWrapper>
              <SubHeading>
                <Text>catalogue_addEquipment</Text>
              </SubHeading>
              <ValueDisplay item={foundEquipment} labels={fieldLabels} />
              {updateQuota && (
                <FlexRow style={{ marginTop: '1rem' }}>
                  <Input
                    label="% Osuus"
                    type="number"
                    step={0.01}
                    value={quotaInput + ''}
                    onChange={(val) => setQuotaInput(parseFloat(val))}
                  />
                </FlexRow>
              )}
              <ActionsWrapper style={{ marginTop: '0.5rem' }}>
                <Button
                  buttonStyle={ButtonStyle.ACCEPT}
                  onClick={onAddEquipment}
                  style={{ marginRight: '1rem' }}>
                  <Text>catalogue_addEquipment</Text>
                </Button>
                <Button buttonStyle={ButtonStyle.SECONDARY_REMOVE} onClick={onCancel}>
                  <Text>cancel</Text>
                </Button>
              </ActionsWrapper>
            </AddEquipmentFormWrapper>
          </Modal>
        )}
        {batchFormVisible && addBatchEquipment && (
          <>
            <SubHeading>
              <Text>catalogue_batchAddEquipment</Text>
            </SubHeading>
            <Text>equipment_batchAddEquipment</Text>
            <TextArea
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
                <Text>catalogue_batchAddEquipment</Text>
              </Button>
              <Button buttonStyle={ButtonStyle.SECONDARY_REMOVE} onClick={onCancel}>
                <Text>cancel</Text>
              </Button>
            </ActionsWrapper>
          </>
        )}
        {searchFormVisible && (
          <>
            <SubHeading>
              <Text>catalogue_findEquipment</Text>
            </SubHeading>
            <InputForm
              onCancel={() => setSearchFormVisible(false)}
              onDone={doSearch}
              doneLabel={text('catalogue_findByVehicleIdAndRegistryNumber', {
                searchType: searchVehicleId
                  ? text('with_vehicleId')
                  : searchRegistryNr
                  ? text('with_registryNr')
                  : '',
                searchValue: searchVehicleId || searchRegistryNr,
              })}
              doneDisabled={!searchVehicleId && !searchRegistryNr}
              fields={[
                {
                  label: text('vehicleId'),
                  field: (
                    <Input
                      onChange={(val) => setSearchVehicleId(val)}
                      value={searchVehicleId}
                    />
                  ),
                },
                {
                  label: text('registryNumber'),
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
                  <Text>catalogue_equipmentNotFound</Text>
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
