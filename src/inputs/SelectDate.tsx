import React, { useCallback, useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite'
import 'react-dates/lib/css/_datepicker.css'
import moment, { Moment } from 'moment'
import { AnyFunction } from '../types/common'
import { DayPickerSingleDateController } from 'react-dates'
import Input from './Input'
import styled from 'styled-components'
import { isValid, parseISO } from 'date-fns'
import '../style/reactDates.scss'

moment.locale('fi')

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 1rem;
`

const InputContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  margin-bottom: 0.5rem;

  > div {
    flex: 1 1 auto;
  }

  &:last-child {
    margin-right: 0;
  }
`

const DatePickerWrapper = styled.div<{ focused: boolean }>`
  position: absolute;
  opacity: ${(p) => (p.focused ? 1 : 0)};
  pointer-events: ${(p) => (p.focused ? 'all' : 'none')};
  z-index: ${(p) => (p.focused ? 100 : -1)};
`

export type PropTypes = {
  value: string
  maxDate?: string
  onChange: AnyFunction
  label?: string
}

const SelectDate: React.FC<PropTypes> = observer(({ value, maxDate, onChange, label }) => {
  const valueMoment = useMemo(() => (!value ? moment() : moment(value, 'YYYY-MM-DD')), [value])
  const maxMoment = useMemo(() => (maxDate ? moment(maxDate, 'YYYY-MM-DD') : false), [maxDate])

  const [focused, setFocused] = useState<any>(false)

  const onDateChanges = useCallback(
    (date) => {
      if (date) {
        onChange(date.format('YYYY-MM-DD'))
      }
    },
    [onChange]
  )

  const dateIsValid = useCallback((dateVal: string) => isValid(parseISO(dateVal)), [])

  const dateIsBlocked = useCallback(
    (dateVal: Moment) => (!maxMoment ? false : dateVal.isAfter(maxMoment)),
    [maxMoment]
  )

  const onSetFocused = useCallback((value) => {
    const focusVal = typeof value?.focused !== 'undefined' ? value?.focused : true
    setFocused(focusVal)
  }, [])

  const onInputBlur = useCallback(
    (e) => {
      if (focused) {
        setTimeout(() => {
          setFocused(false)
        }, 200)
      }
    },
    [focused]
  )

  return (
    <>
      <InputWrapper>
        <InputContainer>
          <Input
            subLabel={true}
            label={label}
            value={value}
            onChange={onChange}
            onFocus={onSetFocused}
            onBlur={onInputBlur}
            reportChange={dateIsValid}
          />
        </InputContainer>
        <DatePickerWrapper focused={focused}>
          <DayPickerSingleDateController
            date={valueMoment}
            onDateChange={onDateChanges}
            focused={focused}
            onFocusChange={onSetFocused}
            numberOfMonths={1}
            firstDayOfWeek={1}
            isDayBlocked={dateIsBlocked}
            hideKeyboardShortcutsPanel={true}
          />
        </DatePickerWrapper>
      </InputWrapper>
    </>
  )
})

export default SelectDate
