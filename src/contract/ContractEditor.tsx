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
  removeContractMutation,
} from './contractQueries'
import { TextArea, TextInput } from '../common/input/Input'
import SelectDate from '../common/input/SelectDate'
import SelectOperator from '../common/input/SelectOperator'
import ContractRuleEditor, { createRuleInput } from './ContractRuleEditor'
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
    procurementUnitIds: orderBy(
      (contract?.procurementUnits || []).map((pu) => pu.id),
      'procurementUnitId'
    ),
    rules: orderBy((contract?.rules || []).map(createRuleInput), 'name'),
  }
}

const renderEditorField = (contract: ContractInput) => (
  key: string,
  val: any,
  onChange: (val: any) => void,
  readOnly: boolean
) => {
  if (key === 'rules') {
    return (
      <ExpandableFormSection
        headerContent={<ExpandableFormSectionHeading>Säännöt</ExpandableFormSectionHeading>}>
        <ContractRuleEditor readOnly={readOnly} contract={contract} onChange={onChange} />
      </ExpandableFormSection>
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
    return (
      <SelectOperator
        useUnselected={false}
        disabled={readOnly}
        style={{ color: 'var(--dark-grey)' }}
        value={val}
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
  startDate: 'Sopimus alkaa',
  endDate: 'Sopimus loppuu',
  description: 'Kuvaus',
  operatorId: 'Liikennöitsijä',
  procurementUnitIds: 'Kilpailukohteet',
  rules: 'Sopimuksen säännöt',
}

const renderEditorLabel = (key, val, labels) => {
  if (['rules', 'procurementUnitIds'].includes(key)) {
    return false
  }

  return <FieldLabel>{get(labels, key, key)}</FieldLabel>
}

const ContractEditor = observer(
  ({ contract, onReset, onRefresh, isNew = false, editable }: PropTypes) => {
    let [pendingContract, setPendingContract] = useState(createContractInput(contract))

    let isDirty = useMemo(() => {
      // New contracts are always dirty
      if (isNew) {
        return true
      }

      let pendingJson = JSON.stringify(pendingContract)
      let currentJson = JSON.stringify(createContractInput(contract))
      return currentJson !== pendingJson
    }, [pendingContract, contract])

    useEffect(() => {
      if (contract) {
        setPendingContract(createContractInput(contract))
      }
    }, [contract])

    let pendingContractValid = useMemo(
      () => !!pendingContract?.startDate && !!pendingContract?.endDate,
      [pendingContract]
    )

    let onChange = useCallback((key, nextValue) => {
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

    let [modifyContract, { loading: modifyLoading }] = useMutationData(
      modifyContractMutation,
      {
        refetchQueries: ({ data }) => {
          let mutationResult = pickGraphqlData(data)
          return [
            { query: contractsQuery, variables: { operatorId: mutationResult?.operatorId } },
            { query: contractQuery, variables: { contractId: mutationResult?.id } },
            'contractProcurementUnitOptions',
          ]
        },
      }
    )

    let [createContract, { loading: createLoading }] = useMutationData(
      createContractMutation,
      {
        update: (cache, { data: { createContract } }) => {
          let { contract } =
            cache.readQuery({
              query: contractsQuery,
              variables: { operatorId: createContract?.operatorId },
            }) || {}

          if (contract) {
            cache.writeQuery({
              query: contractQuery,
              variables: { contractId: createContract.id },
              data: { contract: createContract },
            })
          }
        },
      }
    )

    let isLoading = modifyLoading || createLoading

    let goToContract = useContractPage()

    let onDone = useCallback(async () => {
      if (pendingContractValid) {
        let mutationFn = isNew ? createContract : modifyContract

        let result = await mutationFn({
          variables: {
            contractInput: pendingContract,
          },
        })

        onReset()

        let nextContract = pickGraphqlData(result.data)

        if (nextContract) {
          if (!isNew) {
            setPendingContract(createContractInput(nextContract))
          } else {
            goToContract(nextContract.id)
          }
        }
      }
    }, [pendingContract, pendingContractValid, onReset, isNew, goToContract])

    let onCancelEdit = useCallback(() => {
      setPendingContract(createContractInput(contract))
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
          item={pendingContract}
          hideKeys={['id']}
          labels={formLabels}
          onChange={onChange}
          onDone={onDone}
          onCancel={onCancelEdit}
          loading={isLoading}
          readOnly={!editable}
          doneDisabled={!pendingContractValid}
          fullWidthFields={['actions', 'rules', 'procurementUnitIds']}
          renderLabel={renderEditorLabel}
          renderInput={renderEditorField(pendingContract)}
          showButtons={isDirty}
        />
      </ContractEditorView>
    )
  }
)

export default ContractEditor
