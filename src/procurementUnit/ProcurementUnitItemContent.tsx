import React, { useCallback, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import { observer } from 'mobx-react-lite'
import {
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
import { Button } from '../common/components/Button'

const procurementUnitLabels = {
  medianAgeRequirement: 'Keski-ikä vaatimus',
  calculatedMedianAgeRequirement: 'Laskettu keski-ikä vaatimus + optiovuodet',
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
  catalogueEditable: boolean
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
    catalogueEditable,
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

    let updateUnit = useCallback(() => {
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

      return catalogueEditable
        ? unitCatalogues
        : unitCatalogues.filter((cat) => isBetween(startDate, cat.startDate, cat.endDate))
    }, [procurementUnit, catalogueEditable, startDate])

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
    }, [medianAgeValue, catalogueEditable])

    const inspectionStartDate = useMemo(() => parseISO(startDate), [startDate])

    let isDirty = useMemo(
      () => procurementUnit?.medianAgeRequirement !== numval(medianAgeValue, true),
      [procurementUnit, medianAgeValue]
    )

    let renderProcurementItemInput = useCallback((key: string, val: any, onChange) => {
      return <TextInput type="number" value={val} onChange={(e) => onChange(e.target.value)} />
    }, [])

    let calcMedianAgeRequirement = useMemo(() => {
      let optionsUsed = procurementUnit?.optionsUsed || 0
      let medianAgeRequirement = procurementUnit?.medianAgeRequirement || 0
      return medianAgeRequirement + 0.5 * optionsUsed
    }, [procurementUnit])

    return (
      <ContentWrapper>
        <LoadingDisplay loading={loading} />
        <div style={{ marginBottom: '1rem' }}>
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
                <Text>general.app.edit</Text>
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
              doneLabel={text('general.app.save')}
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
                <Text>catalogue.catalogues_list_heading</Text>
              </SubHeading>
              {orderBy(catalogues, 'startDate', 'desc').map((catalogue) => {
                return (
                  <ExpandableSection
                    isExpanded={catalogues.length === 1}
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
                      onCatalogueChanged={updateUnit}
                      editable={catalogueEditable}
                    />
                  </ExpandableSection>
                )
              })}
              {catalogues.length === 0 && (
                <MessageView>
                  <Text>procurement_unit.no_catalogue</Text>
                </MessageView>
              )}
              {catalogueEditable && (
                <EditEquipmentCatalogue
                  onChange={updateUnit}
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
