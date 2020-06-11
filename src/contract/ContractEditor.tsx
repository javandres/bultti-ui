import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Contract, ContractInput } from '../schema-types'
import ItemForm from '../common/input/ItemForm'
import { useMutationData } from '../util/useMutationData'
import {
  contractsQuery,
  createContractMutation,
  modifyContractMutation,
} from './contractQueries'
import { TextArea, TextInput } from '../common/input/Input'
import SelectDate from '../common/input/SelectDate'
import SelectOperator from '../common/input/SelectOperator'
import ContractRuleEditor from './ContractRuleEditor'
import ContractProcurementUnitsEditor from './ContractProcurementUnitsEditor'

const ContractEditorView = styled.div``

export type PropTypes = {
  contract: Contract
  onCancel?: () => unknown
  isNew?: boolean
}

function createContractInput(contract: Contract): ContractInput {
  return {
    id: contract.id,
    description: contract.description,
    startDate: contract.startDate,
    endDate: contract.endDate,
    operatorId: contract.operatorId,
    procurementUnitIds: (contract?.procurementUnits || []).map((pu) => pu.id),
    rules: contract?.rules || [],
  }
}

const renderEditorField = (contract: Contract) => (
  key: string,
  val: any,
  onChange: (val: any) => void
) => {
  if (key === 'description') {
    return (
      <TextArea
        value={val}
        theme="light"
        onChange={(e) => onChange(e.target.value)}
        name={key}
        style={{ width: '100%' }}
      />
    )
  }

  if (key === 'rules') {
    return <ContractRuleEditor contract={contract} />
  }

  if (key === 'procurementUnitIds') {
    return <ContractProcurementUnitsEditor contract={contract} onChange={onChange} />
  }

  if (['startDate', 'endDate'].includes(key)) {
    return <SelectDate name={key} value={val} onChange={onChange} />
  }

  if (key === 'operatorId') {
    let onChangeOperator = (operator) => onChange(operator?.id || operator)
    return <SelectOperator value={val} onSelect={onChangeOperator} />
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

const ContractEditor = observer(({ contract, onCancel, isNew = false }: PropTypes) => {
  let [pendingContract, setPendingContract] = useState(createContractInput(contract))

  let pendingContractValid = useMemo(
    () => !!pendingContract.startDate && !!pendingContract.endDate,
    [pendingContract]
  )

  let onChange = useCallback((key, nextValue) => {
    setPendingContract((currentVal) => ({
      ...currentVal,
      [key]: nextValue,
    }))
  }, [])

  let [modifyContract, { data: nextContract, loading: modifyLoading }] = useMutationData(
    modifyContractMutation
  )

  let [createContract, { loading: createLoading }] = useMutationData(createContractMutation, {
    update: (cache, { data: { createContract } }) => {
      let { contracts } = cache.readQuery({ query: contractsQuery }) || {}

      cache.writeQuery({
        query: contractsQuery,
        data: { contracts: [...contracts, createContract] },
      })
    },
  })

  let isLoading = modifyLoading || createLoading

  useEffect(() => {
    if (nextContract && !isLoading) {
      setPendingContract(createContractInput(nextContract))
    }
  }, [nextContract])

  let onDone = useCallback(async () => {
    if (pendingContractValid) {
      let mutationFn = isNew ? createContract : modifyContract

      await mutationFn({
        variables: {
          contractInput: pendingContract,
        },
      })

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
      <ItemForm
        item={pendingContract}
        hideKeys={['id']}
        labels={formLabels}
        onChange={onChange}
        onDone={onDone}
        onCancel={onCancelEdit}
        frameless={true}
        loading={isLoading}
        doneDisabled={!pendingContractValid}
        fullWidthFields={['actions', 'rules', 'procurementUnitIds']}
        renderInput={renderEditorField(contract)}
      />
    </ContractEditorView>
  )
})

export default ContractEditor
