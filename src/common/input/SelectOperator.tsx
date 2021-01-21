import React, { CSSProperties, useCallback, useEffect, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { useQueryData } from '../../util/useQueryData'
import { Operator, User, UserRole } from '../../schema-types'
import Dropdown, { DropdownItem } from './Dropdown'
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
  style?: CSSProperties
  theme?: 'light' | 'dark'
  value: null | Operator | number
  onSelect: (operator: null | Operator) => void
  selectInitialId?: number
  disabled?: boolean
  useUnselected?: boolean
}

const unselectedId = 0
const unselectedName = '...'

export const operatorIsValid = (operator: Operator | number | null | undefined) => {
  if (
    !operator ||
    typeof operator === 'number' ||
    operator?.id === unselectedId ||
    !isNumeric(operator?.id)
  ) {
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
    style,
    theme = 'light',
    disabled = false,
    selectInitialId,
    useUnselected = true,
  }) => {
    const { data } = useQueryData(operatorsQuery)
    const [user] = useStateValue<User>('user')

    let userIsOperator = useMemo(() => user && user?.role === UserRole.Operator, [user])

    const operators: Operator[] = useMemo(() => {
      let operatorList = !data ? [] : compact([...data])

      // Limit the selection to the currently logged in operator if applicable
      if (userIsOperator) {
        operatorList = operatorList.filter((op) => operatorIsAuthorized(op, user))
      }

      // The "..." option is not added if the operators list is only 1 long
      if (useUnselected && operatorList[0]?.id !== unselectedId && operatorList.length !== 1) {
        operatorList.unshift({
          id: unselectedId,
          operatorName: unselectedName,
        })
      }

      return operatorList
    }, [userIsOperator, data, useUnselected])

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
      (selectedItem: DropdownItem) => {
        let selectValue: Operator | null = null
        let selectedOperator = operators.find(
          (operator) => operator.id === selectedItem.value
        )!

        if (operatorIsValid(selectedOperator)) {
          onSelect(selectedOperator)
        } else {
          onSelect(null)
        }
      },
      [onSelect]
    )

    const currentOperator = useMemo(() => {
      let valueId = typeof value === 'number' ? value : value?.id

      return !valueId ? null : operators.find((op) => valueId === op.id) || operators[0]
    }, [operators, value])

    let getDropdownItem = (operator: Operator): DropdownItem => {
      return {
        label: operator.operatorName,
        value: operator.id,
      }
    }
    let dropdownItems: DropdownItem[] = operators.map((operator: Operator) =>
      getDropdownItem(operator)
    )
    let selectedItem: DropdownItem | null = currentOperator
      ? getDropdownItem(currentOperator)
      : null

    return (
      <Dropdown
        disabled={disabled || operators.length < 2}
        className={className}
        style={style}
        theme={theme}
        label={label || undefined}
        items={dropdownItems}
        onSelect={onSelectOperator}
        selectedItem={selectedItem}
      />
    )
  }
)

export default SelectOperator
