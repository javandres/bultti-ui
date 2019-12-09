import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useQueryData } from '../utils/useQueryData'
import { Operator } from '../schema-types'
import { text } from '../utils/translate'
import Dropdown from './Dropdown'
import gql from 'graphql-tag'

const operatorsQuery = gql`
  query listOperators {
    operators {
      id
      name
    }
  }
`

export type PropTypes = {
  label?: string
  selectedOperator: null | Operator
  onSelectOperator: (operator: null | Operator) => void
}

const SelectOperatorView = styled(Dropdown)``

const SelectOperator: React.FC<PropTypes> = observer(
  ({ onSelectOperator, selectedOperator = null, label }) => {
    const { data } = useQueryData({ query: operatorsQuery })

    const operators: Operator[] = useMemo(() => {
      const operatorList = data || []
      operatorList.unshift({ id: 'all', name: text('general.app.all') })
      return operatorList
    }, [data])

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
        label={label || "Valitse liikennöitsijä"}
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
