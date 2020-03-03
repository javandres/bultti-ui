import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useQueryData } from '../../utils/useQueryData'
import { Operator } from '../../schema-types'
import { text } from '../../utils/translate'
import Dropdown from './Dropdown'
import gql from 'graphql-tag'
import { compact } from 'lodash'

const operatorsQuery = gql`
  query listOperators {
    operators {
      id
      name
    }
  }
`

export type PropTypes = {
  label?: string | null
  className?: string
  theme?: 'light' | 'dark'
  allowAll?: boolean
  value: null | Operator
  onSelect: (operator: null | Operator) => void
}

const OperatorSelect = styled(Dropdown)``

const SelectOperator: React.FC<PropTypes> = observer(
  ({ onSelect, value = null, label, className, theme = 'light', allowAll = false }) => {
    const { data } = useQueryData(operatorsQuery)

    const operators: Operator[] = useMemo(() => {
      const operatorList = !data ? [] : compact([...data])

      if (allowAll && !['all', 'unselected'].includes(operatorList[0]?.id)) {
        operatorList.unshift({ id: 'all', name: text('general.app.all') })
      } else if (!allowAll && !['all', 'unselected'].includes(operatorList[0]?.id)) {
        operatorList.unshift({ id: 'unselected', name: '...' })
      }

      return operatorList
    }, [data, allowAll])

    const onSelectOperator = useCallback(
      (selectedItem) => {
        let selectValue = selectedItem

        if (!selectedItem || selectedItem?.id === 'all') {
          selectValue = null
        }

        onSelect(selectValue)
      },
      [onSelect]
    )

    const currentOperator = useMemo(
      () =>
        !value ? operators[0] : operators.find((op) => value.id === op.id) || operators[0],
      [operators, value]
    )

    return (
      <OperatorSelect
        className={className}
        theme={theme}
        label={!label ? "" : label || 'Valitse liikennöitsijä'}
        items={operators}
        onSelect={onSelectOperator}
        selectedItem={currentOperator}
        itemToString="id"
        itemToLabel="name"
      />
    )
  }
)

export default SelectOperator
