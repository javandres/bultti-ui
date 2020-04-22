import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { round } from '../util/round'
import Table from '../common/components/Table'
import { isNumeric } from '../util/isNumeric'
import { ExecutionRequirement, ExecutionRequirementValue } from '../schema-types'
import { orderBy, pick } from 'lodash'
import ValueDisplay from '../common/components/ValueDisplay'
import { getTotal } from '../util/getTotal'

const ExecutionRequirementsAreaContainer = styled.div`
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;

  &:first-child {
    margin-top: 0;
  }

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
  'unit': 'Yksikkö',
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
  'total': 'Yhteensä',
}

const valuesLayoutColumnLabels: { [key in keyof ExecutionRequirementValue]?: string } = {
  emissionClass: 'Päästöluokka',
  kilometerRequirement: 'Kilometrivaatimus',
  quotaRequirement: 'Prosenttiosuus',
  equipmentCount: 'Vaatimus kpl',
  kilometersFulfilled: 'Toteuma km',
  quotaFulfilled: 'Toteuma % osuus',
  differencePercentage: '% ero',
  cumulativeDifferencePercentage: 'Kumul. % ero',
  equipmentCountFulfilled: 'Toteuma kpl',
  sanctionThreshold: 'Sanktioraja 5%',
  sanctionAmount: 'Sanktiomäärä',
  classSanctionAmount: 'PL sanktiomäärä',
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

      kilometerRow.total = getTotal(requirementValues, 'kilometerRequirement')
      percentageRow.total = getTotal(requirementValues, 'quotaRequirement')

      return [kilometerRow, percentageRow]
    }, [executionRequirement, tableLayout])

    let renderDisplayValue = useCallback((key, val) => {
      let displayVal = round(val)
      let displayUnit =
        key === 'totalKilometers' ? 'km' : key === 'averageAgeWeighted' ? 'vuotta' : ''

      return `${displayVal} ${displayUnit}`
    }, [])

    let renderTableValue = useCallback((key, val, isHeader = false, item) => {
      if (isHeader || ['unit'].includes(key || '') || !isNumeric(val) || val === 0) {
        return val
      }

      let unit = ''

      switch (item.unit || key) {
        case 'percentage':
        case 'quotaRequirement':
        case 'quotaFulfilled':
        case 'differencePercentage':
        case 'cumulativeDifferencePercentage':
          unit = '%'
          break
        case 'kilometers':
        case 'kilometerRequirement':
        case 'kilometersFulfilled':
          unit = 'km'
          break
        case 'equipmentCount':
          unit = 'kpl'
          break
        default:
          unit = ''
      }

      let useVal = round(val)
      return `${useVal} ${unit}`
    }, [])

    let getColumnTotal = useCallback(
      (key: string) => {
        if (key === 'emissionClass') {
          return ''
        }

        let totalVal = round(getTotal<any, string>(requirementRows, key))

        switch (key) {
          case 'percentage':
          case 'quotaRequirement':
          case 'quotaFulfilled':
          case 'differencePercentage':
          case 'cumulativeDifferencePercentage':
            return `${totalVal}%`
          case 'kilometers':
          case 'kilometerRequirement':
          case 'kilometersFulfilled':
            return `${totalVal} km`
          case 'equipmentCount':
          case 'equipmentCountFulfilled':
            return `${totalVal} kpl`
          default:
            return totalVal
        }
      },
      [executionRequirement]
    )

    return (
      <ExecutionRequirementsAreaContainer>
        <ValueDisplay
          style={{ marginBottom: '1rem' }}
          item={pick(executionRequirement, ['totalKilometers', 'averageAgeWeighted'])}
          labels={{
            totalKilometers: 'Suoritekilometrit yhteensä',
            averageAgeWeighted: 'Painotettu keski-ikä',
          }}
          renderValue={renderDisplayValue}
        />
        <Table<any>
          items={requirementRows}
          columnLabels={
            tableLayout === RequirementsTableLayout.BY_VALUES
              ? valuesLayoutColumnLabels
              : emissionClassLayoutColumnLabels
          }
          columnOrder={tableLayout === RequirementsTableLayout.BY_VALUES ? undefined : ['unit']}
          renderValue={renderTableValue}
          getColumnTotal={
            tableLayout === RequirementsTableLayout.BY_VALUES ? getColumnTotal : undefined
          }
        />
      </ExecutionRequirementsAreaContainer>
    )
  }
)

export default RequirementsTable
