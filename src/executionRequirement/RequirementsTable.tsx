import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { round } from '../util/round'
import Table from '../common/components/Table'
import { isNumeric } from '../util/isNumeric'
import { ExecutionRequirement, Scalars } from '../schema-types'
import { orderBy, pick } from 'lodash'
import ValueDisplay from '../common/components/ValueDisplay'

const ExecutionRequirementsAreaContainer = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: 0;
  }
`

export enum RequirementsTableLayout {
  BY_VALUES,
  BY_EMISSION_CLASS,
}

export type PropTypes = {
  executionRequirement: ExecutionRequirement
  tableLayout?: RequirementsTableLayout
}

const emissionClassLayoutColumnLabels = {
  unit: 'Yksikkö',
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

const valuesLayoutColumnLabels = {
  emissionClass: 'Päästöluokka',
  kilometerRequirement: 'Kilometrivaatimus',
  quotaRequirement: 'Prosenttiosuus',
  kilometersFulfilled: 'Toteuma km',
  quotaFulfilled: 'Toteuma % osuus',
  differencePercentage: '% ero',
  cumulativeDifferencePercentage: 'Kumul. % ero',
  equipmentCount: 'Kalustomäärä',
}

const RequirementsTable: React.FC<PropTypes> = observer(
  ({ executionRequirement, tableLayout = RequirementsTableLayout.BY_EMISSION_CLASS }) => {
    let requirementRows = useMemo(() => {
      let requirementValues = executionRequirement.requirements

      if (tableLayout === RequirementsTableLayout.BY_VALUES) {
        return orderBy(requirementValues, 'emissionClass', 'desc')
      }

      let kilometerRow = { unit: 'kilometers', total: 0 }
      let percentageRow = { unit: 'percentage', total: 0 }

      for (let i = 1; i <= 10; i++) {
        let currentRequirement = requirementValues.find((req) => req.emissionClass === i)

        kilometerRow[i] = currentRequirement?.kilometerRequirement || 0
        percentageRow[i] = currentRequirement?.quotaRequirement || 0
      }

      kilometerRow.total = requirementValues.reduce(
        (total, { kilometerRequirement }) => (total += kilometerRequirement),
        kilometerRow.total
      )

      percentageRow.total = requirementValues.reduce(
        (total, { quotaRequirement }) => (total += quotaRequirement),
        percentageRow.total
      )

      return [kilometerRow, percentageRow]
    }, [executionRequirement, tableLayout])

    let renderDisplayValue = useCallback((key, val) => round(val), [])

    let renderTableValue = useCallback((key, val, isHeader = false, item) => {
      if (isHeader || ['unit'].includes(key || '') || !isNumeric(val) || val === 0) {
        return val
      }

      let unit = ''

      switch (item.unit) {
        case 'percentage':
          unit = '%'
          break
        case 'kilometers':
        case 'kilometerRequirement':
        case 'kilometersFulfilled':
          unit = 'km'
          break
        default:
          unit = ''
      }

      let useVal = round(val)
      return useVal + ' ' + unit
    }, [])

    return (
      <ExecutionRequirementsAreaContainer>
        <ValueDisplay
          style={{ marginBottom: '1rem' }}
          item={pick(executionRequirement, ['totalKilometers', 'averageAgeWeighted'])}
          labels={{
            totalKilometers: 'Suoritekilometrit',
            averageAgeWeighted: 'Painotettu keski-ikä',
          }}
          renderValue={renderDisplayValue}
        />
        <Table
          items={requirementRows}
          columnLabels={
            tableLayout === RequirementsTableLayout.BY_VALUES
              ? valuesLayoutColumnLabels
              : emissionClassLayoutColumnLabels
          }
          columnOrder={tableLayout === RequirementsTableLayout.BY_VALUES ? undefined : ['unit']}
          renderValue={renderTableValue}
        />
      </ExecutionRequirementsAreaContainer>
    )
  }
)

export default RequirementsTable
