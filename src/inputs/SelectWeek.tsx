import React, { useCallback, useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite'
import 'react-dates/lib/css/_datepicker.css'
import moment, { Moment } from 'moment'
import { AnyFunction } from '../types/common'
import { SingleDatePicker } from 'react-dates'
import Input from './Input'

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

    const [focused, setFocused] = useState<boolean>(false)

    const onDateChange = useCallback(
      (date) => {
        if (date) {
          const weekStart = date.clone().startOf('isoWeek')

          if (!startMoment.isSame(weekStart)) {
            const setStartDate = weekStart.format('YYYY-MM-DD')
            const setEndDate = weekStart
              .clone()
              .endOf('isoWeek')
              .format('YYYY-MM-DD')

            onChangeStartDate(setStartDate)
            onChangeEndDate(setEndDate)
          }
        }
      },
      [startMoment, onChangeStartDate, onChangeEndDate]
    )

    const isBlocked = useCallback((date: Moment) => date.day() !== 1, [])

    return (
      <>
        <SingleDatePicker
          date={startMoment}
          id="startDate"
          onDateChange={onDateChange}
          focused={focused}
          onFocusChange={({ focused }) => setFocused(!!focused)}
          numberOfMonths={1}
          showClearDate={true}
          firstDayOfWeek={1}
          isDayBlocked={isBlocked}
          enableOutsideDays={true}
          isOutsideRange={() => false}
          keepOpenOnDateSelect={false}
        />
        <Input disabled={true} value={endDate} />
      </>
    )
  }
)

export default SelectWeek
