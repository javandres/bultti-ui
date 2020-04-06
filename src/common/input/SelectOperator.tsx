import React, { useCallback, useEffect, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { useQueryData } from '../../util/useQueryData'
import { Operator, User, UserRole } from '../../schema-types'
import { text } from '../../util/translate'
import Dropdown from './Dropdown'
import gql from 'graphql-tag'
import { compact } from 'lodash'
import { useStateValue } from '../../state/useAppState'
import { operatorIsAuthorized } from '../../util/operatorIsAuthorized'
import { isNumeric } from '../../util/isNumeric'

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
  selectInitialId?: number
}

export const operatorIsValid = (operator: Operator | null | undefined) => {
  if (!operator) {
    return false
  }

  if (['all', 'unselected'].includes(operator?.id as any) || !isNumeric(operator?.id)) {
    return false
  }

  return true
}

const SelectOperator: React.FC<PropTypes> = observer(
  ({
    onSelect,
    value = null,
    label,
    className,
    theme = 'light',
    allowAll = false,
    selectInitialId,
  }) => {
    const { data } = useQueryData(operatorsQuery)
    const [user] = useStateValue<User>('user')

    const operators: Operator[] = useMemo(() => {
      let operatorList = !data ? [] : compact([...data])
      let userIsOperator = user && user?.role === UserRole.OperatorUser

      // Limit the selection to the currently logged in operator if applicable
      if (userIsOperator) {
        operatorList = operatorList.filter((op) => operatorIsAuthorized(op, user))
      }

      // "..." and "all" options are not added if the operators list is only 1 long

      if (!userIsOperator && allowAll && !['all', 'unselected'].includes(operatorList[0]?.id)) {
        operatorList.unshift({ id: 'all', operatorName: text('general.app.all') })
      } else if (
        !userIsOperator &&
        !allowAll &&
        !['all', 'unselected'].includes(operatorList[0]?.id)
      ) {
        operatorList.unshift({ id: 'unselected', operatorName: '...' })
      }

      return operatorList
    }, [user, data, allowAll])

    // Auto-select the first operator if there is only one.
    useEffect(() => {
      const firstOperator = operators[0]

      if (!value && operators.length === 1 && operatorIsValid(firstOperator)) {
        onSelect(operators[0])
      } else if (!value && operators.length !== 0 && selectInitialId) {
        let initialOperator = operators.find((op) => op.id === selectInitialId)

        if (initialOperator) {
          onSelect(initialOperator)
        }
      }
    }, [value, operators, onSelect, selectInitialId])

    const onSelectOperator = useCallback(
      (selectedItem) => {
        let selectValue = selectedItem

        if (!selectedItem || !operatorIsValid(selectValue)) {
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
      <Dropdown
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
