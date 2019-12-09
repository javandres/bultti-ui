import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useQueryData } from '../utils/useQueryData'
import { Operator } from '../schema-types'
import { text } from '../utils/translate'
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
  selectedOperator: null | Operator
  onSelectOperator: (operator: null | Operator) => void
}

const SelectOperatorView = styled(Dropdown)``

const SelectOperator: React.FC<PropTypes> = observer(
  ({
    onSelectOperator,
    selectedOperator = null,
    label,
    className,
    theme = 'light',
    allowAll = false,
  }) => {
    const { data } = useQueryData({ query: operatorsQuery })

    const operators: Operator[] = useMemo(() => {
      const operatorList = !data ? [] : compact([...data])

      if (allowAll && operatorList[0]?.id !== 'all') {
        operatorList.unshift({ id: 'all', name: text('general.app.all') })
      }

      return operatorList
    }, [data, allowAll])

    const onSelect = useCallback(
      (selectedItem) => {
        let selectValue = selectedItem

        if (!selectedItem || selectedItem?.id === 'all') {
          selectValue = null
        }

        onSelectOperator(selectValue)
      },
      [onSelectOperator]
    )

    const currentOperator = useMemo(
      () =>
        !selectedOperator
          ? operators[0]
          : operators.find((op) => selectedOperator.id === op.id) || operators[0],
      [operators, selectedOperator]
    )

    return (
      <SelectOperatorView
        className={className}
        theme={theme}
        label={!label ? null : label || 'Valitse liikennöitsijä'}
        items={operators}
        onSelect={onSelect}
        selectedItem={currentOperator}
        itemToString="id"
        itemToLabel="name"
      />
    )
  }
)

export default SelectOperator
