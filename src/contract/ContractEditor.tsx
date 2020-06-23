import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Contract, ContractInput } from '../schema-types'
import ItemForm, { FieldLabel, FieldValueDisplay } from '../common/input/ItemForm'
import { useMutationData } from '../util/useMutationData'
import {
  contractsQuery,
  createContractMutation,
  modifyContractMutation,
} from './contractQueries'
import { TextArea, TextInput } from '../common/input/Input'
import SelectDate from '../common/input/SelectDate'
import SelectOperator from '../common/input/SelectOperator'
import ContractRuleEditor, { createRuleInput } from './ContractRuleEditor'
import ContractProcurementUnitsEditor from './ContractProcurementUnitsEditor'
import ExpandableSection, {
  ContentWrapper,
  HeaderBoldHeading,
  HeaderRow,
} from '../common/components/ExpandableSection'
import { get, orderBy } from 'lodash'
import { pickGraphqlData } from '../util/pickGraphqlData'
import ContractUsers from './ContractUsers'

const ContractEditorView = styled.div``

const ExpandableFormSection = styled(ExpandableSection)`
  background: transparent;
  margin-top: 0;

  ${HeaderRow} {
    border-radius: 0.5rem;
  }

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
  onCancel?: () => unknown
  onRefresh?: () => unknown
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
  ({ contract, onCancel, isNew = false, editable }: PropTypes) => {
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
            'contractProcurementUnitOptions',
          ]
        },
      }
    )

    let [createContract, { loading: createLoading }] = useMutationData(
      createContractMutation,
      {
        update: (cache, { data: { createContract } }) => {
          let { contracts = [] } =
            cache.readQuery({
              query: contractsQuery,
              variables: { operatorId: createContract?.operatorId },
            }) || {}

          cache.writeQuery({
            query: contractsQuery,
            variables: { operatorId: createContract?.operatorId },
            data: { contracts: [...contracts, createContract] },
          })
        },
      }
    )

    let isLoading = modifyLoading || createLoading

    let onDone = useCallback(async () => {
      if (pendingContractValid) {
        let mutationFn = isNew ? createContract : modifyContract

        let result = await mutationFn({
          variables: {
            contractInput: pendingContract,
          },
        })

        let nextContract = pickGraphqlData(result.data)

        if (nextContract) {
          setPendingContract(createContractInput(nextContract))
        }

        if (isNew && onCancel) {
          onCancel()
        }
      }
    }, [pendingContract, pendingContractValid, onCancel, isNew])

    let onCancelEdit = useCallback(() => {
      setPendingContract(createContractInput(contract))

      if (onCancel) {
        onCancel()
      }
    }, [contract, onCancel])

    return (
      <ContractEditorView>
        <ContractUsersEditor contractId={contract.id} />
        <ItemForm
          item={pendingContract}
          hideKeys={['id']}
          labels={formLabels}
          onChange={onChange}
          onDone={onDone}
          onCancel={onCancelEdit}
          frameless={true}
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
