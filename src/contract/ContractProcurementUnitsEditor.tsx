import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import {
  Contract,
  ContractInput,
  ProcurementUnitOption as ProcurementUnitOptionType,
} from '../schema-types'
import { useQueryData } from '../util/useQueryData'
import { procurementUnitOptionsQuery } from './contractQueries'
import {
  HeaderBoldHeading,
  HeaderHeading,
  HeaderSection,
} from '../common/components/ExpandableSection'
import Checkbox from '../common/input/Checkbox'
import { MessageContainer, MessageView } from '../common/components/Messages'
import { LoadingDisplay } from '../common/components/Loading'
import { addDays, areIntervalsOverlapping, isValid, max, min, parseISO } from 'date-fns'
import DateRangeDisplay from '../common/components/DateRangeDisplay'
import { useContractPage } from './contractUtils'
import { TextButton } from '../common/components/Button'
import { FlexRow } from '../common/components/common'

const ContractProcurementUnitsEditorView = styled.div``

const UnitContentWrapper = styled.div`
  overflow: hidden;
  position: relative;
`

const EmptyView = styled(MessageContainer)`
  border-top: 1px solid var(--lighter-grey);
`

const ProcurementUnitOption = styled.div`
  border-bottom: 1px solid var(--lighter-grey);
  border-radius: 0;
  background: white;
  display: flex;
  align-items: stretch;
  justify-content: flex-start;

  &:last-child {
    border-bottom: 0;
  }
`

const CurrentContractDisplay = styled.div`
  margin-top: 0.75rem;
  font-size: 0.75rem;

  > * {
    margin-top: 0.25rem;
  }

  * {
    font-size: inherit;
  }
`

export type PropTypes = {
  readOnly: boolean
  contract: ContractInput
  onChange: (includedUnitIds: string[]) => unknown
}

const ContractProcurementUnitsEditor = observer(
  ({ contract, onChange, readOnly }: PropTypes) => {
    let includedUnitIds = useMemo(() => contract?.procurementUnitIds || [], [contract])

    let { data: procurementUnitOptions, loading: unitsLoading } = useQueryData(
      procurementUnitOptionsQuery,
      {
        skip: !contract || !contract?.operatorId || !contract?.startDate,
        variables: {
          operatorId: contract?.operatorId,
          startDate: contract?.startDate,
          endDate: contract?.endDate,
        },
      }
    )

    let unitOptions = useMemo<ProcurementUnitOptionType[]>(
      () => procurementUnitOptions || [],
      [procurementUnitOptions]
    )

    let onToggleUnitInclusion = useCallback(
      (unitId) => {
        let nextIncludedIds = [...includedUnitIds]

        if (nextIncludedIds.includes(unitId)) {
          let currentIdx = nextIncludedIds.findIndex((id) => id === unitId)
          nextIncludedIds.splice(currentIdx, 1)
        } else {
          nextIncludedIds.push(unitId)
        }

        onChange(nextIncludedIds)
      },
      [includedUnitIds, onChange]
    )

    let editContract = useContractPage()

    let startDate = parseISO(contract.startDate)
    let endDate = parseISO(contract.endDate)

    let contractInterval = {
      start: min([startDate, endDate]),
      end: max([endDate, addDays(startDate, 1)]),
    }

    let allSelected = useMemo(
      () => !unitOptions.some((unit) => !includedUnitIds.includes(unit.id)),
      [unitOptions, includedUnitIds]
    )

    let onSelectAll = useCallback(() => {
      if (!allSelected) {
        let allSelectedArr = unitOptions.map((unit) => unit.id)
        onChange(allSelectedArr)
      } else {
        onChange([])
      }
    }, [allSelected, unitOptions])

    return (
      <ContractProcurementUnitsEditorView>
        <UnitContentWrapper>
          <LoadingDisplay loading={unitsLoading} />
          {unitOptions.length === 0 && !unitsLoading && (
            <EmptyView>
              <MessageView>Ei kilpailukohteita</MessageView>
            </EmptyView>
          )}
          <FlexRow
            style={{
              justifyContent: 'flex-end',
              padding: '0.75rem',
              borderBottom: '1px solid var(--lighter-grey)',
            }}>
            <Checkbox
              disabled={readOnly}
              value="select_all"
              name="select_all"
              label={allSelected ? 'Kaikki valittu' : 'Valitse kaikki'}
              checked={allSelected}
              onChange={onSelectAll}
            />
          </FlexRow>
          {unitOptions.map((unitOption) => {
            let routes = (unitOption.routes || []).filter((routeId) => !!routeId)

            let fullRoutesString = routes.join(', ')
            let shortRoutes = routes.slice(0, 3)

            if (routes.length > shortRoutes.length) {
              shortRoutes.push('...')
            }

            let shortRoutesString = shortRoutes.join(', ')
            let isSelected = includedUnitIds.includes(unitOption.id)

            let { currentContracts = [] } = unitOption
            currentContracts = currentContracts || []

            let isCurrentContract = currentContracts.some((c) => c.id === contract.id)

            let hasFullyOverlappingContract = currentContracts.some((c) => {
              let checkStart = parseISO(c.startDate)
              let checkEnd = parseISO(c.endDate)

              return (
                c.id !== contract.id &&
                !areIntervalsOverlapping(
                  {
                    start: min([checkStart, checkEnd]),
                    end: max([checkEnd, addDays(checkStart, 1)]),
                  },
                  contractInterval
                )
              )
            })

            let canSelectUnit =
              currentContracts.length === 0 ||
              !hasFullyOverlappingContract ||
              isCurrentContract

            return (
              <ProcurementUnitOption key={unitOption.id}>
                <HeaderBoldHeading style={{ flex: '1 0 10rem' }}>
                  {unitOption.name}
                </HeaderBoldHeading>
                <HeaderSection title={fullRoutesString}>
                  <HeaderHeading>Reitit</HeaderHeading>
                  {shortRoutesString}
                </HeaderSection>
                <HeaderSection>
                  <HeaderHeading>Voimassaoloaika</HeaderHeading>
                  {unitOption.startDate} - {unitOption.endDate}
                </HeaderSection>
                <HeaderSection style={{ flex: '1 0 7rem' }}>
                  <HeaderHeading>Alue</HeaderHeading>
                  {unitOption?.areaName || 'OTHER'}
                </HeaderSection>
                <HeaderSection style={{ alignItems: 'center', justifyContent: 'center' }}>
                  {canSelectUnit && (
                    <Checkbox
                      disabled={readOnly}
                      value="unit_included"
                      name="unit_included"
                      label="Sopimuksessa mukana"
                      checked={isSelected}
                      onChange={() => onToggleUnitInclusion(unitOption.id)}
                    />
                  )}
                  {currentContracts.length !== 0 && !isCurrentContract && (
                    <CurrentContractDisplay>
                      Nykyiset sopimukset:
                      <div>
                        {currentContracts.map((currentContract: Contract) => (
                          <TextButton
                            key={currentContract.id}
                            style={{ display: 'block' }}
                            onClick={() => editContract(currentContract.id!)}>
                            <DateRangeDisplay
                              startDate={currentContract.startDate}
                              endDate={currentContract.endDate}
                            />
                          </TextButton>
                        ))}
                      </div>
                    </CurrentContractDisplay>
                  )}
                </HeaderSection>
              </ProcurementUnitOption>
            )
          })}
        </UnitContentWrapper>
      </ContractProcurementUnitsEditorView>
    )
  }
)

export default ContractProcurementUnitsEditor
