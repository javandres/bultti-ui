import React, { useCallback, useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite'
import 'react-dates/lib/css/_datepicker.css'
import moment, { Moment } from 'moment'
import { AnyFunction } from '../../type/common'
import { DayPickerSingleDateController } from 'react-dates'
import Input from './Input'
import styled from 'styled-components'
import { format, isValid, parseISO } from 'date-fns'
import '../style/reactDates.scss'
import { DATE_FORMAT } from '../../constants'

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
  maxDate?: string
  onChange: AnyFunction
  label?: string
  name?: string
}

const SelectDate: React.FC<PropTypes> = observer(
  ({ value = '', maxDate, onChange, label, name }) => {
    let [inputValue, setInputValue] = useState(value)

    const applyInputValue = useCallback(() => {
      if (inputValue !== value) {
        let inputValueDate = parseISO(inputValue)

        if (isValid(inputValueDate)) {
          onChange(format(inputValueDate, DATE_FORMAT))
        }
      }
    }, [value, inputValue, onChange])

    let currentValue = useMemo(() => {
      if (inputValue === value) {
        return value
      }

      let inputValueDate = parseISO(inputValue)
      return !isValid(inputValueDate) ? value : inputValue
    }, [inputValue, value])

    const inputName = useMemo(
      () => name || label?.toLowerCase()?.replace(' ', '_') || 'unnamed_input',
      [label, name]
    )

    const valueMoment = useMemo(
      () => (!currentValue ? moment() : moment(currentValue, 'YYYY-MM-DD')),
      [currentValue]
    )

    const maxMoment = useMemo(() => (maxDate ? moment(maxDate, 'YYYY-MM-DD') : false), [maxDate])

    const [focused, setFocused] = useState<any>(false)

    const onDateChanges = useCallback(
      (date) => {
        if (date) {
          let dateStr = date.format('YYYY-MM-DD')

          setInputValue(dateStr)
          onChange(dateStr)
        }
      },
      [onChange]
    )

    const dateIsBlocked = useCallback(
      (dateVal: Moment) => (!maxMoment ? false : dateVal.isAfter(maxMoment)),
      [maxMoment]
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
            />
          </InputContainer>
          <DatePickerWrapper focused={focused}>
            <DayPickerSingleDateController
              date={valueMoment}
              onDateChange={onDateChanges}
              onOutsideClick={onClosePicker}
              focused={focused}
              onFocusChange={onOpenPicker}
              numberOfMonths={1}
              firstDayOfWeek={1}
              isDayBlocked={dateIsBlocked}
              hideKeyboardShortcutsPanel={true}
            />
          </DatePickerWrapper>
        </InputWrapper>
      </>
    )
  }
)

export default SelectDate
