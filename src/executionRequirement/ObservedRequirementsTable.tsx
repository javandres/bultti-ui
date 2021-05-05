import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import Table from '../common/table/Table'
import { isNumeric } from '../util/isNumeric'
import { ObservedEmissionClassRequirement } from '../schema-types'
import { orderBy } from 'lodash'
import { getTotal } from '../util/getTotal'
import { round } from '../util/round'
import { EditValue, TableEditProps } from '../common/table/tableUtils'
import { DEFAULT_DECIMALS, DEFAULT_PERCENTAGE_DECIMALS } from '../constants'
import { getThousandSeparatedNumber } from '../util/formatNumber'

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

export type EditObservedRequirementValue = EditValue<ObservedEmissionClassRequirement>

export interface IObservedExecutionRequirement {
  observedRequirements: ObservedEmissionClassRequirement[]
  kilometersRequired?: number | null
}

export type PropTypes = {
  executionRequirement: IObservedExecutionRequirement
  isEditable?: boolean
} & TableEditProps<ObservedEmissionClassRequirement>

const valuesLayoutColumnLabels: {
  [key in keyof ObservedEmissionClassRequirement]?: string
} = {
  emissionClass: 'Päästöluokka',
  kilometersRequired: 'Kaavioiden km',
  kilometersObserved: 'Toteuma km',
  quotaRequired: '% Osuus',
  quotaObserved: 'Toteuma % osuus',
  differencePercentage: '% ero',
  differenceKilometers: 'Km ero',
  cumulativeDifferencePercentage: 'Kumul. % ero',
  sanctionThreshold: 'Sanktioraja',
  sanctionAmount: 'Sanktiomäärä',
  sanctionablePercentage: 'Sanktioitavat',
  equipmentCountRequired: 'Vaatimus kpl',
  equipmentCountObserved: 'Toteuma kpl',
}

const ObservedRequirementsTable: React.FC<PropTypes> = observer(
  ({
    executionRequirement,
    onEditValue,
    onSaveEdit,
    onCancelEdit,
    pendingValues,
    isEditable = false,
  }) => {
    let requirementRows: ObservedEmissionClassRequirement[] = useMemo(() => {
      let requirementValues = executionRequirement.observedRequirements
      return orderBy(requirementValues, 'emissionClass', 'desc')
    }, [executionRequirement])

    let renderTableValue = useCallback((key, val, isHeader = false, item) => {
      if (isHeader || ['unit'].includes(key || '') || !isNumeric(val) || val === 0) {
        return val
      }

      let unit = ''

      switch (item?.unit || key) {
        case 'quotaRequired':
        case 'quotaObserved':
        case 'differencePercentage':
        case 'cumulativeDifferencePercentage':
        case 'sanctionThreshold':
        case 'sanctionablePercentage':
        case 'sanctionAmount':
          unit = '%'
          break
        case 'kilometersRequired':
        case 'kilometersObserved':
        case 'differenceKilometers':
          unit = 'km'
          break
        case 'equipmentCountRequired':
          unit = 'kpl'
          break
        default:
          unit = ''
      }

      let decimalCount = unit === '%' ? DEFAULT_PERCENTAGE_DECIMALS : DEFAULT_DECIMALS

      return `${getThousandSeparatedNumber(round(val, decimalCount))} ${unit}`
    }, [])

    let getColumnTotal = useCallback(
      (key: string) => {
        if (
          [
            'differencePercentage',
            'differenceKilometers',
            'emissionClass',
            'sanctionThreshold',
          ].includes(key)
        ) {
          return ''
        }

        let unit

        switch (key) {
          case 'quotaRequired':
          case 'quotaObserved':
          case 'cumulativeDifferencePercentage':
          case 'sanctionablePercentage':
          case 'sanctionAmount':
            unit = '%'
            break
          case 'kilometersRequired':
          case 'kilometersObserved':
            unit = 'km'
            break
          case 'equipmentCountRequired':
          case 'equipmentCountObserved':
            unit = 'kpl'
            break
          default:
            unit = ''
        }

        let decimalCount = unit === '%' ? DEFAULT_PERCENTAGE_DECIMALS : DEFAULT_DECIMALS

        let totalVal = getThousandSeparatedNumber(
          round(
            getTotal(requirementRows, key as keyof ObservedEmissionClassRequirement),
            decimalCount
          )
        )

        return `${totalVal} ${unit}`
      },
      [requirementRows]
    )

    return (
      <ExecutionRequirementsAreaContainer>
        <Table<ObservedEmissionClassRequirement>
          items={requirementRows}
          columnLabels={valuesLayoutColumnLabels}
          renderValue={renderTableValue}
          keyFromItem={(item) => item.emissionClass + ''}
          getColumnTotal={getColumnTotal}
          editableValues={isEditable ? ['quotaRequired'] : undefined}
          onEditValue={onEditValue}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
          pendingValues={pendingValues}
          showToolbar={false}
        />
      </ExecutionRequirementsAreaContainer>
    )
  }
)

export default ObservedRequirementsTable
