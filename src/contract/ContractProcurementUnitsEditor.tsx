import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import {
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
import { isAfter, isBefore, parseISO } from 'date-fns'

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

export type PropTypes = {
  contract: ContractInput
  onChange: (includedUnitIds: string[]) => unknown
}

const ContractProcurementUnitsEditor = observer(({ contract, onChange }: PropTypes) => {
  let includedUnitIds = useMemo(() => contract?.procurementUnitIds || [], [contract])

  let { data: procurementUnitOptions, loading: unitsLoading } = useQueryData(
    procurementUnitOptionsQuery,
    {
      skip: !contract || !contract?.operatorId || !contract?.startDate,
      variables: {
        operatorId: contract?.operatorId,
        date: contract?.startDate,
      },
    }
  )

  let unitOptions = useMemo<ProcurementUnitOptionType[]>(() => procurementUnitOptions || [], [
    procurementUnitOptions,
  ])

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

  let contractStart = parseISO(contract.startDate)
  let contractEnd = parseISO(contract.endDate)

  return (
    <ContractProcurementUnitsEditorView>
      <UnitContentWrapper>
        <LoadingDisplay loading={unitsLoading} />
        {unitOptions.length === 0 && !unitsLoading && (
          <EmptyView>
            <MessageView>Ei kilpailukohteita</MessageView>
          </EmptyView>
        )}
        {unitOptions.map((unitOption) => {
          let routes = (unitOption.routes || []).filter((routeId) => !!routeId)

          let currentContractStart = !unitOption.currentContractStart
            ? undefined
            : parseISO(unitOption.currentContractStart)

          let currentContractEnd = !unitOption.currentContractEnd
            ? undefined
            : parseISO(unitOption.currentContractEnd)

          let fullRoutesString = routes.join(', ')

          let shortRoutes = routes.slice(0, 3)

          if (routes.length > shortRoutes.length) {
            shortRoutes.push('...')
          }

          let shortRoutesString = shortRoutes.join(', ')
          let isSelected = includedUnitIds.includes(unitOption.id)

          let isCurrentContract = unitOption.currentContractId === contract.id
          let isEnabled =
            isCurrentContract ||
            !unitOption?.currentContractId ||
            (currentContractEnd && isBefore(currentContractEnd, contractStart)) ||
            (currentContractStart && isAfter(currentContractStart, contractEnd))

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
                {isEnabled ? (
                  <Checkbox
                    value="unit_included"
                    name="unit_included"
                    label="Sopimuksessa mukana"
                    disabled={!isEnabled}
                    checked={isSelected}
                    onChange={() => onToggleUnitInclusion(unitOption.id)}
                  />
                ) : (
                  'Kohde on toisessa sopimuksessa.'
                )}
              </HeaderSection>
            </ProcurementUnitOption>
          )
        })}
      </UnitContentWrapper>
    </ContractProcurementUnitsEditorView>
  )
})

export default ContractProcurementUnitsEditor
