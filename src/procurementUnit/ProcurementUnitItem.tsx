import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import {
  EquipmentCatalogue as EquipmentCatalogueType,
  ProcurementUnit as ProcurementUnitType,
  ProcurementUnitEditInput,
} from '../schema-types'
import { ArrowDown } from '../common/icon/ArrowDown'
import { round } from '../util/round'
import EquipmentCatalogue from '../equipmentCatalogue/EquipmentCatalogue'
import { isBetween } from '../util/isBetween'
import { useQueryData } from '../util/useQueryData'
import {
  procurementUnitQuery,
  updateProcurementUnitMutation,
  weeklyMetersFromJOREMutation,
} from './procurementUnitsQuery'
import Loading from '../common/components/Loading'
import ItemForm from '../common/input/ItemForm'
import ValueDisplay from '../common/components/ValueDisplay'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { useMutationData } from '../util/useMutationData'
import ProcurementUnitFormInput from './ProcurementUnitFormInput'
import { pickGraphqlData } from '../util/pickGraphqlData'
import { SubSectionHeading } from '../common/components/common'
import RequirementsTable from '../executionRequirement/RequirementsTable'
import { catalogueEquipment, groupedEquipment } from '../equipmentCatalogue/equipmentUtils'
import { parseISO } from 'date-fns'

const ProcurementUnitView = styled.div`
  border: 1px solid var(--lighter-grey);
  margin-top: 1rem;
  border-radius: 0.5rem;
  background: white;
`

const HeaderRow = styled.div<{ expanded?: boolean }>`
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  border-bottom: ${(p) => (p.expanded ? '1px solid var(--lighter-grey)' : '0')};

  > *:nth-child(even) {
    background-color: #fafafa;
  }
`

const HeaderSection = styled.div`
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
  border-right: 1px solid var(--lighter-grey);
  flex: 1 1 50%;

  &:last-child {
    border-right: 0;
  }
`

const ExpandToggle = styled.button<{ expanded?: boolean }>`
  background: transparent;
  cursor: pointer;
  border: 0;
  flex: 0;
  padding: 0.5rem 0.75rem;
  outline: none;
  display: flex;
  align-items: center;
  border-top-right-radius: 0.5rem;

  > * {
    transition: transform 0.1s ease-out;
    transform: rotate(${(p) => (p.expanded ? '180deg' : '0deg')});
  }
`

const Content = styled.div`
  padding: 1rem;
`

const ProcurementUnitHeading = styled.h4`
  margin: 0;
  padding: 0.5rem 0.75rem;
  flex: 1 1 50%;
  border-right: 1px solid var(--lighter-grey);
  display: flex;
  align-items: center;
`

export const HeaderHeading = styled.h5`
  font-size: 0.875rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  user-select: none;

  &:first-child {
    margin-top: 0;
  }
`

export type PropTypes = {
  procurementUnit: ProcurementUnitType
  expanded?: boolean
  startDate: string
}

const procurementUnitLabels = {
  weeklyMeters: 'Suorite / viikko',
  medianAgeRequirement: 'Keski-ikä vaatimus',
}

const ProcurementUnitItem: React.FC<PropTypes> = observer(
  ({ startDate, procurementUnit: { id, procurementUnitId }, expanded = true }) => {
    const [isExpanded, setIsExpanded] = useState(true)
    const [
      pendingProcurementUnit,
      setPendingProcurementUnit,
    ] = useState<ProcurementUnitEditInput | null>(null)

    // Get the operating units for the selected operator.
    const { data: procurementUnit, loading, refetch } =
      useQueryData<ProcurementUnitType>(procurementUnitQuery, {
        variables: {
          procurementUnitId: id,
        },
      }) || {}

    const { routes = [] } = procurementUnit || {}

    const [updateWeeklyMeters] = useMutationData(weeklyMetersFromJOREMutation, {
      variables: { procurementUnitId: id },
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
          procurementUnitId: id,
          updatedData: null,
        },
      }
    )

    // Find the currently active Equipment Catalogue for the Operating Unit
    const activeCatalogue: EquipmentCatalogueType | undefined = useMemo(
      () =>
        (procurementUnit?.equipmentCatalogues || []).find((cat) =>
          isBetween(startDate, cat.startDate, cat.endDate)
        ),
      [procurementUnit]
    )

    const onChangeProcurementUnit = useCallback((key: string, nextValue) => {
      setPendingProcurementUnit((currentPending) =>
        !currentPending ? null : { ...currentPending, [key]: nextValue }
      )
    }, [])

    const onUpdateWeeklyMeters = useCallback(async () => {
      if (
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
    }, [updateWeeklyMeters])

    const onSaveProcurementUnit = useCallback(async () => {
      if (!procurementUnitId || !pendingProcurementUnit) {
        return
      }

      setPendingProcurementUnit(null)

      await updateProcurementUnit({
        variables: {
          updatedData: pendingProcurementUnit,
        },
      })

      if (refetch) {
        await refetch()
      }
    }, [pendingProcurementUnit, refetch])

    const onCancelPendingUnit = useCallback(() => {
      setPendingProcurementUnit(null)
    }, [])

    const onCatalogueChanged = useCallback(async () => {
      if (refetch) {
        await refetch()
      }
    }, [refetch])

    useEffect(() => {
      setIsExpanded(expanded)
    }, [expanded])

    const inspectionStartDate = useMemo(() => parseISO(startDate), [startDate])

    const renderProcurementItemInput = useCallback((val: any, key: string, onChange) => {
      return <ProcurementUnitFormInput value={val} valueName={key} onChange={onChange} />
    }, [])

    let unitEquipmentGroups = useMemo(() => {
      let equipmentWithQuota = catalogueEquipment(activeCatalogue)
      return groupedEquipment(equipmentWithQuota, inspectionStartDate)
    }, [activeCatalogue, inspectionStartDate])

    return (
      <ProcurementUnitView>
        {loading ? (
          <Loading />
        ) : !procurementUnit ? null : (
          <>
            <HeaderRow expanded={isExpanded}>
              <ProcurementUnitHeading>{procurementUnitId}</ProcurementUnitHeading>
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
              <ExpandToggle
                expanded={isExpanded}
                onClick={() => setIsExpanded((currentVal) => !currentVal)}>
                <ArrowDown width="1rem" height="1rem" fill="var(dark-grey)" />
              </ExpandToggle>
            </HeaderRow>
            {isExpanded && (
              <Content>
                <SubSectionHeading>Kilpailukohteen tiedot</SubSectionHeading>
                {!pendingProcurementUnit ? (
                  <>
                    <ValueDisplay
                      renderValue={(val, key) => {
                        if (key === 'weeklyMeters') return `${val} metriä`
                        if (key === 'medianAgeRequirement') return `${val} vuotta`
                        return val
                      }}
                      item={procurementUnit}
                      labels={procurementUnitLabels}>
                      <Button style={{ marginLeft: 'auto' }} onClick={addDraftProcurementUnit}>
                        Muokkaa
                      </Button>
                    </ValueDisplay>
                  </>
                ) : (
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
                )}
                <>
                  <SubSectionHeading>Kalustoluettelo</SubSectionHeading>
                  <EquipmentCatalogue
                    startDate={inspectionStartDate}
                    procurementUnitId={id}
                    catalogue={activeCatalogue}
                    operatorId={procurementUnit.operatorId}
                    onCatalogueChanged={onCatalogueChanged}
                  />
                  <SubSectionHeading>Kohteen suoritevaatimukset</SubSectionHeading>
                  <RequirementsTable
                    equipmentGroups={unitEquipmentGroups}
                    weeklyMeters={procurementUnit.weeklyMeters}
                  />
                </>
              </Content>
            )}
          </>
        )}
      </ProcurementUnitView>
    )
  }
)

export default ProcurementUnitItem
