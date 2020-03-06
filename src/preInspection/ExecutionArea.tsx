import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { OperatingArea, OperatingUnit } from '../schema-types'
import { round } from '../utils/round'
import Table from '../common/components/Table'
import { omit } from 'lodash'
import OperatingUnitRequirements from './OperatingUnitRequirements'
import { TextButton } from '../common/components/Button'
import { FlexRow } from '../common/components/common'

const ExecutionRequirementsAreaContainer = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--lighter-grey);

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: 0;
  }
`

const TableHeading = styled.h5`
  margin-bottom: 0.5rem;
`

export type AreaPropTypes = {
  area: OperatingArea
  operatingUnits: OperatingUnit[]
  productionDate: string
}

const executionRequirementColumnLabels = {
  operatingUnitId: 'Kilpailukohde',
  age: 'Ikä',
  executionMeters: 'Suorite / viikko',
  '1': 'Euro 3',
  '2': 'Euro 4',
  '3': 'Euro 3 CNG',
  '4': 'Euro 5',
  '5': 'EEV Di',
  '6': 'EEV eteho.',
  '7': 'EEV CNG',
  '8': 'Euro 6',
  '9': 'Euro 6 eteho.',
  '10': 'Sähkö',
  total: 'Yhteensä',
}

const combinedColumnLabels = {
  label: 'Selite',
  ...omit(executionRequirementColumnLabels, ['operatingUnitId', 'age', 'executionMeters']),
}

const ExecutionArea: React.FC<AreaPropTypes> = observer(
  ({ productionDate, operatingUnits, area }) => {
    const [operatingUnitsExpanded, setOperatingUnitsExpanded] = useState(true)

    const toggleOperatingUnitsExpanded = useCallback(() => {
      setOperatingUnitsExpanded((currentVal) => !currentVal)
    }, [])

    const operatingUnitRequirements = (operatingUnits || []).map((opUnit) => {
      // noinspection UnnecessaryLocalVariableJS
      const operatingUnitRow = {
        operatingUnitId: opUnit.id,
        age: 7.5,
        executionMeters: `${round((opUnit.weeklyExecutionMeters || 0) / 1000)} km`,
      }

      // TODO: Add uploaded execution equipment data
      /*for (let i = 1; i <= 10; i++) {
        requirementRow[i] = ''
      }*/

      return operatingUnitRow
    })

    const combinedForArea = useMemo(() => {
      const combinedKm = {
        label: 'Km yht',
        total: '0 km',
      }

      const combinedExecutionRequirements = {
        label: 'Vaatimus %',
        total: '0%',
      }

      const combinedSanctionThresholds = {
        label: 'Sanktioraja %',
        total: '',
      }

      for (let i = 1; i <= 10; i++) {
        combinedKm[i] = 0
        combinedExecutionRequirements[i] = '0%'
        combinedSanctionThresholds[i] = '0%'
      }

      return [combinedKm, combinedExecutionRequirements, combinedSanctionThresholds]
    }, [operatingUnitRequirements])

    return (
      <ExecutionRequirementsAreaContainer>
        {operatingUnitRequirements && (
          <>
            <TableHeading>Kilpailukohteet</TableHeading>
            <FlexRow>
              {operatingUnits.length !== 0 && (
                <TextButton onClick={toggleOperatingUnitsExpanded}>
                  {operatingUnitsExpanded
                    ? 'Piilota kilpailukohteet'
                    : 'Näytä kilpailukohteet'}
                </TextButton>
              )}
            </FlexRow>
            {operatingUnits.map((operatingUnit) => (
              <OperatingUnitRequirements
                key={operatingUnit.id}
                productionDate={productionDate}
                operatingUnit={operatingUnit}
                expanded={operatingUnitsExpanded}
              />
            ))}
            <TableHeading>Seuranta-alue yhteensä</TableHeading>
            <Table
              columnLabels={combinedColumnLabels}
              columnOrder={['label']}
              items={combinedForArea}
            />
          </>
        )}
      </ExecutionRequirementsAreaContainer>
    )
  }
)

export default ExecutionArea
