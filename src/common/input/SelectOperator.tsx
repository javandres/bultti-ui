import React, { useCallback, useEffect, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { useQueryData } from '../../util/useQueryData'
import { Operator, User, UserRole } from '../../schema-types'
import Dropdown from './Dropdown'
import { gql } from '@apollo/client'
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
  value: null | Operator | number
  onSelect: (operator: null | Operator) => void
  selectInitialId?: number
}

const unselectedId = 0

export const operatorIsValid = (operator: Operator | number | null | undefined) => {
  if (!operator || typeof operator === 'number') {
    return false
  }

  if (operator?.id === unselectedId || !isNumeric(operator?.id)) {
    return false
  }

  return true
}

const SelectOperator: React.FC<PropTypes> = observer(
  ({ onSelect, value = null, label, className, theme = 'light', selectInitialId }) => {
    const { data } = useQueryData(operatorsQuery)
    const [user] = useStateValue<User>('user')

    let userIsOperator = useMemo(() => user && user?.role === UserRole.OperatorUser, [user])

    const operators: Operator[] = useMemo(() => {
      let operatorList = !data ? [] : compact([...data])

      // Limit the selection to the currently logged in operator if applicable
      if (userIsOperator) {
        operatorList = operatorList.filter((op) => operatorIsAuthorized(op, user))
      }

      // The "..." option is not added if the operators list is only 1 long
      if (operatorList[0]?.id !== unselectedId && operatorList.length !== 1) {
        operatorList.unshift({ id: unselectedId, operatorName: '...' })
      }

      return operatorList
    }, [userIsOperator, data])

    // Auto-select the first operator if there is only one, or the initially selected id.
    useEffect(() => {
      // If the user is an operator user, preselect the first operator option.
      if (userIsOperator) {
        let userOperator = operators.find(operatorIsValid) || null
        let valueIsSelected =
          typeof value === 'number'
            ? userOperator?.id === value
            : userOperator?.id === value?.id

        if (userOperator && (!value || !valueIsSelected)) {
          onSelect(userOperator)
        }
      } else {
        let initialOperator = operators.find((s) => s.id === selectInitialId)

        // Preselect the initial operator if there isn't a value already.
        if (!operatorIsValid(value) && initialOperator) {
          onSelect(initialOperator)
        }
      }
    }, [userIsOperator, value, operators, onSelect, selectInitialId])

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

    const currentOperator = useMemo(() => {
      let valueId = typeof value === 'number' ? value : value?.id

      return !valueId
        ? operators[0]
        : operators.find((op) => valueId === op.id) || operators[0]
    }, [operators, value])

    /* Disable if empty or only one item (in which case it will be auto-selected */

    return (
      <Dropdown
        disabled={operators.length < 2}
        className={className}
        theme={theme}
        label={
          !label
            ? operators.length === 1
              ? 'Liikennöitsijä'
              : 'Valitse liikennöitsijä'
            : label
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
