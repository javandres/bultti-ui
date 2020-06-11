import React, { useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Contract } from '../schema-types'
import { useQueryData } from '../util/useQueryData'
import { procurementUnitOptionsQuery } from './contractQueries'
import {
  HeaderBoldHeading,
  HeaderHeading,
  HeaderSection,
} from '../common/components/ExpandableSection'

const ContractProcurementUnitsEditorView = styled.div`
  width: 100%;
  flex: 1 0 100%;
`

const ProcurementUnitOption = styled.div`
  border: 1px solid var(--lighter-grey);
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  background: white;
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
`

export type PropTypes = {
  contract: Contract
}

const ContractProcurementUnitsEditor = observer(({ contract }: PropTypes) => {
  let { data: procurementUnitOptions } = useQueryData(procurementUnitOptionsQuery, {
    skip: !contract || !contract?.operatorId || !contract?.startDate,
    variables: {
      operatorId: contract?.operatorId,
      date: contract?.startDate,
    },
  })

  let includedUnits = useMemo(
    () => (contract?.procurementUnits || []).map((unit) => unit.id),
    [contract]
  )

  let unitOptions = useMemo(() => procurementUnitOptions || [], [procurementUnitOptions])

  return (
    <ContractProcurementUnitsEditorView>
      {unitOptions.map((unitOption) => (
        <ProcurementUnitOption key={unitOption.id}>
          <HeaderBoldHeading>{unitOption.name}</HeaderBoldHeading>
          <HeaderSection>
            <HeaderHeading>Reitit</HeaderHeading>
            {(unitOption.routes || []).filter((routeId) => !!routeId).join(', ')}
          </HeaderSection>
          <HeaderSection>
            <HeaderHeading>Voimassaoloaika</HeaderHeading>
            {unitOption.startDate} - {unitOption.endDate}
          </HeaderSection>
          <HeaderSection>
            <HeaderHeading>Sopimuksessa mukana</HeaderHeading>
            {includedUnits.includes(unitOption.id) ? 'Mukana' : 'Ei mukana'}
          </HeaderSection>
        </ProcurementUnitOption>
      ))}
    </ContractProcurementUnitsEditorView>
  )
})

export default ContractProcurementUnitsEditor
