import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { ContractInput } from '../schema-types'
import { useQueryData } from '../util/useQueryData'
import { procurementUnitOptionsQuery } from './contractQueries'
import ExpandableSection, {
  ContentWrapper,
  ExpandToggle,
  HeaderBoldHeading,
  HeaderHeading,
  HeaderSection,
} from '../common/components/ExpandableSection'
import Checkbox from '../common/input/Checkbox'

const ContractProcurementUnitsEditorView = styled(ExpandableSection)`
  margin-top: -2.5rem;
  border: 0;
  background: transparent;

  ${ContentWrapper} {
    padding: 0;
  }

  ${ExpandToggle} {
    padding: 1rem;
    border-radius: 0.25rem;
    background: var(--white-grey);
    margin-bottom: 0.5rem;
  }
`

const UnitContentWrapper = styled.div`
  border-radius: 0.5rem;
  border: 1px solid var(--lighter-grey);
  overflow: hidden;
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

  let { data: procurementUnitOptions } = useQueryData(procurementUnitOptionsQuery, {
    skip: !contract || !contract?.operatorId || !contract?.startDate,
    variables: {
      operatorId: contract?.operatorId,
      date: contract?.startDate,
    },
  })

  let unitOptions = useMemo(() => procurementUnitOptions || [], [procurementUnitOptions])

  let onToggleUnitInclusion = useCallback(
    (unitId) => {
      let nextIncludedIds = [...includedUnitIds]

      if (nextIncludedIds.includes(unitId)) {
        let currentIdx = nextIncludedIds.findIndex(unitId)
        nextIncludedIds.splice(currentIdx, 1)
      } else {
        nextIncludedIds.push(unitId)
      }

      onChange(nextIncludedIds)
    },
    [includedUnitIds, onChange]
  )

  return (
    <ContractProcurementUnitsEditorView>
      <UnitContentWrapper>
        {unitOptions.map((unitOption) => {
          let routes = (unitOption.routes || []).filter((routeId) => !!routeId)
          let fullRoutesString = routes.join(', ')

          let shortRoutes = routes.slice(0, 3)

          if (routes.length > shortRoutes.length) {
            shortRoutes.push('...')
          }

          let shortRoutesString = shortRoutes.join(', ')

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
                <Checkbox
                  value="unit_included"
                  name="unit_included"
                  label="Sopimuksessa mukana"
                  checked={includedUnitIds.includes(unitOption.id)}
                  onChange={() => onToggleUnitInclusion(unitOption.id)}
                />
              </HeaderSection>
            </ProcurementUnitOption>
          )
        })}
      </UnitContentWrapper>
    </ContractProcurementUnitsEditorView>
  )
})

export default ContractProcurementUnitsEditor
