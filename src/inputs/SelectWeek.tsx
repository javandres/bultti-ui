import React, { useCallback, useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite'
import 'react-dates/lib/css/_datepicker.css'
import moment from 'moment'
import { AnyFunction } from '../types/common'
import { DayPickerRangeController } from 'react-dates'
import Input from './Input'
import styled from 'styled-components'
import { isValid, parseISO } from 'date-fns'
import '../style/reactDates.css'

moment.locale('fi')

const InputWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  margin-bottom: 1rem;
`

const InputContainer = styled.div`
  flex: 1 1 50%;
  margin-right: 2rem;

  &:last-child {
    margin-right: 0;
  }
`

export type PropTypes = {
  startDate: string
  endDate: string
  onChangeStartDate: AnyFunction
  onChangeEndDate: AnyFunction
  selectWeek?: boolean
}

const SelectWeek: React.FC<PropTypes> = observer(
  ({ startDate, endDate, onChangeEndDate, onChangeStartDate }) => {
    const startMoment = useMemo(() => moment(startDate, 'YYYY-MM-DD').startOf('isoWeek'), [
      startDate,
    ])

    const endMoment = useMemo(() => moment(endDate, 'YYYY-MM-DD').endOf('isoWeek'), [endDate])

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

    const dateIsValid = (dateVal: string) => isValid(parseISO(dateVal))

    return (
      <>
        <InputWrapper>
          <InputContainer>
            <Input
              label="Tarkastusjakson alku"
              value={startDate}
              onChange={onChangeStartDate}
              reportChange={dateIsValid}
            />
          </InputContainer>
          <InputContainer>
            <Input label="Tarkastusjakson loppu" value={endDate} reportChange={dateIsValid} />
          </InputContainer>
        </InputWrapper>
        <DayPickerRangeController
          startDate={startMoment}
          endDate={endMoment}
          onDatesChange={onDateChanges}
          startDateOffset={(day) => day.startOf('isoWeek')}
          endDateOffset={(day) => day.endOf('isoWeek')}
          focusedInput={focused}
          onFocusChange={(focusedInput) => setFocused(focusedInput)}
          numberOfMonths={2}
          firstDayOfWeek={1}
          minimumNights={1}
          isDayBlocked={() => false}
          enableOutsideDays={false}
          isOutsideRange={() => false}
          hideKeyboardShortcutsPanel={true}
        />
      </>
    )
  }
)

export default SelectWeek
