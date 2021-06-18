import React, { useCallback, useMemo, useState } from 'react'
import styled, { css } from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import {
  Contract,
  EquipmentCatalogue as EquipmentCatalogueType,
  ProcurementUnit as ProcurementUnitType,
  ProcurementUnitEditInput,
} from '../schema-types'
import { orderBy } from 'lodash'
import EquipmentCatalogue from '../equipmentCatalogue/EquipmentCatalogue'
import { isBetween } from '../util/isBetween'
import { useQueryData } from '../util/useQueryData'
import { procurementUnitQuery, updateProcurementUnitMutation } from './procurementUnitsQuery'
import { LoadingDisplay } from '../common/components/Loading'
import { parseISO } from 'date-fns'
import ProcurementUnitExecutionRequirement from '../executionRequirement/ProcurementUnitExecutionRequirement'
import { SubHeading } from '../common/components/Typography'
import { MessageView } from '../common/components/Messages'
import EditEquipmentCatalogue from '../equipmentCatalogue/EditEquipmentCatalogue'
import { text, Text } from '../util/translate'
import ExpandableSection, { HeaderSection } from '../common/components/ExpandableSection'
import DateRangeDisplay from '../common/components/DateRangeDisplay'
import { useMutationData } from '../util/useMutationData'
import { numval } from '../util/numval'
import ItemForm from '../common/input/ItemForm'
import { TextInput } from '../common/input/Input'
import ValueDisplay from '../common/components/ValueDisplay'
import { Button } from '../common/components/buttons/Button'
import { LinkButton } from '../common/components/buttons/LinkButton'
import { useNavigate } from '../util/urlValue'

const procurementUnitLabels = {
  medianAgeRequirement: text('procurementUnit_ageRequirement'),
  calculatedMedianAgeRequirement: text('procurementUnit_ageRequirementCalculated'),
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
  displayedContractUnitId?: string
  requirementsEditable: boolean
  isVisible: boolean
  catalogueInvalid: boolean
  requirementsInvalid: boolean
}

const ProcurementUnitItemContent = observer(
  ({
    showExecutionRequirements,
    startDate,
    endDate,
    procurementUnitId,
    isCatalogueEditable,
    displayedContractUnitId,
    requirementsEditable,
    isVisible,
    catalogueInvalid,
    requirementsInvalid,
  }: ContentPropTypes) => {
    let unitQueryVariables = {
      procurementUnitId,
      startDate,
      endDate,
    }

    // Get the operating units for the selected operator.
    const { data: procurementUnit, loading, refetch } =
      useQueryData<ProcurementUnitType>(procurementUnitQuery, {
        skip: !procurementUnitId || !isVisible,
        variables: unitQueryVariables,
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
        },
        refetchQueries: [
          {
            query: procurementUnitQuery,
            variables: unitQueryVariables,
          },
        ],
      }
    )

    // Find the currently active Equipment Catalogue for the Operating Unit
    const catalogues: EquipmentCatalogueType[] = useMemo(() => {
      let unitCatalogues = procurementUnit?.equipmentCatalogues || []

      return isCatalogueEditable
        ? unitCatalogues
        : unitCatalogues.filter((cat) => isBetween(startDate, cat.startDate, cat.endDate))
    }, [procurementUnit, isCatalogueEditable, startDate])

    let hasEquipment = catalogues
      .filter((cat) => isBetween(startDate, cat.startDate, cat.endDate))
      .some((cat) => cat.equipmentQuotas?.length !== 0)

    let [medianAgeValue, setMedianAgeValue] = useState('')
    let [unitEditable, setUnitEditable] = useState(false)

    let onEditProcurementUnit = useCallback(() => {
      if (!unitEditable) {
        setMedianAgeValue((procurementUnit?.medianAgeRequirement || 0) + '')
      }

      setUnitEditable((cur) => !cur)
    }, [unitEditable, procurementUnit])

    let onCancelEdit = useCallback(() => {
      setUnitEditable(false)
    }, [])

    let onChangeProcurementUnit = useCallback(
      (key, nextValue) => {
        if (key === 'medianAgeRequirement') {
          setMedianAgeValue(nextValue)
        }
      },
      [medianAgeValue]
    )

    const onSaveProcurementUnit = useCallback(async () => {
      let unitInput: ProcurementUnitEditInput = {
        medianAgeRequirement: numval(medianAgeValue, true),
      }

      await updateProcurementUnit({
        variables: {
          updatedData: unitInput,
        },
      })

      setUnitEditable(false)
    }, [medianAgeValue, isCatalogueEditable])

    const inspectionStartDate = useMemo(() => parseISO(startDate), [startDate])

    let isDirty = useMemo(
      () => procurementUnit?.medianAgeRequirement !== numval(medianAgeValue, true),
      [procurementUnit, medianAgeValue]
    )

    let renderProcurementItemInput = useCallback((key: string, val: unknown, onChange) => {
      return (
        <TextInput
          type="number"
          value={val as string}
          onChange={(e) => onChange(e.target.value)}
        />
      )
    }, [])

    let calcMedianAgeRequirement = useMemo(() => {
      let optionsUsed = procurementUnit?.optionsUsed || 0
      let medianAgeRequirement = procurementUnit?.medianAgeRequirement || 0
      return medianAgeRequirement + 0.5 * optionsUsed
    }, [procurementUnit])

    let navigate = useNavigate()

    const onOpenContract = useCallback(
      (contractId) => {
        return navigate.push(`/contract/${contractId}`)
      },
      [navigate]
    )

    return (
      <ContentWrapper>
        <LoadingDisplay loading={loading} />
        <div style={{ marginBottom: '1rem' }}>
          {procurementUnit && (
            <>
              <SubHeading>
                <Text>contracts</Text>
              </SubHeading>
              {procurementUnit.currentContracts?.map((contract: Contract, index: number) => {
                return (
                  <LinkButton
                    key={`contract-${index}`}
                    onClick={() => onOpenContract(contract.id)}
                    style={{
                      fontWeight: displayedContractUnitId === contract.id ? 'bold' : 'unset',
                    }}>
                    {contract.startDate} - {contract.endDate}
                  </LinkButton>
                )
              })}
            </>
          )}
          {!unitEditable ? (
            <ValueDisplay
              renderValue={(key, val) => `${val} vuotta`}
              item={{
                medianAgeRequirement: procurementUnit?.medianAgeRequirement,
                calculatedMedianAgeRequirement: calcMedianAgeRequirement,
              }}
              labels={procurementUnitLabels}>
              <Button
                style={{ marginLeft: 'auto', marginTop: 'auto' }}
                onClick={onEditProcurementUnit}>
                <Text>edit</Text>
              </Button>
            </ValueDisplay>
          ) : (
            <ItemForm
              item={{ medianAgeRequirement: medianAgeValue }}
              labels={procurementUnitLabels}
              onChange={onChangeProcurementUnit}
              onDone={onSaveProcurementUnit}
              onCancel={onCancelEdit}
              isDirty={isDirty}
              doneLabel={text('save')}
              renderInput={renderProcurementItemInput}
            />
          )}
        </div>
        {procurementUnit && (
          <>
            {showExecutionRequirements && hasEquipment && (
              <ProcurementUnitExecutionRequirement
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
      </ContentWrapper>
    )
  }
)

export default ProcurementUnitItemContent
