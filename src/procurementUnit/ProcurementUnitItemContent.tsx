import React, { useCallback, useMemo, useState } from 'react'
import styled, { css } from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import {
  Contract,
  EquipmentCatalogue as EquipmentCatalogueType,
  OptionMaxAgeIncreaseMethod,
  ProcurementUnit as ProcurementUnitType,
  ProcurementUnitEditInput,
} from '../schema-types'
import { isEqual, lowerCase, orderBy, pick } from 'lodash'
import EquipmentCatalogue from '../equipmentCatalogue/EquipmentCatalogue'
import { isBetween } from '../util/compare'
import { useQueryData } from '../util/useQueryData'
import { procurementUnitQuery, updateProcurementUnitMutation } from './procurementUnitsQuery'
import Loading, { LoadingDisplay } from '../common/components/Loading'
import { isBefore, nextMonday, subISOWeekYears } from 'date-fns'
import ProcurementUnitExecutionRequirement from '../executionRequirement/ProcurementUnitExecutionRequirement'
import { SubHeading } from '../common/components/Typography'
import { ErrorView, MessageView } from '../common/components/Messages'
import EditEquipmentCatalogue from '../equipmentCatalogue/EditEquipmentCatalogue'
import { text, Text } from '../util/translate'
import ExpandableSection, { HeaderSection } from '../common/components/ExpandableSection'
import DateRangeDisplay from '../common/components/DateRangeDisplay'
import { useMutationData } from '../util/useMutationData'
import ItemForm from '../common/input/ItemForm'
import { TextInput } from '../common/input/Input'
import ValueDisplay from '../common/components/ValueDisplay'
import { Button } from '../common/components/buttons/Button'
import { LinkButton } from '../common/components/buttons/LinkButton'
import { useNavigate } from '../util/urlValue'
import { useHasAdminAccessRights } from '../util/userRoles'
import DatePicker from '../common/input/DatePicker'
import Dropdown from '../common/input/Dropdown'
import { getDateObject, getDateString, getReadableDate } from '../util/formatDate'
import { contractOptionsQuery } from '../contract/contractQueries'

const procurementUnitLabels = {
  maximumAverageAge: text('procurementUnit_ageRequirement'),
  calculatedMaximumAgeRequirement: text('procurementUnit_ageRequirementWithOptions'),
  optionMaxAgeIncreaseMethod: text('procurementUnit_optionMaxAgeIncreaseMethod'),
  optionPeriodStart: text('procurementUnit_optionPeriodStart'),
  contractId: text('contract'),
}

const ContentWrapper = styled.div`
  position: relative;
`

const CatalogueWrapper = styled.div<{ isInvalid: boolean }>`
  border-radius: 0.5rem;
  position: relative;

  ${(p) =>
    p.isInvalid
      ? css`
          border: 1px solid #ffacac;
          padding: 1rem;
          margin: 1rem -0.5rem -0.5rem;
          background: rgba(255, 252, 252, 1);
        `
      : ''}
`

type ContentPropTypes = {
  showExecutionRequirements: boolean
  startDate: string
  endDate: string
  procurementUnitId: string
  isCatalogueEditable: boolean
  requirementsEditable: boolean
  isVisible: boolean
  catalogueInvalid: boolean
  requirementsInvalid: boolean
  isOnlyActiveCatalogueVisible: boolean
  testId?: string
}

const renderFormWithContracts =
  (contracts: Contract[] = []) =>
  (key: string, val: unknown, onChange: (val: unknown) => void) => {
    let inputKey = key as keyof ProcurementUnitEditInput

    if (inputKey === 'optionPeriodStart') {
      return (
        <DatePicker
          testId="option_period_start_input"
          isEmptyValueAllowed={true}
          value={val as string}
          onChange={onChange}
        />
      )
    }

    if (inputKey === 'optionMaxAgeIncreaseMethod') {
      return (
        <Dropdown
          onSelect={onChange}
          selectedItem={val as string}
          items={Object.values(OptionMaxAgeIncreaseMethod)}
          itemToLabel={(option) =>
            text(`procurementUnit_optionMaxAgeIncreaseMethod_${option}`)
          }
        />
      )
    }

    if (inputKey === 'contractId') {
      return (
        <Dropdown<Partial<Contract>>
          unselectedValue={{ id: '', description: text('selectContract') }}
          onSelect={(contract) => onChange(contract?.id || undefined)}
          selectedItem={contracts.find((c) => c.id === val)}
          items={contracts}
          itemToLabel={(contract) => contract?.description || contract?.createdAt || ''}
          itemToString={(contract) => contract?.id || ''}
        />
      )
    }

    return (
      <TextInput
        data-cy="maximum_average_age"
        type="number"
        value={val as string}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    )
  }

function renderValueDisplayValue(key: string, val: unknown) {
  if (['maximumAverageAge', 'calculatedMaximumAgeRequirement'].includes(key)) {
    return `${val} ${lowerCase(text('procurementUnit_ageRequirementYears'))}`
  }

  if (key === 'optionMaxAgeIncreaseMethod') {
    return text(`procurementUnit_optionMaxAgeIncreaseMethod_${val as string}`)
  }

  if (key === 'optionPeriodStart') {
    return <span data-cy="option_period_start_value">{`${val}`}</span>
  }

  return val as string
}

const ProcurementUnitItemContent = observer(
  ({
    showExecutionRequirements,
    startDate,
    endDate,
    procurementUnitId,
    isCatalogueEditable,
    requirementsEditable,
    isVisible,
    catalogueInvalid,
    requirementsInvalid,
    isOnlyActiveCatalogueVisible,
    testId,
  }: ContentPropTypes) => {
    let unitQueryVariables = {
      procurementUnitId,
      startDate,
      endDate,
    }

    let hasAdminAccessRights = useHasAdminAccessRights()

    const {
      data: procurementUnit,
      loading,
      refetch,
    } = useQueryData<ProcurementUnitType>(procurementUnitQuery, {
      skip: !procurementUnitId || !isVisible,
      variables: unitQueryVariables,
      fetchPolicy: 'cache-and-network',
    }) || {}

    let updateViewData = useCallback(() => {
      refetch()
    }, [refetch])

    const [updateProcurementUnit] = useMutationData<ProcurementUnitEditInput>(
      updateProcurementUnitMutation,
      {
        variables: {
          procurementUnitId,
          updatedData: null,
          startDate,
        },
        refetchQueries: ['procurementUnit'],
      }
    )

    // Find the currently active Equipment Catalogue for the Operating Unit
    const catalogues: EquipmentCatalogueType[] = useMemo(() => {
      let unitCatalogues = procurementUnit?.equipmentCatalogues || []

      return isOnlyActiveCatalogueVisible
        ? unitCatalogues.filter((cat) => isBetween(startDate, cat.startDate, cat.endDate))
        : unitCatalogues
    }, [procurementUnit, isOnlyActiveCatalogueVisible, startDate])

    let hasEquipment = catalogues
      .filter((cat) => isBetween(startDate, cat.startDate, cat.endDate))
      .some((cat) => cat.equipmentQuotas?.length !== 0)

    let [procurementUnitInputValues, setProcurementUnitInputValues] =
      useState<ProcurementUnitEditInput>({
        optionMaxAgeIncreaseMethod: procurementUnit?.optionMaxAgeIncreaseMethod,
        maximumAverageAge: procurementUnit?.maximumAverageAge,
        optionPeriodStart: procurementUnit?.optionPeriodStart,
        contractId: procurementUnit?.contract?.id,
      })

    let [isUnitEditable, setIsUnitEditable] = useState(false)

    const inspectionStartDate = useMemo(() => getDateObject(startDate), [startDate])

    let onEditProcurementUnit = useCallback(() => {
      if (!isUnitEditable && procurementUnit) {
        let defaultOptionStartDate: Date | undefined = undefined

        if (procurementUnit.optionsUsed) {
          // Create a default option period start date based on the end date of the unit and
          // the options used.
          defaultOptionStartDate = nextMonday(
            // The end date of the unit usually contains the option years, so subtract them.
            subISOWeekYears(
              getDateObject(procurementUnit.endDate),
              procurementUnit.optionsUsed
            )
          )
        }
        // If the option period has not started yet, it would be confusing to suggest a default start date.
        if (defaultOptionStartDate && isBefore(inspectionStartDate, defaultOptionStartDate)) {
          defaultOptionStartDate = undefined
        }

        setProcurementUnitInputValues({
          optionMaxAgeIncreaseMethod: procurementUnit.optionMaxAgeIncreaseMethod,
          maximumAverageAge: procurementUnit.maximumAverageAge,
          optionPeriodStart:
            procurementUnit.optionPeriodStart ||
            getDateString(defaultOptionStartDate) ||
            undefined,
          contractId: procurementUnit.contract?.id,
        })
      }

      setIsUnitEditable((currentValue) => !currentValue)
    }, [isUnitEditable, procurementUnit, inspectionStartDate])

    let onCancelEdit = useCallback(() => {
      setIsUnitEditable(false)
    }, [])

    let onChangeProcurementUnit = useCallback((key, nextValue) => {
      setProcurementUnitInputValues((currentValues) => {
        let nextValues = { ...currentValues }
        if (key === 'maximumAverageAge' && !nextValue) {
          nextValues[key] = 1
        } else {
          nextValues[key] = nextValue || null
        }
        return nextValues
      })
    }, [])

    const onSaveProcurementUnit = useCallback(async () => {
      if (!hasAdminAccessRights) {
        return
      }

      await updateProcurementUnit({
        variables: {
          updatedData: procurementUnitInputValues,
        },
      })

      setIsUnitEditable(false)
    }, [procurementUnitInputValues, isCatalogueEditable, hasAdminAccessRights])

    let isDirty = useMemo(
      () =>
        !isEqual(
          pick(procurementUnit, Object.keys(procurementUnitInputValues)),
          procurementUnitInputValues
        ),
      [procurementUnit, procurementUnitInputValues]
    )

    let navigate = useNavigate()

    const onOpenContract = useCallback(
      (contractId) => {
        return navigate.push(`/contract/${contractId}`)
      },
      [navigate]
    )

    let { data: contractOptionData } = useQueryData<Contract[]>(contractOptionsQuery)

    let contractOptions = useMemo(
      () => orderBy(contractOptionData || [], ['createdAt', 'updatedAt'], ['desc', 'desc']),
      [contractOptionData]
    )

    let renderInput = renderFormWithContracts(!hasAdminAccessRights ? [] : contractOptions)
    let contract = procurementUnit?.contract ? procurementUnit.contract : undefined

    return (
      <ContentWrapper>
        <LoadingDisplay loading={loading} />
        {!loading && (
          <>
            <div style={{ marginBottom: '2rem' }}>
              <SubHeading>
                <Text>procurementUnit_unitInfo</Text>
              </SubHeading>
              {!hasAdminAccessRights || !isUnitEditable ? (
                <ValueDisplay
                  testId="unit_config_display"
                  renderValue={renderValueDisplayValue}
                  item={{
                    maximumAverageAge: procurementUnit?.maximumAverageAge,
                    calculatedMaximumAgeRequirement:
                      procurementUnit?.maximumAverageAgeWithOptions,
                    optionMaxAgeIncreaseMethod: procurementUnit?.optionMaxAgeIncreaseMethod,
                    optionPeriodStart: procurementUnit?.optionPeriodStart
                      ? getReadableDate(getDateObject(procurementUnit.optionPeriodStart))
                      : text('procurementUnit_noOptions'),
                  }}
                  labels={procurementUnitLabels}>
                  {hasAdminAccessRights && (
                    <Button
                      data-cy="edit_unit_config"
                      style={{ marginLeft: 'auto', marginTop: 'auto' }}
                      onClick={onEditProcurementUnit}>
                      <Text>edit</Text>
                    </Button>
                  )}
                </ValueDisplay>
              ) : (
                <ItemForm
                  testId="unit_config_form"
                  item={procurementUnitInputValues}
                  labels={procurementUnitLabels}
                  onChange={onChangeProcurementUnit}
                  onDone={onSaveProcurementUnit}
                  onCancel={onCancelEdit}
                  isDirty={isDirty}
                  doneLabel={text('save')}
                  renderInput={renderInput}
                />
              )}
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <SubHeading>
                <Text>contracts</Text>
              </SubHeading>
              {contract && hasAdminAccessRights ? (
                <LinkButton
                  data-cy="unit_contract_button"
                  onClick={() => onOpenContract(contract?.id)}>
                  <div>
                    <strong>{contract.description}</strong> ({lowerCase(text('edited'))}{' '}
                    {getReadableDate(contract.updatedAt)})
                  </div>
                </LinkButton>
              ) : contract ? (
                <MessageView data-cy="unit_contract_button">
                  <strong>{contract.description}</strong> ({lowerCase(text('edited'))}{' '}
                  {getReadableDate(contract.updatedAt)})
                </MessageView>
              ) : procurementUnit && !contract ? (
                <ErrorView>
                  <Text>contractPage_noContracts</Text>
                </ErrorView>
              ) : (
                <Loading />
              )}
            </div>
            {procurementUnit && (
              <>
                {showExecutionRequirements && hasEquipment && (
                  <ProcurementUnitExecutionRequirement
                    testId={`${testId}_requirements`}
                    isEditable={requirementsEditable}
                    procurementUnit={procurementUnit}
                    valid={!requirementsInvalid}
                  />
                )}
                <CatalogueWrapper isInvalid={catalogueInvalid}>
                  <SubHeading>
                    <Text>catalogue_cataloguesListHeading</Text>
                  </SubHeading>
                  {orderBy(catalogues, 'startDate', 'desc').map((catalogue) => {
                    return (
                      <ExpandableSection
                        testId="unit_equipment_catalogue_section"
                        isExpanded={false}
                        key={catalogue.id}
                        headerContent={
                          <HeaderSection>
                            <DateRangeDisplay
                              startDate={catalogue.startDate}
                              endDate={catalogue.endDate}
                            />
                          </HeaderSection>
                        }>
                        <EquipmentCatalogue
                          startDate={inspectionStartDate}
                          procurementUnit={procurementUnit}
                          catalogue={catalogue}
                          operatorId={procurementUnit.operatorId}
                          onCatalogueChanged={updateViewData}
                          isCatalogueEditable={isCatalogueEditable}
                        />
                      </ExpandableSection>
                    )
                  })}
                  {catalogues.length === 0 && (
                    <MessageView>
                      <Text>procurementUnit_noCatalogueForUnit</Text>
                    </MessageView>
                  )}
                  {isCatalogueEditable && (
                    <EditEquipmentCatalogue
                      onChange={updateViewData}
                      procurementUnit={procurementUnit}
                    />
                  )}
                </CatalogueWrapper>
              </>
            )}
          </>
        )}
      </ContentWrapper>
    )
  }
)

export default ProcurementUnitItemContent
