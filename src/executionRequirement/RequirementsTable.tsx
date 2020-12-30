import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { round } from '../util/round'
import Table from '../common/components/Table'
import { isNumeric } from '../util/isNumeric'
import { ExecutionRequirementValue } from '../schema-types'
import { orderBy, pick } from 'lodash'
import ValueDisplay from '../common/components/ValueDisplay'
import { getTotal } from '../util/getTotal'
import {
  emissionClassLayoutColumnLabels,
  RequirementsTableLayout,
} from './executionRequirementUtils'

const ExecutionRequirementsAreaContainer = styled.div`
  margin-top: 1rem;
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

export interface IExecutionRequirement {
  requirements: ExecutionRequirementValue[]
  totalKilometers?: number | null
  averageAgeWeighted?: number | null
  averageAgeWeightedFulfilled?: number | null
}

export type PropTypes = {
  executionRequirement: IExecutionRequirement
  tableLayout?: RequirementsTableLayout
}

const valuesLayoutColumnLabels: { [key in keyof ExecutionRequirementValue]?: string } = {
  emissionClass: 'Päästöluokka',
  kilometerRequirement: 'Km vaatimus',
  quotaRequirement: '% Osuus',
  equipmentCount: 'Vaatimus kpl',
  kilometersFulfilled: 'Toteuma km',
  quotaFulfilled: 'Toteuma % osuus',
  differencePercentage: '% ero',
  cumulativeDifferencePercentage: 'Kumul. % ero',
  equipmentCountFulfilled: 'Toteuma kpl',
  sanctionThreshold: 'Sanktioraja',
  sanctionAmount: 'Sanktioitavat',
  classSanctionAmount: 'Sanktiomäärä',
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
      let displayUnit = key === 'totalKilometers' ? 'km' : 'vuotta'

      return `${displayVal} ${displayUnit}`
    }, [])

    let renderTableValue = useCallback((key, val, isHeader = false, item) => {
      if (isHeader || key === 'unit' || !isNumeric(val) || val === 0) {
        return val
      }

      let unit

      switch (item?.unit || key) {
        case 'percentage':
        case 'quotaRequirement':
        case 'quotaFulfilled':
        case 'differencePercentage':
        case 'cumulativeDifferencePercentage':
        case 'sanctionThreshold':
        case 'sanctionAmount':
        case 'classSanctionAmount':
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
        if (['emissionClass', 'sanctionThreshold'].includes(key)) {
          return ''
        }

        let totalVal = round(getTotal<any, string>(requirementRows, key))

        switch (key) {
          case 'percentage':
          case 'quotaRequirement':
          case 'quotaFulfilled':
          case 'differencePercentage':
          case 'cumulativeDifferencePercentage':
          case 'sanctionAmount':
          case 'classSanctionAmount':
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
          valuesPerRow={3}
          style={{ marginBottom: '1rem' }}
          item={pick(executionRequirement, [
            'totalKilometers',
            ...(tableLayout === RequirementsTableLayout.BY_VALUES
              ? ['averageAgeWeighted', 'averageAgeWeightedFulfilled']
              : ['averageAgeWeighted']),
          ])}
          labels={{
            totalKilometers: 'Suoritekilometrit yhteensä',
            averageAgeWeighted: 'Painotettu keski-ikä',
            averageAgeWeightedFulfilled: 'Toteutunut keski-ikä',
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

export default RequirementsTable
