import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Contract, ContractInput } from '../schema-types'
import ItemForm, { FieldLabel, FieldValueDisplay } from '../common/input/ItemForm'
import { useMutationData } from '../util/useMutationData'
import {
  contractQuery,
  contractsQuery,
  createContractMutation,
  modifyContractMutation,
  procurementUnitOptionsQuery,
  removeContractMutation,
} from './contractQueries'
import { ErrorView } from '../common/components/Messages'
import { TextArea, TextInput } from '../common/input/Input'
import SelectDate from '../common/input/SelectDate'
import SelectOperator from '../common/input/SelectOperator'
import ContractProcurementUnitsEditor from './ContractProcurementUnitsEditor'
import ExpandableSection, {
  ContentWrapper,
  HeaderBoldHeading,
} from '../common/components/ExpandableSection'
import { get, orderBy } from 'lodash'
import { pickGraphqlData } from '../util/pickGraphqlData'
import ContractUsers from './ContractUsers'
import { useContractPage } from './contractUtils'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { FlexRow } from '../common/components/common'
import FileUploadInput from '../common/input/FileUploadInput'
import { useUploader } from '../util/useUploader'
import { SubHeading } from '../common/components/Typography'
import Table from '../common/components/Table'

const ContractEditorView = styled.div`
  padding: 0 1rem;
`

const ExpandableFormSection = styled(ExpandableSection)`
  margin-top: 0;

  ${ContentWrapper} {
    padding: 0;
  }
`

const ContractUsersEditor = styled(ContractUsers)`
  margin-top: 0;
  margin-bottom: 2rem;
`

const ExpandableFormSectionHeading = styled(HeaderBoldHeading)`
  padding: 0.75rem;
`

export type PropTypes = {
  contract: Contract
  onReset: () => unknown
  onRefresh: () => unknown
  isNew?: boolean
  editable: boolean
}

function createContractInput(contract: Contract): ContractInput {
  return {
    id: contract.id,
    description: contract.description,
    startDate: contract.startDate,
    endDate: contract.endDate,
    operatorId: contract.operatorId,
    rulesFile: contract.rulesFile,
    procurementUnitIds: orderBy(
      (contract?.procurementUnits || []).map((pu) => pu.id),
      'procurementUnitId'
    ),
  }
}

const renderEditorField = (
  contract: ContractInput,
  rulesInputActive,
  toggleRulesInput,
  contractFileReadError
) => (
  key: string,
  val: any,
  onChange: (val: any) => void,
  readOnly: boolean,
  loading: boolean = false,
  onCancel?: () => unknown
) => {
  if (key === 'rules') {
    return (
      <>
        <div style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
          <Button onClick={toggleRulesInput}>Lataa uudet ehdot</Button>
        </div>
        {rulesInputActive && (
          <FileUploadInput
            label="Lataa sopimusehdot"
            onChange={onChange}
            value={val.uploadFile}
            disabled={readOnly}
            onReset={onCancel}
            loading={loading}
          />
        )}
        {contractFileReadError && (
          <ErrorView>
            Toml-tiedoston lukeminen epäonnistui. Palvelimen antaman virhe:{' '}
            {contractFileReadError}`
          </ErrorView>
        )}
        <ExpandableFormSection
          style={{ marginTop: '1rem' }}
          headerContent={
            <ExpandableFormSectionHeading>Nykyiset ehdot</ExpandableFormSectionHeading>
          }>
          <div style={{ padding: '1rem 1rem 0' }}>
            <SubHeading>
              Tiedosto: <strong>{contract.rulesFile}</strong>
            </SubHeading>
            <Table
              columnLabels={{
                name: 'Nimi',
                value: 'Arvo',
                condition: 'Ehto',
                category: 'Kategoria',
              }}
              items={val.currentRules}
            />
          </div>
        </ExpandableFormSection>
      </>
    )
  }

  if (key === 'procurementUnitIds') {
    return (
      <ExpandableFormSection
        headerContent={
          <ExpandableFormSectionHeading>Kilpailukohteet</ExpandableFormSectionHeading>
        }>
        <ContractProcurementUnitsEditor
          readOnly={readOnly}
          contract={contract}
          onChange={onChange}
        />
      </ExpandableFormSection>
    )
  }

  if (key === 'operatorId') {
    let onChangeOperator = (operator) => onChange(operator?.id || operator)
    let opVal = val || contract.operatorId

    return (
      <SelectOperator
        useUnselected={false}
        disabled={readOnly}
        style={{ color: 'var(--dark-grey)' }}
        value={opVal}
        onSelect={onChangeOperator}
      />
    )
  }

  if (readOnly) {
    return <FieldValueDisplay>{val}</FieldValueDisplay>
  }

  if (key === 'description') {
    return (
      <TextArea
        value={val || ''}
        theme="light"
        onChange={(e) => onChange(e.target.value)}
        name={key}
        style={{ width: '100%' }}
      />
    )
  }

  if (['startDate', 'endDate'].includes(key)) {
    return <SelectDate name={key} value={val} onChange={onChange} />
  }

  return (
    <TextInput
      type="text"
      theme="light"
      value={val}
      onChange={(e) => onChange(e.target.value)}
      name={key}
    />
  )
}

let formLabels = {
  startDate: 'Sopimusehdot alkaa',
  endDate: 'Sopimusehdot loppuu',
  description: 'Kuvaus',
  operatorId: 'Liikennöitsijä',
  procurementUnitIds: 'Kilpailukohteet',
  rules: 'Sopimusehdot',
}

const renderEditorLabel = (key, val, labels) => {
  if (['procurementUnitIds'].includes(key)) {
    return false
  }

  return <FieldLabel>{get(labels, key, key)}</FieldLabel>
}

const ContractEditor = observer(
  ({ contract, onReset, onRefresh, isNew = false, editable }: PropTypes) => {
    let [pendingContract, setPendingContract] = useState(createContractInput(contract))
    let [rulesFileValue, setRulesFile] = useState<File[]>([])
    let [rulesInputActive, setRulesInputActive] = useState(!pendingContract?.rulesFile)

    let isDirty = useMemo(() => {
      // New contracts are always dirty
      if (isNew) {
        return true
      }

      if (rulesFileValue.length !== 0) {
        return true
      }

      let pendingJson = JSON.stringify(pendingContract)
      let currentJson = JSON.stringify(createContractInput(contract))
      return currentJson !== pendingJson
    }, [rulesFileValue, pendingContract, contract])

    useEffect(() => {
      if (contract) {
        setPendingContract(createContractInput(contract))
      }
    }, [contract])

    let pendingContractValid = useMemo(
      () =>
        (!isNew || (isNew && rulesFileValue.length !== 0)) &&
        !!pendingContract?.startDate &&
        !!pendingContract?.endDate,
      [isNew, pendingContract, rulesFileValue]
    )

    let onChange = useCallback((key, nextValue) => {
      if (key === 'rules') {
        setRulesFile(nextValue)
        return
      }

      setPendingContract((currentVal) => {
        let nextProcurementUnits =
          key === 'procurementUnitIds' ? nextValue : currentVal?.procurementUnitIds || []

        // Reset procurement units if operatorId changes.
        if (key === 'operatorId') {
          nextProcurementUnits = []
        }

        return {
          ...currentVal,
          [key]: nextValue,
          procurementUnitIds: nextProcurementUnits,
        }
      })
    }, [])

    let [
      modifyContract,
      { loading: modifyLoading, mutationFn: updateMutationFn, error: modifyError },
    ] = useUploader(modifyContractMutation, {
      refetchQueries: ({ data }) => {
        let mutationResult = pickGraphqlData(data)

        return [
          { query: contractsQuery, variables: { operatorId: mutationResult?.operatorId } },
          { query: contractQuery, variables: { contractId: mutationResult?.id } },
          {
            query: procurementUnitOptionsQuery,
            variables: {
              operatorId: mutationResult?.operatorId,
              startDate: mutationResult?.startDate,
              endDate: mutationResult?.endDate,
            },
          },
        ]
      },
    })

    let [createContract, { loading: createLoading, error: createError }] = useUploader(
      createContractMutation,
      {
        refetchQueries: [
          { query: contractsQuery, variables: { operatorId: pendingContract.operatorId } },
        ],
      }
    )

    let currentError = useMemo(() => (createError || modifyError)?.message, [
      modifyError,
      createError,
    ])

    let isLoading = modifyLoading || createLoading
    let goToContract = useContractPage()

    let onDone = useCallback(async () => {
      if (pendingContractValid) {
        let result

        if (rulesFileValue.length !== 0) {
          let mutationFn = isNew ? createContract : modifyContract
          let rulesFile = rulesFileValue[0]

          result = await mutationFn(rulesFile, {
            variables: {
              contractInput: pendingContract,
            },
          })
        } else {
          result = await updateMutationFn({
            variables: {
              contractInput: pendingContract,
            },
          })
        }

        if (isNew) {
          onReset()
        }

        setRulesFile([])

        if (result.data) {
          if (!isNew) {
            setPendingContract(createContractInput(result.data))
          } else {
            goToContract(result.data.id)
          }
        }
      }
    }, [rulesFileValue, pendingContract, pendingContractValid, onReset, isNew, goToContract])

    let onCancel = useCallback(() => {
      setPendingContract(createContractInput(contract))
      setRulesFile([])
      onReset()
    }, [contract, onReset])

    let [removeContract, { loading: removeLoading }] = useMutationData(removeContractMutation)

    let execRemove = useCallback(async () => {
      if (!isNew && confirm('Haluatko varmasti poistaa sopimuksen?')) {
        let result = await removeContract({
          variables: {
            contractId: contract.id,
          },
        })

        if (pickGraphqlData(result.data)) {
          onRefresh()
        }
      }
    }, [removeContract, contract, isNew, onRefresh])

    let onToggleRulesInput = useCallback(() => {
      setRulesInputActive((currentlyActive) => !currentlyActive)
    }, [])

    return (
      <ContractEditorView>
        <FlexRow style={{ marginTop: '-0.5rem', marginBottom: '1rem' }}>
          <Button
            loading={removeLoading}
            style={{ marginLeft: 'auto', marginRight: 0 }}
            buttonStyle={ButtonStyle.REMOVE}
            size={ButtonSize.MEDIUM}
            onClick={execRemove}>
            Poista
          </Button>
        </FlexRow>
        {!isNew && <ContractUsersEditor contractId={contract.id} />}
        <ItemForm
          item={{
            ...pendingContract,
            rules: { uploadFile: rulesFileValue, currentRules: contract?.rules || [] },
          }}
          hideKeys={['id', 'rulesFile']}
          labels={formLabels}
          onChange={onChange}
          onDone={onDone}
          onCancel={onCancel}
          loading={isLoading}
          readOnly={!editable}
          doneDisabled={!pendingContractValid}
          isDirty={isDirty}
          fullWidthFields={['actions', 'rules', 'procurementUnitIds']}
          renderLabel={renderEditorLabel}
          renderInput={renderEditorField(
            pendingContract,
            rulesInputActive,
            onToggleRulesInput,
            currentError
          )}
        />
      </ContractEditorView>
    )
  }
)

export default ContractEditor
