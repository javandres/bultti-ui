import React, { useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { round } from '../util/round'
import Table from '../common/components/Table'
import { isNumeric } from '../util/isNumeric'
import { ExecutionRequirementValue } from '../schema-types'

const ExecutionRequirementsAreaContainer = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: 0;
  }
`

export type PropTypes = {
  requirementValues: ExecutionRequirementValue[]
  weeklyMeters: number
}

const requirementColumnLabels = {
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

const RequirementsTable: React.FC<PropTypes> = observer(({ requirementValues }) => {
  let requirementRows = useMemo(() => {
    let kilometerRow = { unit: 'kilometers', total: 0 }
    let percentageRow = { unit: 'percentage', total: 0 }
    let ageRow = { unit: 'averageAge', total: 0 }

    for (let i = 1; i <= 10; i++) {
      let currentRequirement = requirementValues.find((req) => req.emissionClass === i)

      kilometerRow[i] = currentRequirement?.kilometerRequirement || 0
      percentageRow[i] = currentRequirement?.quotaRequirement || 0
      ageRow[i] = currentRequirement?.averageAgeWeighted || 0
    }

    kilometerRow.total = requirementValues.reduce(
      (total, { kilometerRequirement }) => (total += kilometerRequirement),
      kilometerRow.total
    )

    percentageRow.total = requirementValues.reduce(
      (total, { quotaRequirement }) => (total += quotaRequirement),
      percentageRow.total
    )

    ageRow.total = requirementValues.reduce(
      (total, { averageAgeWeighted }) => (total += averageAgeWeighted),
      ageRow.total
    )

    return [kilometerRow, percentageRow, ageRow]
  }, [requirementValues])

  return (
    <ExecutionRequirementsAreaContainer>
      <Table
        items={requirementRows}
        columnLabels={requirementColumnLabels}
        columnOrder={['unit']}
        renderValue={(key, val, isHeader = false, item) => {
          if (isHeader || ['unit'].includes(key || '') || !isNumeric(val) || val === 0) {
            return val
          }

          let unit = ''

          switch (item.unit) {
            case 'percentage':
              unit = '%'
              break
            case 'kilometers':
              unit = 'km'
              break
            case 'averageAge':
              unit = 'v'
              break
            default:
              unit = ''
          }

          let useVal = round(val)
          return useVal + ' ' + unit
        }}
      />
    </ExecutionRequirementsAreaContainer>
  )
})

export default RequirementsTable
