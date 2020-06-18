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
  HeaderBoldHeading,
  HeaderHeading,
  HeaderSection,
} from '../common/components/ExpandableSection'
import { SubHeading } from '../common/components/Typography'
import { useRefetch } from '../util/useRefetch'
import DateRangeDisplay from '../common/components/DateRangeDisplay'

const ProcurementUnitView = styled.div`
  position: relative;
  min-height: 5rem;
`

const ContentWrapper = styled.div`
  position: relative;
`

export type PropTypes = {
  procurementUnit: ProcurementUnitType
  expanded?: boolean
  startDate: string
  catalogueEditable: boolean
  requirementsEditable: boolean
  showExecutionRequirements: boolean
  className?: string
  onUpdate?: () => unknown
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
  requirementsEditable: boolean
  isVisible: boolean
  onUpdate?: () => unknown
}

const ProcurementUnitItemContent = observer(
  ({
    showExecutionRequirements,
    startDate,
    procurementUnitId,
    catalogueEditable,
    requirementsEditable,
    isVisible,
    onUpdate,
  }: ContentPropTypes) => {
    const [
      pendingProcurementUnit,
      setPendingProcurementUnit,
    ] = useState<ProcurementUnitEditInput | null>(null)

    // Get the operating units for the selected operator.
    const { data: procurementUnit, loading, refetch: refetchUnitData } =
      useQueryData<ProcurementUnitType>(procurementUnitQuery, {
        skip: !procurementUnitId || !isVisible,
        variables: {
          procurementUnitId,
        },
      }) || {}

    let refetch = useRefetch(refetchUnitData)

    let updateUnit = useCallback(() => {
      refetch()

      if (onUpdate) {
        onUpdate()
      }
    }, [refetch, onUpdate])

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
      if (catalogueEditable) {
        const inputRow: ProcurementUnitEditInput = {
          weeklyMeters: procurementUnit.weeklyMeters ?? 0,
          medianAgeRequirement: procurementUnit.medianAgeRequirement ?? 0,
        }

        setPendingProcurementUnit(inputRow)
      }
    }, [procurementUnit, catalogueEditable])

    const [updateProcurementUnit] = useMutationData<ProcurementUnitEditInput>(
      updateProcurementUnitMutation,
      {
        variables: {
          procurementUnitId,
          updatedData: null,
        },
      }
    )

    const onChangeProcurementUnit = useCallback(
      (key: string, nextValue) => {
        if (catalogueEditable) {
          setPendingProcurementUnit((currentPending) =>
            !currentPending ? null : { ...currentPending, [key]: nextValue }
          )
        }
      },
      [catalogueEditable]
    )

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

      await updateUnit()
    }, [pendingProcurementUnit, updateUnit, catalogueEditable])

    const onCancelPendingUnit = useCallback(() => {
      setPendingProcurementUnit(null)
    }, [])

    const inspectionStartDate = useMemo(() => parseISO(startDate), [startDate])

    const renderProcurementItemInput = useCallback((key: string, val: any, onChange) => {
      return <ProcurementUnitFormInput value={val} valueName={key} onChange={onChange} />
    }, [])

    return (
      <ContentWrapper>
        <LoadingDisplay loading={loading} />
        {procurementUnit && (
          <>
            {showExecutionRequirements && hasEquipment && (
              <ProcurementUnitExecutionRequirement
                onUpdate={onUpdate}
                isEditable={requirementsEditable}
                procurementUnit={procurementUnit}
              />
            )}
            <FlexRow>
              <SubHeading>Kohteen tiedot</SubHeading>
              <Button
                onClick={updateUnit}
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
              onCatalogueChanged={updateUnit}
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
    requirementsEditable,
    showExecutionRequirements,
    startDate,
    procurementUnit,
    expanded = true,
    className,
    onUpdate,
  }) => {
    const { currentContract, routes = [] } = procurementUnit || {}

    return (
      <ProcurementUnitView className={className}>
        {procurementUnit && (
          <ExpandableSection
            isExpanded={expanded}
            headerContent={
              <>
                <HeaderBoldHeading>{procurementUnit.procurementUnitId}</HeaderBoldHeading>
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
                <HeaderSection style={{ flexGrow: 2 }}>
                  <HeaderHeading>Voimassaoloaika</HeaderHeading>
                  <DateRangeDisplay
                    startDate={procurementUnit.startDate}
                    endDate={procurementUnit.endDate}
                  />
                </HeaderSection>
                <HeaderSection>
                  <HeaderHeading>Seuranta-alue</HeaderHeading>
                  {procurementUnit?.area?.name}
                </HeaderSection>
                <HeaderSection style={{ flexGrow: 2 }}>
                  <HeaderHeading>Sopimus</HeaderHeading>
                  {currentContract ? (
                    <DateRangeDisplay
                      startDate={currentContract.startDate}
                      endDate={currentContract.endDate}
                    />
                  ) : (
                    'Ei voimassaolevaa sopimusta.'
                  )}
                </HeaderSection>
              </>
            }>
            {(itemIsExpanded: boolean) => (
              <ProcurementUnitItemContent
                onUpdate={onUpdate}
                isVisible={itemIsExpanded}
                showExecutionRequirements={showExecutionRequirements}
                startDate={startDate}
                procurementUnitId={procurementUnit.id}
                requirementsEditable={requirementsEditable}
                catalogueEditable={catalogueEditable}
              />
            )}
          </ExpandableSection>
        )}
      </ProcurementUnitView>
    )
  }
)

export default ProcurementUnitItem
