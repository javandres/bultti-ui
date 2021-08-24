import React, { CSSProperties, useCallback, useEffect, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { useQueryData } from '../../util/useQueryData'
import { Operator, UserRole } from '../../schema-types'
import { gql } from '@apollo/client'
import { compact } from 'lodash'
import { useStateValue } from '../../state/useAppState'
import { operatorIsAuthorized } from '../../util/operatorIsAuthorized'
import { isNumeric } from '../../util/isNumeric'
import { unselectedOperator } from '../../state/UIStore'
import { SidebarStyledDropdown } from '../components/SidebarStyledDropdown'

const operatorsQuery = gql`
  query listOperators {
    operators {
      id
      operatorIds
      operatorName
    }
  }
`

export type SelectOperatorPropTypes = {
  label?: string | null
  className?: string
  style?: CSSProperties
  value: Operator | number
  onSelect: (operator?: Operator) => void
  selectInitialId?: number
  disabled?: boolean
}

export const operatorIsValid = (operator: Operator | number | null | undefined) => {
  return (
    operator &&
    typeof operator !== 'number' &&
    operator.id !== unselectedOperator.id &&
    isNumeric(operator.id)
  )
}

const SelectOperator: React.FC<SelectOperatorPropTypes> = observer(
  ({ onSelect, value, label, className, style, disabled = false, selectInitialId }) => {
    const { data } = useQueryData<Operator[]>(operatorsQuery)
    const [user] = useStateValue('user')

    let userIsOperator = useMemo(() => user && user?.role === UserRole.Operator, [user])

    const operators: Operator[] = useMemo(() => {
      let operatorList = !data ? [] : compact([...data])

      // Limit the selection to the currently logged in operator if applicable
      if (userIsOperator) {
        operatorList = operatorList.filter((op) => operatorIsAuthorized(op, user))
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
        if (!operatorIsValid(value) && operatorIsValid(initialOperator)) {
          onSelect(initialOperator)
        }
      }
    }, [userIsOperator, value, operators, onSelect, selectInitialId])

    const onSelectOperator = useCallback(
      (selectedItem) => {
        let selectValue = selectedItem

        if (!selectedItem || !operatorIsValid(selectedItem)) {
          selectValue = null
        }

        onSelect(selectValue)
      },
      [onSelect]
    )

    const currentOperator = useMemo(() => {
      let valueId = typeof value === 'number' ? value : value?.id
      return !valueId ? undefined : operators.find((op) => valueId === op.id) || operators[0]
    }, [operators, value])

    return (
      <SidebarStyledDropdown
        testId="operator_select"
        disabled={disabled || operators.length < 2}
        className={className}
        style={style}
        label={label || undefined}
        items={operators}
        onSelect={onSelectOperator}
        selectedItem={currentOperator}
        unselectedValue={unselectedOperator}
        itemToString="id"
        itemToLabel="operatorName"
      />
    )
  }
)

export default SelectOperator
