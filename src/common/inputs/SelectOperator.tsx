import React, { useCallback, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useQueryData } from '../../utils/useQueryData'
import { Operator, User, UserRole } from '../../schema-types'
import { text } from '../../utils/translate'
import Dropdown from './Dropdown'
import gql from 'graphql-tag'
import { compact } from 'lodash'
import { useStateValue } from '../../state/useAppState'
import { operatorIsAuthorized } from '../../utils/operatorIsAuthorized'

const operatorsQuery = gql`
  query listOperators {
    operators {
      id
      operatorId
      operatorName
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
    const [user] = useStateValue<User>('user')

    const operators: Operator[] = useMemo(() => {
      let operatorList = !data ? [] : compact([...data])

      // Limit the selection to the currently logged in operator if applicable
      if (user && user.role === UserRole.OperatorUser) {
        operatorList = operatorList.filter((op) => operatorIsAuthorized(op, user))
      }

      // "..." and "all" options are not added if the operators list is only 1 long

      if (
        operatorList.length > 1 &&
        allowAll &&
        !['all', 'unselected'].includes(operatorList[0]?.id)
      ) {
        operatorList.unshift({ id: 'all', operatorName: text('general.app.all') })
      } else if (
        operatorList.length > 1 &&
        !allowAll &&
        !['all', 'unselected'].includes(operatorList[0]?.id)
      ) {
        operatorList.unshift({ id: 'unselected', operatorName: '...' })
      }

      return operatorList
    }, [user, data, allowAll])

    // Auto-select the first operator if there is only one.
    useEffect(() => {
      if (!value && operators.length === 1) {
        onSelect(operators[0])
      }
    }, [value, operators, onSelect])

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
      () => (!value ? operators[0] : operators.find((op) => value.id === op.id) || operators[0]),
      [operators, value]
    )

    /* Disable if empty or only one item (in which case it will be auto-selected */

    return (
      <OperatorSelect
        disabled={operators.length < 2}
        className={className}
        theme={theme}
        label={
          !label ? (operators.length === 1 ? 'Liikennöitsijä' : 'Valitse liikennöitsijä') : label
        }
        items={operators}
        onSelect={onSelectOperator}
        selectedItem={currentOperator}
        itemToString="id"
        itemToLabel="operatorName"
      />
    )
  }
)

export default SelectOperator
