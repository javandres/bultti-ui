import React, { useCallback, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import { observer } from 'mobx-react-lite'
import {
  EquipmentCatalogue as EquipmentCatalogueType,
  ProcurementUnit as ProcurementUnitType,
  ProcurementUnitEditInput,
} from '../schema-types'
import { isEqual } from 'lodash'
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
import { SubHeading } from '../common/components/Typography'
import { useRefetch } from '../util/useRefetch'

const ContentWrapper = styled.div`
  position: relative;
`

const CatalogueWrapper = styled.div<{ isInvalid: boolean }>`
  border-radius: 0.5rem;
  position: relative;
  margin-top: 2rem;

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
  catalogueInvalid: boolean
  requirementsInvalid: boolean
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
    catalogueInvalid,
    requirementsInvalid,
  }: ContentPropTypes) => {
    const [
      pendingProcurementUnit,
      setPendingProcurementUnit,
    ] = useState<ProcurementUnitEditInput | null>(null)
    const [
      oldProcurementUnit,
      setOldProcurementUnit,
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
      console.log('at updateUnit')
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

    const startEditingProcurementUnit = useCallback(() => {
      if (catalogueEditable) {
        const inputRow: ProcurementUnitEditInput = {
          weeklyMeters: procurementUnit.weeklyMeters ?? 0,
          medianAgeRequirement: procurementUnit.medianAgeRequirement ?? 0,
        }

        setPendingProcurementUnit(inputRow)
        setOldProcurementUnit(inputRow)
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
      console.log('at save...')

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
                valid={!requirementsInvalid}
              />
            )}
            <FlexRow>
              <SubHeading>Kohteen tiedot</SubHeading>
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
                    <Button
                      style={{ marginLeft: 'auto' }}
                      onClick={startEditingProcurementUnit}>
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
                  isDirty={!isEqual(oldProcurementUnit, pendingProcurementUnit)}
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
            <CatalogueWrapper isInvalid={catalogueInvalid}>
              <SubHeading>Kalustoluettelo</SubHeading>
              <EquipmentCatalogue
                startDate={inspectionStartDate}
                procurementUnit={procurementUnit}
                catalogue={activeCatalogue}
                operatorId={procurementUnit.operatorId}
                onCatalogueChanged={updateUnit}
                editable={catalogueEditable}
              />
            </CatalogueWrapper>
          </>
        )}
      </ContentWrapper>
    )
  }
)

export default ProcurementUnitItemContent
