import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import Table from '../common/table/Table'
import { isNumeric } from '../util/isNumeric'
import { ObservedExecutionValue } from '../schema-types'
import { orderBy } from 'lodash'
import { getTotal } from '../util/getTotal'
import { round } from '../util/round'
import { EditValue, TableEditProps } from '../common/table/tableUtils'
import { DEFAULT_DECIMALS } from '../constants'
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

export type EditObservedRequirementValue = EditValue<ObservedExecutionValue>

export interface IObservedExecutionRequirement {
  observedRequirements: ObservedExecutionValue[]
  kilometersRequired?: number | null
}

export type PropTypes = {
  executionRequirement: IObservedExecutionRequirement
  isEditable?: boolean
} & TableEditProps<ObservedExecutionValue>

const valuesLayoutColumnLabels: { [key in keyof ObservedExecutionValue]?: string } = {
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
    let requirementRows: ObservedExecutionValue[] = useMemo(() => {
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

      return `${getThousandSeparatedNumber(round(val, 6))} ${unit}`
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

        let totalValue = getThousandSeparatedNumber(
          round(getTotal<any, string>(requirementRows, key), DEFAULT_DECIMALS)
        )
        switch (key) {
          case 'quotaRequired':
          case 'quotaObserved':
          case 'cumulativeDifferencePercentage':
          case 'sanctionablePercentage':
          case 'sanctionAmount':
            return `${totalValue}%`
          case 'kilometersRequired':
          case 'kilometersObserved':
            return `${totalValue} km`
          case 'equipmentCountRequired':
          case 'equipmentCountObserved':
            return `${totalValue} kpl`
          default:
            return totalValue
        }
      },
      [requirementRows]
    )

    return (
      <ExecutionRequirementsAreaContainer>
        <Table<ObservedExecutionValue>
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
