import React, { useCallback, useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite'
import moment, { Moment } from 'moment'
import { AnyFunction } from '../types/common'
import { DayPickerRangeController } from 'react-dates'
import Input from './Input'
import styled from 'styled-components'
import { isValid, parseISO } from 'date-fns'
import 'react-dates/lib/css/_datepicker.css'
import '../style/reactDates.scss'

moment.locale('fi')

const WeekSelectWrapper = styled.div`
  position: relative;
  margin-bottom: 1rem;
`

const InputsWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  margin-bottom: 0.5rem;
`

const InputContainer = styled.div`
  flex: 1 1 50%;
  margin-right: 1rem;

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
  startDate: string
  endDate: string
  maxDate?: string
  onChangeStartDate: AnyFunction
  onChangeEndDate: AnyFunction
  selectWeek?: boolean
  startLabel?: string
  endLabel?: string
  name?: string
}

const SelectWeek: React.FC<PropTypes> = observer(
  ({
    startDate,
    endDate,
    maxDate,
    onChangeEndDate,
    onChangeStartDate,
    startLabel,
    endLabel,
    name,
  }) => {
    const inputName = useMemo(() => name || 'week_input', [name])

    const startMoment = useMemo(() => moment(startDate, 'YYYY-MM-DD').startOf('isoWeek'), [
      startDate,
    ])

    const endMoment = useMemo(() => moment(endDate, 'YYYY-MM-DD').endOf('isoWeek'), [endDate])

    const maxMoment = useMemo(
      () => (maxDate ? moment(maxDate, 'YYYY-MM-DD').endOf('isoWeek') : false),
      [maxDate]
    )

    const [focused, setFocused] = useState<any>(null)

    const onDateChanges = useCallback(
      ({ startDate, endDate }) => {
        if (startDate) {
          onChangeStartDate(startDate.format('YYYY-MM-DD'))
        }

        if (endDate) {
          onChangeEndDate(endDate.format('YYYY-MM-DD'))
        }
      },
      [startMoment, onChangeStartDate, onChangeEndDate]
    )

    const dateIsValid = useCallback((dateVal: string) => isValid(parseISO(dateVal)), [])

    const dateIsBlocked = useCallback(
      (dateVal: Moment) => (!maxMoment ? false : dateVal.isAfter(maxMoment)),
      [maxMoment]
    )

    const onInputFocus = useCallback(
      (which) => () => {
        setFocused(which)
      },
      []
    )

    const onClosePicker = useCallback(
      (e) => {
        if (!(e?.target?.name?.includes(inputName))) {
          setFocused(null)
        }
      },
      [focused, inputName]
    )

    return (
      <WeekSelectWrapper>
        <InputsWrapper>
          <InputContainer>
            <Input
              name={`start_date_${inputName}`}
              subLabel={true}
              label={startLabel}
              value={startDate}
              onChange={onChangeStartDate}
              reportChange={dateIsValid}
              onFocus={onInputFocus('startDate')}
              onBlur={onClosePicker}
            />
          </InputContainer>
          <InputContainer>
            <Input
              name={`end_date_${inputName}`}
              subLabel={true}
              label={endLabel}
              value={endDate}
              onChange={onChangeEndDate}
              reportChange={dateIsValid}
              onFocus={onInputFocus('endDate')}
              onBlur={onClosePicker}
            />
          </InputContainer>
        </InputsWrapper>
        <DatePickerWrapper focused={!!focused}>
          <DayPickerRangeController
            startDate={startMoment}
            endDate={endMoment}
            onDatesChange={onDateChanges}
            onOutsideClick={onClosePicker}
            startDateOffset={(day) => day.startOf('isoWeek')}
            endDateOffset={(day) => day.endOf('isoWeek')}
            focusedInput={focused}
            onFocusChange={setFocused}
            numberOfMonths={1}
            firstDayOfWeek={1}
            minimumNights={6}
            isDayBlocked={dateIsBlocked}
            hideKeyboardShortcutsPanel={true}
          />
        </DatePickerWrapper>
      </WeekSelectWrapper>
    )
  }
)

export default SelectWeek
