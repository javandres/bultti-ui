import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import {
  EquipmentCatalogue as EquipmentCatalogueType,
  ProcurementUnit as ProcurementUnitType,
  ProcurementUnitEditInput,
} from '../schema-types'
import { round } from '../util/round'
import EquipmentCatalogue from '../equipmentCatalogue/EquipmentCatalogue'
import { isBetween } from '../util/isBetween'
import { useQueryData } from '../util/useQueryData'
import {
  procurementUnitQuery,
  updateProcurementUnitMutation,
  weeklyMetersFromJoreMutation,
} from './procurementUnitsQuery'
import { LoadingDisplay } from '../common/components/Loading'
import ItemForm from '../common/input/ItemForm'
import ValueDisplay from '../common/components/ValueDisplay'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { useMutationData } from '../util/useMutationData'
import ProcurementUnitFormInput from './ProcurementUnitFormInput'
import { pickGraphqlData } from '../util/pickGraphqlData'
import { FlexRow } from '../common/components/common'
import { parseISO } from 'date-fns'
import ProcurementUnitExecutionRequirement from '../executionRequirement/ProcurementUnitExecutionRequirement'
import ExpandableSection, {
  HeaderHeading,
  HeaderSection,
} from '../common/components/ExpandableSection'
import { SubHeading } from '../common/components/Typography'

const ProcurementUnitView = styled.div`
  position: relative;
  min-height: 5rem;
`

const ProcurementUnitHeading = styled.h4`
  margin: 0;
  padding: 0.5rem 0.75rem;
  flex: 1 1 50%;
  border-right: 1px solid var(--lighter-grey);
  display: flex;
  align-items: center;
`

const ContentWrapper = styled.div`
  position: relative;
`

export type PropTypes = {
  procurementUnit: ProcurementUnitType
  expanded?: boolean
  startDate: string
  catalogueEditable: boolean
  showExecutionRequirements: boolean
  className?: string
}

const procurementUnitLabels = {
  weeklyMeters: 'Suorite / viikko',
  medianAgeRequirement: 'Keski-ikä vaatimus',
}

type ContentPropTypes = {
  showExecutionRequirements: boolean
  startDate: string
  procurementUnitId: string
  catalogueEditable: boolean
}

const ProcurementUnitItemContent = observer(
  ({
    showExecutionRequirements,
    startDate,
    procurementUnitId,
    catalogueEditable,
  }: ContentPropTypes) => {
    const [
      pendingProcurementUnit,
      setPendingProcurementUnit,
    ] = useState<ProcurementUnitEditInput | null>(null)

    // Get the operating units for the selected operator.
    const { data: procurementUnit, loading, refetch: refetchUnit } =
      useQueryData<ProcurementUnitType>(procurementUnitQuery, {
        variables: {
          procurementUnitId,
        },
      }) || {}

    // Find the currently active Equipment Catalogue for the Operating Unit
    const activeCatalogue: EquipmentCatalogueType | undefined = useMemo(
      () =>
        (procurementUnit?.equipmentCatalogues || []).find((cat) =>
          isBetween(startDate, cat.startDate, cat.endDate)
        ),
      [procurementUnit]
    )

    let hasEquipment = activeCatalogue?.equipmentQuotas?.length !== 0

    const [updateWeeklyMeters] = useMutationData(weeklyMetersFromJoreMutation, {
      variables: { procurementUnitId, startDate },
    })

    const addDraftProcurementUnit = useCallback(() => {
      const inputRow: ProcurementUnitEditInput = {
        weeklyMeters: procurementUnit.weeklyMeters ?? 0,
        medianAgeRequirement: procurementUnit.medianAgeRequirement ?? 0,
      }

      setPendingProcurementUnit(inputRow)
    }, [procurementUnit])

    const [updateProcurementUnit] = useMutationData<ProcurementUnitEditInput>(
      updateProcurementUnitMutation,
      {
        variables: {
          procurementUnitId,
          updatedData: null,
        },
      }
    )

    const onChangeProcurementUnit = useCallback((key: string, nextValue) => {
      setPendingProcurementUnit((currentPending) =>
        !currentPending ? null : { ...currentPending, [key]: nextValue }
      )
    }, [])

    const onUpdateWeeklyMeters = useCallback(async () => {
      if (
        catalogueEditable &&
        confirm(
          'Olet päivittämässä viikkosuoritteet JOREsta,' +
            'ja mahdolliset Bultin kautta syötetyt arvot' +
            'tullaan ylikirjoittamaan JOREsta saaduilla arvoilla. Jatketaanko?'
        )
      ) {
        const { data } = await updateWeeklyMeters()
        const nextUnit = pickGraphqlData(data)

        // Since we are currently editing the procurement unit, set the new
        // value in the form state.
        onChangeProcurementUnit('weeklyMeters', nextUnit.weeklyMeters)
      }
    }, [catalogueEditable, updateWeeklyMeters])

    const onCatalogueChanged = useCallback(async () => {
      if (refetchUnit) {
        await refetchUnit()
      }
    }, [refetchUnit])

    const onSaveProcurementUnit = useCallback(async () => {
      if (!catalogueEditable || !procurementUnitId || !pendingProcurementUnit) {
        return
      }

      setPendingProcurementUnit(null)

      await updateProcurementUnit({
        variables: {
          updatedData: pendingProcurementUnit,
        },
      })

      await onCatalogueChanged()
    }, [pendingProcurementUnit, onCatalogueChanged, catalogueEditable])

    const onCancelPendingUnit = useCallback(() => {
      setPendingProcurementUnit(null)
    }, [])

    const inspectionStartDate = useMemo(() => parseISO(startDate), [startDate])

    const renderProcurementItemInput = useCallback((key: string, val: any, onChange) => {
      return <ProcurementUnitFormInput value={val} valueName={key} onChange={onChange} />
    }, [])

    let onUpdate = useCallback(async () => {
      if (refetchUnit) {
        await refetchUnit()
      }
    }, [refetchUnit])

    return (
      <ContentWrapper>
        <LoadingDisplay loading={loading} />
        {procurementUnit && (
          <>
            {showExecutionRequirements && hasEquipment && (
              <ProcurementUnitExecutionRequirement procurementUnit={procurementUnit} />
            )}
            <FlexRow>
              <SubHeading>Kohteen tiedot</SubHeading>
              <Button
                onClick={onUpdate}
                style={{ marginLeft: 'auto' }}
                buttonStyle={ButtonStyle.SECONDARY}
                size={ButtonSize.SMALL}>
                Päivitä
              </Button>
            </FlexRow>
            {!pendingProcurementUnit ? (
              <>
                <ValueDisplay
                  renderValue={(key, val) => {
                    if (key === 'weeklyMeters') return `${val} metriä`
                    if (key === 'medianAgeRequirement') return `${val} vuotta`
                    return val
                  }}
                  item={procurementUnit}
                  labels={procurementUnitLabels}>
                  {catalogueEditable && (
                    <Button style={{ marginLeft: 'auto' }} onClick={addDraftProcurementUnit}>
                      Muokkaa
                    </Button>
                  )}
                </ValueDisplay>
              </>
            ) : catalogueEditable ? (
              <>
                <ItemForm
                  item={pendingProcurementUnit}
                  labels={procurementUnitLabels}
                  onChange={onChangeProcurementUnit}
                  onDone={onSaveProcurementUnit}
                  onCancel={onCancelPendingUnit}
                  doneLabel="Tallenna"
                  doneDisabled={Object.values(pendingProcurementUnit).some(
                    (val: number | string | undefined | null) =>
                      val === null || typeof val === 'undefined' || val === ''
                  )}
                  renderInput={renderProcurementItemInput}>
                  <Button
                    size={ButtonSize.SMALL}
                    buttonStyle={ButtonStyle.SECONDARY}
                    onClick={onUpdateWeeklyMeters}>
                    Päivitä suoritteet JOREsta
                  </Button>
                </ItemForm>
              </>
            ) : null}
            <SubHeading>Kalustoluettelo</SubHeading>
            <EquipmentCatalogue
              startDate={inspectionStartDate}
              procurementUnitId={procurementUnitId}
              catalogue={activeCatalogue}
              operatorId={procurementUnit.operatorId}
              onCatalogueChanged={onCatalogueChanged}
              editable={catalogueEditable}
            />
          </>
        )}
      </ContentWrapper>
    )
  }
)

const ProcurementUnitItem: React.FC<PropTypes> = observer(
  ({
    catalogueEditable,
    showExecutionRequirements,
    startDate,
    procurementUnit,
    expanded = true,
    className,
  }) => {
    const { routes = [] } = procurementUnit || {}

    return (
      <ProcurementUnitView className={className}>
        {procurementUnit && (
          <ExpandableSection
            isExpanded={expanded}
            headerContent={
              <>
                <ProcurementUnitHeading>
                  {procurementUnit.procurementUnitId}
                </ProcurementUnitHeading>
                <HeaderSection>
                  <HeaderHeading>Reitit</HeaderHeading>
                  {(routes || [])
                    .map((route) => route?.routeId)
                    .filter((routeId) => !!routeId)
                    .join(', ')}
                </HeaderSection>
                <HeaderSection>
                  <HeaderHeading>Kilometrejä viikossa</HeaderHeading>
                  {round((procurementUnit?.weeklyMeters || 0) / 1000)} km
                </HeaderSection>
                <HeaderSection>
                  <HeaderHeading>Voimassaoloaika</HeaderHeading>
                  {procurementUnit.startDate} - {procurementUnit.endDate}
                </HeaderSection>
              </>
            }>
            <ProcurementUnitItemContent
              showExecutionRequirements={showExecutionRequirements}
              startDate={startDate}
              procurementUnitId={procurementUnit.id}
              catalogueEditable={catalogueEditable}
            />
          </ExpandableSection>
        )}
      </ProcurementUnitView>
    )
  }
)

export default ProcurementUnitItem
