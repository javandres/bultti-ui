import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { round } from '../util/round'
import Table from '../common/components/Table'
import { isNumeric } from '../util/isNumeric'
import { ObservedExecutionRequirement, ObservedExecutionValue } from '../schema-types'
import { orderBy, pick, lowerCase } from 'lodash'
import ValueDisplay from '../common/components/ValueDisplay'
import { getTotal } from '../util/getTotal'
import {
  emissionClassLayoutColumnLabels,
  RequirementsTableLayout,
} from './executionRequirementUtils'

const ExecutionRequirementsAreaContainer = styled.div`
  margin-top: 1.5rem;
  margin-bottom: 1rem;

  &:first-child {
    margin-top: 0;
  }

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: 0;
  }
`

export type PropTypes = {
  executionRequirement: ObservedExecutionRequirement
  tableLayout?: RequirementsTableLayout
}

const valuesLayoutColumnLabels: { [key in keyof ObservedExecutionValue]?: string } = {
  emissionClass: 'Päästöluokka',
  kilometersRequired: 'Km vaatimus',
  quotaRequired: '% Osuus',
  equipmentCountRequired: 'Vaatimus kpl',
  kilometersObserved: 'Toteuma km',
  quotaObserved: 'Toteuma % osuus',
  differencePercentage: '% ero',
  cumulativeDifferencePercentage: 'Kumul. % ero',
  equipmentCountObserved: 'Toteuma kpl',
  averageAgeWeightedRequired: 'Suun. painotettu keski-ikä',
  averageAgeWeightedObserved: 'Tot. painotettu keski-ikä',
  sanctionThreshold: 'Sanktioraja',
  sanctionAmount: 'Sanktioitavat',
  classSanctionAmount: 'Sanktiomäärä',
}

const ObservedRequirementsTable: React.FC<PropTypes> = observer(
  ({ executionRequirement, tableLayout = RequirementsTableLayout.BY_EMISSION_CLASS }) => {
    let requirementRows = useMemo(() => {
      let requirementValues = executionRequirement.observedRequirements

      if (tableLayout === RequirementsTableLayout.BY_VALUES) {
        return orderBy(requirementValues, 'emissionClass', 'desc')
      }

      let kilometerRow = { unit: 'kilometers', total: 0 }
      let percentageRow = { unit: 'percentage', total: 0 }

      for (let i = 1; i <= 10; i++) {
        let currentRequirement = requirementValues.find((req) => req.emissionClass === i)

        kilometerRow[i] = currentRequirement?.kilometersRequired || 0
        percentageRow[i] = currentRequirement?.quotaRequired || 0
      }

      kilometerRow.total = getTotal(requirementValues, 'kilometersRequired')
      percentageRow.total = getTotal(requirementValues, 'quotaRequired')

      return [kilometerRow, percentageRow]
    }, [executionRequirement, tableLayout])

    let renderDisplayValue = useCallback((key, val) => {
      let displayVal = round(val)
      let displayUnit = lowerCase(key).includes('kilo') ? 'km' : 'vuotta'

      return `${displayVal} ${displayUnit}`
    }, [])

    let renderTableValue = useCallback((key, val, isHeader = false, item) => {
      if (isHeader || ['unit'].includes(key || '') || !isNumeric(val) || val === 0) {
        return val
      }

      let unit = ''

      switch (item.unit || key) {
        case 'percentage':
        case 'quotaRequired':
        case 'quotaObserved':
        case 'differencePercentage':
        case 'cumulativeDifferencePercentage':
        case 'sanctionThreshold':
        case 'sanctionAmount':
        case 'classSanctionAmount':
          unit = '%'
          break
        case 'kilometers':
        case 'kilometersRequired':
        case 'kilometersObserved':
          unit = 'km'
          break
        case 'equipmentCountRequired':
          unit = 'kpl'
          break
        default:
          unit = ''
      }

      let useVal = round(val)
      return `${useVal} ${unit}`
    }, [])

    let { averageAgeWeightedObserved, averageAgeWeightedRequired } = executionRequirement

    let getColumnTotal = useCallback(
      (key: string) => {
        if (['emissionClass', 'sanctionThreshold'].includes(key)) {
          return ''
        }

        let totalVal = round(getTotal<any, string>(requirementRows, key))

        switch (key) {
          case 'percentage':
          case 'quotaRequired':
          case 'quotaObserved':
          case 'differencePercentage':
          case 'cumulativeDifferencePercentage':
          case 'sanctionAmount':
          case 'classSanctionAmount':
            return `${totalVal}%`
          case 'kilometers':
          case 'kilometersRequired':
          case 'kilometersObserved':
            return `${totalVal} km`
          case 'equipmentCountRequired':
          case 'equipmentCountObserved':
            return `${totalVal} kpl`
          case 'averageAgeWeightedObserved':
            return `${round(averageAgeWeightedObserved || 0)} v`
          case 'averageAgeWeightedRequired':
            return `${round(averageAgeWeightedRequired || 0)} v`
          default:
            return totalVal
        }
      },
      [executionRequirement]
    )

    return (
      <ExecutionRequirementsAreaContainer>
        <ValueDisplay
          valuesPerRow={3}
          style={{ marginBottom: '1rem' }}
          item={pick(executionRequirement, [
            'totalKilometersRequired',
            ...(tableLayout === RequirementsTableLayout.BY_VALUES
              ? ['averageAgeWeightedRequired', 'averageAgeWeightedObserved']
              : ['averageAgeWeightedRequired']),
          ])}
          labels={{
            totalKilometersRequired: 'Suoritekilometrit yhteensä',
            averageAgeWeightedRequired: 'Suunniteltu painotettu keski-ikä',
            averageAgeWeightedObserved: 'Toteutunut painotettu keski-ikä',
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
          columnOrder={
            tableLayout === RequirementsTableLayout.BY_VALUES ? undefined : ['unit']
          }
          renderValue={renderTableValue}
          keyFromItem={(item) =>
            tableLayout === RequirementsTableLayout.BY_VALUES ? item.emissionClass : item.unit
          }
          getColumnTotal={
            tableLayout === RequirementsTableLayout.BY_VALUES ? getColumnTotal : undefined
          }
        />
      </ExecutionRequirementsAreaContainer>
    )
  }
)

export default ObservedRequirementsTable
