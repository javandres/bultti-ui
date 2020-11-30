import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { AnyFunction } from '../../type/common'
import Input from './Input'
import styled from 'styled-components'
import '../style/reactDates.scss'
import { DATE_FORMAT } from '../../constants'
import { format, isAfter, isBefore, isValid, parseISO } from 'date-fns'
import { isEmpty } from 'lodash'

const InputWrapper = styled.div`
  position: relative;
`

const InputContainer = styled.div`
  width: 100%;

  &:last-child {
    margin-right: 0;
  }
`

export type PropTypes = {
  value: string
  minDate?: string
  maxDate?: string
  onChange: AnyFunction
  label?: string
  name?: string
  disabled?: boolean
  alignDatepicker?: string
}

const SelectDate: React.FC<PropTypes> = observer(
  ({
    disabled = false,
    value = '',
    maxDate,
    minDate,
    onChange,
    label,
    name,
    alignDatepicker = 'left',
  }) => {
    // The local input state.
    let [inputValue, setInputValue] = useState<string>(value)

    // Validate the value to be a valid date and between the max and min limits, if any.
    const getValidDate = useCallback(
      (val: Date | string): Date | null => {
        let dateVal = val instanceof Date ? val : parseISO(val)

        if (!isValid(dateVal)) {
          return null
        }

        if (maxDate) {
          let maxDateVal = parseISO(maxDate)

          if (isAfter(dateVal, maxDateVal)) {
            dateVal = maxDateVal
          }
        }

        if (minDate) {
          let minDateVal = parseISO(minDate)

          if (isBefore(dateVal, minDateVal)) {
            dateVal = minDateVal
          }
        }

        return dateVal
      },
      [maxDate, minDate]
    )

    // Get the current value for the field. The local input state has precedence,
    // but we can fall back on the props value if needed.
    let currentValue = useMemo((): string => {
      if (inputValue === value || !isValid(parseISO(inputValue))) {
        return value
      }

      let validInput = getValidDate(inputValue)
      return validInput ? format(validInput, DATE_FORMAT) : value
    }, [inputValue, value, getValidDate])

    // Update the local input state when then value from props changes
    useEffect(() => {
      if (inputValue !== value) {
        let validDate = getValidDate(value)

        if (validDate) {
          setInputValue(format(validDate, DATE_FORMAT))
        }
      }
    }, [value])

    const inputName = useMemo(
      () => name || label?.toLowerCase()?.replace(' ', '_') || 'unnamed_input',
      [label, name]
    )

    useEffect(() => {
      let validDate = getValidDate(inputValue)
      if (!validDate && !isEmpty(inputValue)) {
        // Should not happen
        throw `Could not convert inputValue as a valid Date object. Given inputValue: ${inputValue}`
      }
      const onChangeValue = isEmpty(inputValue) ? '' : format(validDate!, DATE_FORMAT)
      onChange(onChangeValue)
    }, [inputValue])

    return (
      <>
        <InputWrapper>
          <InputContainer>
            <Input
              name={inputName}
              type="date"
              subLabel={true}
              label={label}
              value={currentValue}
              onChange={setInputValue}
              disabled={disabled}
              min={minDate}
              max={maxDate}
              pattern="\d{4}-\d{2}-\d{2}"
            />
          </InputContainer>
        </InputWrapper>
      </>
    )
  }
)

export default SelectDate
