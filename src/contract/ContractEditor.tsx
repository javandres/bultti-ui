import React, { useCallback, useMemo, useState, useEffect } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { Contract, ContractInput, Operator } from '../schema-types'
import ItemForm, { FieldLabel, FieldValueDisplay } from '../common/input/ItemForm'
import { useMutationData } from '../util/useMutationData'
import {
  contractsQuery,
  createContractMutation,
  modifyContractMutation,
  procurementUnitOptionsQuery,
  removeContractMutation,
} from './contractQueries'
import { addYears } from 'date-fns'
import { useStateValue } from '../state/useAppState'
import { ErrorView } from '../common/components/Messages'
import Input, { TextArea, TextInput } from '../common/input/Input'
import SelectDate from '../common/input/SelectDate'
import ContractProcurementUnitsEditor from './ContractProcurementUnitsEditor'
import ExpandableSection, {
  ContentWrapper,
  HeaderBoldHeading,
} from '../common/components/ExpandableSection'
import { get, isEqual, orderBy } from 'lodash'
import { pickGraphqlData } from '../util/pickGraphqlData'
import ContractUsers from './ContractUsers'
import { useContractPage } from './contractUtils'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { FlexRow } from '../common/components/common'
import FileUploadInput from '../common/input/FileUploadInput'
import { useUploader } from '../util/useUploader'
import { SubHeading } from '../common/components/Typography'
import { text, Text } from '../util/translate'
import { navigateWithQueryString } from '../util/urlValue'
import { getDateString } from '../util/formatDate'
import PagedTable from '../common/table/PagedTable'
import { ApolloError } from '@apollo/client'

const ContractEditorView = styled.div``

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
  contract?: Contract
  onRefresh: () => unknown
  isNew?: boolean
  editable: boolean
}

function createContractInput(contract: Partial<Contract>): ContractInput {
  return {
    id: contract.id,
    description: contract.description ? contract.description : '',
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

const renderInput = ({
  contract,
  operatorName,
  contractFileReadError,
  isNew,
}: {
  contract: ContractInput
  operatorName: string
  contractFileReadError?: string
  isNew: boolean
}) => (
  key: string,
  val: any,
  onChange: (val: any) => void,
  readOnly: boolean,
  loading: boolean = false,
  onCancel?: () => unknown
) => {
  if (key === 'rules') {
    let isRulesFileSet = !!contract.rulesFile

    return (
      <>
        {!readOnly && (
          <>
            <FileUploadInput
              label={text('contractForm_labelUploadRules')}
              onChange={onChange}
              value={val.uploadFile}
              disabled={readOnly}
              onReset={onCancel}
              loading={loading}
            />
            {contractFileReadError && (
              <ErrorView>
                <Text>contractForm_tomlReadError</Text>
                {contractFileReadError}`
              </ErrorView>
            )}
          </>
        )}
        <ExpandableFormSection
          isExpanded={readOnly}
          style={{ marginTop: '1rem' }}
          headerContent={
            <ExpandableFormSectionHeading>
              <Text>contractForm_currentContract</Text>
            </ExpandableFormSectionHeading>
          }>
          <div style={{ padding: '1rem 1rem 0' }}>
            <SubHeading>
              {isRulesFileSet ? (
                <strong>{`Tiedosto ${contract.rulesFile}`}</strong>
              ) : (
                <Text>contractForm_noLoadedContractFile</Text>
              )}
            </SubHeading>
            {isRulesFileSet && (
              <PagedTable
                columnLabels={{
                  name: text('name'),
                  value: text('value'),
                  condition: text('contractForm_condition'),
                  category: text('contractForm_category'),
                  code: text('contractForm_code'),
                }}
                items={val.currentRules}
              />
            )}
          </div>
        </ExpandableFormSection>
      </>
    )
  }

  if (key === 'procurementUnitIds') {
    if (isNew) {
      return <React.Fragment />
    }

    return (
      <ExpandableFormSection
        headerContent={
          <ExpandableFormSectionHeading>
            <Text>procurementUnits</Text>
          </ExpandableFormSectionHeading>
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
    return <Input disabled={true} style={{ color: 'var(--dark-grey)' }} value={operatorName} />
  }

  if (readOnly) {
    return <FieldValueDisplay>{val}</FieldValueDisplay>
  }

  if (key === 'description') {
    return (
      <TextArea
        value={val || ''}
        onChange={(e) => onChange(e.target.value)}
        name={key}
        style={{ width: '100%' }}
      />
    )
  }

  if (key === 'startDate') {
    return <SelectDate name={key} value={val} onChange={onChange} maxDate={contract.endDate} />
  }

  if (key === 'endDate') {
    return (
      <SelectDate name={key} value={val} onChange={onChange} minDate={contract.startDate} />
    )
  }

  return (
    <TextInput type="text" value={val} onChange={(e) => onChange(e.target.value)} name={key} />
  )
}

let formLabels = {
  startDate: text('contractForm_labelStartDate'),
  endDate: text('contractForm_labelEndDate'),
  description: text('contractForm_labelDescription'),
  operatorId: text('contractForm_labelOperatorId'),
  procurementUnitIds: text('procurementUnits'),
  rules: text('contracts'),
}

const renderLabel = (key, val, labels) => {
  if (['procurementUnitIds'].includes(key)) {
    return false
  }

  return <FieldLabel>{get(labels, key, key)}</FieldLabel>
}

const ContractEditor = observer(
  ({ contract, onRefresh, isNew = false, editable }: PropTypes) => {
    let [globalOperator] = useStateValue<Operator>('globalOperator')
    let [, setErrorMessage] = useStateValue('errorMessage')
    let initialContract: ContractInput = useMemo(() => {
      if (isNew) {
        let newContract: Partial<Contract> = {
          operatorId: globalOperator?.id,
          operator: globalOperator,
          startDate: getDateString(new Date()),
          endDate: getDateString(addYears(new Date(), 1)),
        }
        return createContractInput(newContract)
      } else {
        return createContractInput(contract!)
      }
    }, [isNew, contract, globalOperator])

    let resetChanges = useCallback(() => {
      setPendingContract(initialContract)
    }, [initialContract])
    let [pendingContract, setPendingContract] = useState<ContractInput>(initialContract)

    useEffect(() => {
      if (isNew && pendingContract.operatorId !== globalOperator.operatorId) {
        setPendingContract({
          ...pendingContract,
          operatorId: globalOperator.operatorId,
        })
      }
    }, [globalOperator && globalOperator.operatorId, isNew])

    let [rulesFiles, setRulesFiles] = useState<File[]>([])

    let isDirty = useMemo(() => {
      if (!editable) {
        return false
      }

      // New contracts are always dirty
      if (isNew) {
        return true
      }

      if (rulesFiles.length !== 0) {
        return true
      }

      return !isEqual(pendingContract, createContractInput(contract!))
    }, [rulesFiles, pendingContract, contract, editable])

    let pendingContractValid = useMemo(
      () =>
        (!isNew || (isNew && rulesFiles.length !== 0)) &&
        !!pendingContract?.startDate &&
        !!pendingContract?.endDate,
      [isNew, pendingContract, rulesFiles]
    )

    let onChange = useCallback(
      (key, nextValue) => {
        if (!editable) {
          return
        }

        if (key === 'rules') {
          setRulesFiles(nextValue)
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
      },
      [editable]
    )

    let [
      modifyContract,
      { loading: modifyLoading, mutationFn: updateMutationFn, uploadError: modifyError },
    ] = useUploader(modifyContractMutation, {
      onCompleted: (data) => {
        let mutationResult = pickGraphqlData(data)

        if (mutationResult) {
          setPendingContract(createContractInput(mutationResult))
        }
      },
      refetchQueries: ({ data }) => {
        let mutationResult = pickGraphqlData(data)

        return [
          { query: contractsQuery, variables: { operatorId: mutationResult?.operatorId } },
          {
            query: procurementUnitOptionsQuery,
            variables: {
              operatorId: mutationResult?.operatorId,
              startDate: mutationResult?.startDate,
              endDate: mutationResult?.endDate,
              contractId: pendingContract.id,
            },
          },
        ]
      },
    })

    let [createContract, { loading: createLoading, uploadError: createError }] = useUploader(
      createContractMutation,
      {
        refetchQueries: [
          { query: contractsQuery, variables: { operatorId: pendingContract.operatorId } },
        ],
      }
    )
    let contractFileReadError = useMemo(() => (createError || modifyError)?.message, [
      modifyError,
      createError,
    ])

    let isLoading = modifyLoading || createLoading
    let goToContract = useContractPage()

    let onDone = useCallback(async () => {
      if (!editable) {
        return
      }

      if (pendingContractValid) {
        let result

        if (rulesFiles.length !== 0) {
          let rulesFile = rulesFiles[0]
          if (isNew) {
            result = await createContract(rulesFile, {
              variables: {
                contractInput: pendingContract,
              },
            })
          } else {
            result = await modifyContract(rulesFile, {
              variables: {
                contractInput: pendingContract,
                operatorId: globalOperator.operatorId,
              },
            })
          }
        } else {
          result = await updateMutationFn({
            variables: {
              contractInput: pendingContract,
              operatorId: globalOperator.operatorId,
            },
          }).catch((error: ApolloError) => {
            setErrorMessage(error.message)
          })
        }

        if (isNew) {
          resetChanges()
        }

        setRulesFiles([])

        if (result?.data && isNew) {
          goToContract(result.data?.id)
        }
      }
    }, [rulesFiles, pendingContract, pendingContractValid, isNew, goToContract, editable])

    let onCancel = useCallback(() => {
      setPendingContract(initialContract)
      setRulesFiles([])
      resetChanges()
    }, [contract, resetChanges])

    let [removeContract, { loading: removeLoading }] = useMutationData<Contract>(
      removeContractMutation,
      {
        refetchQueries: [
          {
            query: contractsQuery,
            variables: {
              operatorId: contract ? contract.operatorId : null,
            },
          },
        ],
      }
    )

    let execRemoveContract = useCallback(async () => {
      if (!editable) {
        return
      }

      if (isNew) {
        // Go back to the previous page
        navigateWithQueryString('/contract', { replace: true })
        return
      }
      if (confirm(text('contractForm_removeConfirm'))) {
        let result = await removeContract({
          variables: {
            contractId: contract!.id,
            operatorId: globalOperator.operatorId,
          },
        })

        if (result.errors && result.errors.length !== 0) {
          return
        }

        // Go back to the previous page
        navigateWithQueryString('/contract', { replace: true })
      }
    }, [removeContract, contract, isNew, onRefresh, editable])

    return (
      <ContractEditorView>
        {editable && (
          <FlexRow style={{ margin: '1rem' }}>
            <Button
              loading={removeLoading}
              style={{ marginLeft: 'auto', marginRight: 0 }}
              buttonStyle={ButtonStyle.REMOVE}
              size={ButtonSize.MEDIUM}
              onClick={execRemoveContract}>
              <Text>remove</Text>
            </Button>
          </FlexRow>
        )}
        {!isNew && <ContractUsersEditor contractId={contract!.id} />}
        <ItemForm
          item={{
            ...pendingContract,
            rules: { uploadFile: rulesFiles, currentRules: contract?.rules || [] },
          }}
          hideKeys={['id', 'rulesFile']}
          labels={formLabels}
          onChange={onChange}
          onDone={onDone}
          onCancel={onCancel}
          loading={isLoading}
          readOnly={!editable}
          showButtons={editable}
          doneDisabled={!pendingContractValid}
          isDirty={isDirty}
          fullWidthFields={['actions', 'rules', 'procurementUnitIds']}
          renderLabel={renderLabel}
          renderInput={renderInput({
            contractFileReadError,
            isNew,
            contract: pendingContract,
            operatorName: contract
              ? contract.operator.operatorName
              : globalOperator.operatorName,
          })}
        />
      </ContractEditorView>
    )
  }
)

export default ContractEditor
