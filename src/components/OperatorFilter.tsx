import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { useQueryData } from '../utils/useQueryData'
import gql from 'graphql-tag'
import { text } from '../utils/translate'
import { observer } from 'mobx-react-lite'
import { useStateValue } from '../state/useAppState'
import { Operator } from '../schema-types'
import Dropdown from './Dropdown'

const vehiclesQuery = gql`
  query listOperators {
    operators {
      id
      name
    }
  }
`

const OperatorFilterView = styled(Dropdown)``

const OperatorFilter = observer(() => {
  const [operator, setOperatorFilter] = useStateValue('globalOperator')
  const { data } = useQueryData({ query: vehiclesQuery })

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

      setOperatorFilter(selectValue)
    },
    [setOperatorFilter]
  )

  const selectedOperator = useMemo(
    () =>
      !operator ? operators[0] : operators.find((op) => operator.id === op.id) || operators[0],
    [operators, operator]
  )

  return (
    <OperatorFilterView
      label="Valitse liikennöitsijä"
      items={operators}
      onSelect={onSelect}
      selectedItem={selectedOperator}
      itemToString="id"
      itemToLabel="name"
    />
  )
})

export default OperatorFilter
