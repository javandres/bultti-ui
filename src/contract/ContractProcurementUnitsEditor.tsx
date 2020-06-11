import React, { useCallback, useMemo, useState } from 'react'
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
import Checkbox from '../common/input/Checkbox'

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
  onChange: (includedUnitIds: string[]) => unknown
}

const ContractProcurementUnitsEditor = observer(({ contract }: PropTypes) => {
  let [includedUnitIds, setIncludedUnitIds] = useState<string[]>([])

  useMemo(() => {
    if (contract && includedUnitIds.length === 0) {
      let currentIncluded = (contract?.procurementUnits || []).map((unit) => unit.id)

      if (currentIncluded.length !== 0) {
        setIncludedUnitIds(currentIncluded)
      }
    }
  }, [contract, includedUnitIds])

  let { data: procurementUnitOptions } = useQueryData(procurementUnitOptionsQuery, {
    skip: !contract || !contract?.operatorId || !contract?.startDate,
    variables: {
      operatorId: contract?.operatorId,
      date: contract?.startDate,
    },
  })

  let unitOptions = useMemo(() => procurementUnitOptions || [], [procurementUnitOptions])

  let onToggleUnitInclusion = useCallback((unitId) => {
    setIncludedUnitIds((currentVal) => {
      let nextIncludedIds = [...currentVal]

      if (nextIncludedIds.includes(unitId)) {
      } else {
        nextIncludedIds.push(unitId)
      }
      return nextIncludedIds
    })
  }, [])

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
            <Checkbox
              value="unit_included"
              name="unit_included"
              label="Sopimuksessa mukana"
              checked={includedUnitIds.includes(unitOption.id)}
              onChange={() => onToggleUnitInclusion(unitOption.id)}
            />
          </HeaderSection>
        </ProcurementUnitOption>
      ))}
    </ContractProcurementUnitsEditorView>
  )
})

export default ContractProcurementUnitsEditor
