import React, { useCallback, useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite'
import 'react-dates/lib/css/_datepicker.css'
import moment, { Moment } from 'moment'
import { AnyFunction } from '../../type/common'
import { DayPickerSingleDateController } from 'react-dates'
import Input from './Input'
import styled from 'styled-components'
import '../style/reactDates.scss'
import { DATE_FORMAT_MOMENT } from '../../constants'
import { isValid, parseISO } from 'date-fns'

moment.locale('fi')

const InputWrapper = styled.div`
  position: relative;
`

const InputContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  width: 100%;

  > div {
    flex: 1 1 auto;
  }

  &:last-child {
    margin-right: 0;
  }
`

const DatePickerWrapper = styled.div<{ focused: boolean }>`
  position: absolute;
  margin-top: 0.5rem;
  opacity: ${(p) => (p.focused ? 1 : 0)};
  pointer-events: ${(p) => (p.focused ? 'all' : 'none')};
  z-index: ${(p) => (p.focused ? 100 : -1)};
`

export type PropTypes = {
  value: string
  minDate?: string
  maxDate?: string
  onChange: AnyFunction
  label?: string
  name?: string
  disabled?: boolean
}

const SelectDate: React.FC<PropTypes> = observer(
  ({ disabled = false, value = '', maxDate, minDate, onChange, label, name }) => {
    let [inputValue, setInputValue] = useState(value)

    const minMoment = useMemo(() => (minDate ? moment(minDate, DATE_FORMAT_MOMENT) : false), [
      minDate,
    ])
    const maxMoment = useMemo(() => (maxDate ? moment(maxDate, DATE_FORMAT_MOMENT) : false), [
      maxDate,
    ])

    const getValidDate = useCallback(
      (dateVal: Moment | Date | string): Moment | null => {
        let momentVal = moment(dateVal)

        if (!momentVal.isValid()) {
          return !!value ? moment(value) : null
        }

        let validVal = momentVal.clone()

        if (maxMoment && validVal.isSameOrAfter(maxMoment, 'day')) {
          validVal = maxMoment.clone()
        }

        if (minMoment && validVal.isSameOrBefore(minMoment, 'day')) {
          validVal = minMoment.clone()
        }

        return validVal
      },
      [maxMoment, minMoment]
    )

    let currentValue = useMemo((): string => {
      if (inputValue === value || !isValid(parseISO(inputValue))) {
        return value
      }

      let validInput = getValidDate(inputValue)
      return validInput ? validInput.format(DATE_FORMAT_MOMENT) : value
    }, [inputValue, value, getValidDate])

    const inputName = useMemo(
      () => name || label?.toLowerCase()?.replace(' ', '_') || 'unnamed_input',
      [label, name]
    )

    const valueMoment = useMemo(
      () => (!currentValue ? moment() : moment(currentValue, DATE_FORMAT_MOMENT)),
      [currentValue]
    )

    const [focused, setFocused] = useState<any>(false)

    const applyInputValue = useCallback(() => {
      if (inputValue !== value) {
        let validDate = getValidDate(inputValue)?.format(DATE_FORMAT_MOMENT)

        if (validDate) {
          onChange(validDate)
          setInputValue(validDate)
          setFocused(false)
        }
      }
    }, [value, inputValue, onChange, getValidDate])

    const onDateChange = useCallback(
      (date) => {
        if (date) {
          let validDate = getValidDate(date)

          if (validDate) {
            let validDateStr = validDate.format(DATE_FORMAT_MOMENT)

            setInputValue(validDateStr)
            onChange(validDateStr)
          }
        }
      },
      [onChange, getValidDate, maxMoment, minMoment]
    )

    const onOpenPicker = useCallback((value) => {
      const focusVal = typeof value?.focused !== 'undefined' ? value?.focused : true
      setFocused(focusVal)
    }, [])

    const onClosePicker = useCallback(
      (e) => {
        if (e.target.name !== inputName) {
          setFocused(false)
        }
      },
      [focused, inputName]
    )

    let dateIsBlocked = useCallback(
      (value: Moment) => {
        if (maxMoment && value.isAfter(maxMoment)) {
          return true
        }

        if (minMoment && value.isBefore(minMoment)) {
          return true
        }

        return false
      },
      [minMoment, maxMoment]
    )

    return (
      <>
        <InputWrapper>
          <InputContainer>
            <Input
              name={inputName}
              subLabel={true}
              label={label}
              value={inputValue}
              onChange={setInputValue}
              onFocus={onOpenPicker}
              onBlur={applyInputValue}
              onEnterPress={applyInputValue}
              disabled={disabled}
            />
          </InputContainer>
          {!disabled && (
            <DatePickerWrapper focused={focused}>
              <DayPickerSingleDateController
                date={valueMoment}
                onDateChange={onDateChange}
                onOutsideClick={onClosePicker}
                focused={focused}
                onFocusChange={onOpenPicker}
                numberOfMonths={1}
                firstDayOfWeek={1}
                isDayBlocked={dateIsBlocked}
                hideKeyboardShortcutsPanel={true}
              />
            </DatePickerWrapper>
          )}
        </InputWrapper>
      </>
    )
  }
)

export default SelectDate
