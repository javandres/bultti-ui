import fi from 'date-fns/locale/fi'
import _ from 'lodash'
import React, { useCallback, useEffect, useState } from 'react'
import ReactDatePicker, { registerLocale } from 'react-datepicker'
import ReactDOM from 'react-dom'
import 'react-datepicker/dist/react-datepicker.css'
import { observer } from 'mobx-react-lite'
import { getDateObject } from '../../util/formatDate'
import { DATE_FORMAT, normalDayTypes } from '../../constants'
import styled, { createGlobalStyle } from 'styled-components/macro'
import Input from './Input'
import { Calendar } from '../icon/Calendar'
import { text } from '../../util/translate'
import { format, getISODay, parse } from 'date-fns'

/**
 * Calendar made with react-datepicker: https://www.npmjs.com/package/react-datepicker
 * Calendar examples: https://reactdatepicker.com/
 */

const INPUT_DATE_FORMAT = DATE_FORMAT // Format in which value is passed in and out of the component
// TODO: add this to constants
const DISPLAYED_FORMAT = 'dd.MM.yyyy' // Format used to handle current value within the component. This is the format also displayed in UI
const MAX_YEAR = 2100
const MIN_YEAR = 2000

registerLocale('fi', fi)

type AcceptableDayType = 'Ma' | 'Ti' | 'Ke' | 'To' | 'Pe' | 'La' | 'Su'

export type PropTypes = {
  value?: string // Format same as DATE_FORMAT_IN_AND_OUT
  label?: string
  disabled?: boolean
  isEmptyValueAllowed?: boolean
  onChange: (dateString: string | null) => void
  minDate?: string
  maxDate?: string
  acceptableDayTypes?: AcceptableDayType[]
}

const DatePickerWrapperStyles = createGlobalStyle`
    .react-datepicker-wrapper {
      width: 100%;
    }
    .react-datepicker__day-name {
      font-size: 0.9rem;
      width: 2rem;
      line-height: 1.5rem;
    }
    .react-datepicker__header__dropdown {
      & select {
        margin-top: 5px;
        padding: 5px;
        background-color: white;
        border: 1px solid var(--light-grey);
        border-radius: 5px;
      }
    }
    .react-datepicker__day {
      font-size: 0.9rem;
      width: 2rem;
      line-height: 2rem;
    }
`

const DatePickerWrapper = styled.div``

const InputContainer = styled.div`
  width: 100%;

  &:last-child {
    margin-right: 0;
  }
`

const CalendarIconWrapper = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.5rem;
  pointer-events: none;
`

const DatePicker: React.FC<PropTypes> = observer((props: PropTypes) => {
  let {
    value,
    label,
    disabled,
    isEmptyValueAllowed = false,
    onChange,
    minDate,
    maxDate,
    acceptableDayTypes,
    ...attrs
  } = props
  let [isOpen, setIsOpen] = useState<boolean>(false)
  let [currentValue, setCurrentValue] = useState<string>(
    value ? getDatePickerDateString(value) : ''
  )

  let getMinDate = useCallback(
    () => (minDate ? getDateObject(minDate) : getDateObject(`${MIN_YEAR}-01-01`)),
    [minDate]
  )
  let getMaxDate = useCallback(
    () => (maxDate ? getDateObject(maxDate) : getDateObject(`${MAX_YEAR}-01-01`)),
    [maxDate]
  )

  useEffect(() => {
    const execTrimInputString = (event: KeyboardEvent) => {
      if (event.code === 'Enter') {
        trimInputString()
      }
    }
    window.addEventListener('keydown', execTrimInputString)
    return () => {
      window.removeEventListener('keydown', execTrimInputString)
    }
  }, [currentValue])

  // Update props.value only through this method
  let onChangeDate = useCallback(
    (date: Date | null) => {
      let newDate = date || null
      const minStartDate = getMinDate()
      const maxEndDate = getMaxDate()
      if (newDate) {
        // Adjust date to minDate or maxDate if date exceeds the limit
        if (newDate.getTime() < minStartDate.getTime()) {
          newDate = minStartDate
        } else if (newDate.getTime() > maxEndDate.getTime()) {
          newDate = maxEndDate
        }
      }
      setCurrentValue(newDate ? format(newDate, DISPLAYED_FORMAT) : '')

      if (newDate || isEmptyValueAllowed) {
        // Component outputs dateString in format of INPUT_DATE_FORMAT
        onChange(newDate ? format(newDate, INPUT_DATE_FORMAT) : null)
      }
    },
    [minDate, maxDate]
  )

  let onInputChange = useCallback(
    (inputValue: string) => {
      setIsOpen(false)
      // Allow input date that is in the correct format
      if (isValidDate(inputValue, acceptableDayTypes)) {
        onChangeDate(parse(inputValue, DISPLAYED_FORMAT, new Date()))
      } else if (_.isEmpty(inputValue)) {
        onChangeDate(null)
      } else {
        // Change input field as invalid date which is not null
        setCurrentValue(inputValue)
      }
    },
    [acceptableDayTypes]
  )

  let onCalendarDateSelect = useCallback(
    (date: Date | null) => {
      if (isOpen && date) {
        onInputChange(format(date, DISPLAYED_FORMAT))
      }
    },
    [isOpen]
  )

  let trimInputString = useCallback(() => {
    let dateObjectToTrim = parse(currentValue, DISPLAYED_FORMAT, new Date())
    const day = `0${dateObjectToTrim.getDate()}`.slice(-2)
    const month = `0${dateObjectToTrim.getMonth() + 1}`.slice(-2)
    const trimmedDateString = `${day}.${month}.${dateObjectToTrim.getFullYear()}`

    if (
      isValidDate(trimmedDateString, acceptableDayTypes) &&
      currentValue !== trimmedDateString
    ) {
      onChangeDate(parse(trimmedDateString, DISPLAYED_FORMAT, new Date()))
    }
  }, [currentValue, acceptableDayTypes, onChangeDate])

  let filterDate = useCallback(
    (date: Date) => {
      return isDateTypeAllowed(date, acceptableDayTypes)
    },
    [acceptableDayTypes]
  )

  return (
    <DatePickerWrapper>
      <ReactDatePicker
        customInput={renderDatePickerInput({
          attrs,
          isEmptyValueAllowed,
          onInputChange,
          value: currentValue,
          acceptableDayTypes,
          disabled,
          onInputBlur: trimInputString,
          openCalendar: () => setIsOpen(true),
          placeholder: text('datePicker_insertDate'),
        })}
        selected={value ? getDateObject(value) : undefined}
        open={isOpen}
        onClickOutside={() => setIsOpen(false)}
        autoComplete="off"
        disabledKeyboardNavigation={true}
        onChange={onCalendarDateSelect}
        filterDate={filterDate}
        locale={fi}
        dateFormat={'dd.MM.yyyy'}
        showMonthDropdown={true}
        peekNextMonth={true}
        showYearDropdown={true}
        dropdownMode={'select'}
        startDate={value ? getDateObject(value) : null}
        scrollableYearDropdown={true}
        yearDropdownItemNumber={100}
        minDate={getMinDate()}
        maxDate={getMaxDate()}
        dateFormatCalendar={DISPLAYED_FORMAT}
        popperContainer={renderCalendarContainer} // using popperContainer doesn't hurt. It might prevent some overflow issues (calendar not completely visible)
        fixedHeight={true}
      />
      <DatePickerWrapperStyles />
    </DatePickerWrapper>
  )
})

const renderCalendarContainer = ({
  children,
}: {
  children: JSX.Element[]
}): React.ReactNode => {
  const el = document.getElementById('root')
  return ReactDOM.createPortal(children, el!)
}

const renderDatePickerInput = ({
  onInputChange,
  onInputBlur,
  placeholder,
  value,
  label,
  disabled,
  acceptableDayTypes,
  isEmptyValueAllowed,
  openCalendar,
  attrs,
}: {
  onInputChange: (value: any) => unknown
  onInputBlur: () => unknown
  placeholder: string
  value?: string
  label?: string
  disabled?: boolean
  acceptableDayTypes?: AcceptableDayType[]
  isEmptyValueAllowed?: boolean
  openCalendar: () => unknown
  attrs: any
}) => {
  const onChange = (value: string) => {
    onInputChange(value)
  }

  let isInputValid = _.isEmpty(value)
    ? isEmptyValueAllowed
    : isValidDate(value!, acceptableDayTypes)
  return (
    <InputContainer>
      <Input
        style={isInputValid ? undefined : { backgroundColor: 'var(--light-red)' }}
        type="text"
        label={label}
        value={value || ''}
        placeholder={placeholder}
        onClick={() => openCalendar()}
        onChange={onChange}
        onBlur={onInputBlur}
        disabled={disabled}
        {...attrs}
      />
      <CalendarIconWrapper>
        <Calendar height="1.5rem" />
      </CalendarIconWrapper>
    </InputContainer>
  )
}

// Is given dateString in format of 'dd.MM.yyyy' (DISPLAYED_FORMAT)
// and is the day type allowed
function isValidDate(dateString: string, acceptableDayTypes?: AcceptableDayType[]) {
  let regEx = /^\d{2}.\d{2}.\d{4}$/
  if (!dateString.match(regEx)) {
    // Invalid format
    return false
  }
  let d = parse(dateString, DISPLAYED_FORMAT, new Date())
  let dNum = d.getTime()
  if (isNaN(dNum)) {
    return false
  }

  if (!isDateTypeAllowed(d, acceptableDayTypes)) {
    return false
  }

  return format(d, DISPLAYED_FORMAT) === dateString
}

function isDateTypeAllowed(date: Date, acceptableDayTypes?: AcceptableDayType[]) {
  if (!acceptableDayTypes || acceptableDayTypes.length === 0) {
    return true
  }

  let dayTypeIndex = getISODay(getDateObject(date)) - 1
  let dayType = normalDayTypes[dayTypeIndex] as AcceptableDayType
  return acceptableDayTypes.includes(dayType)
}

/**
 * @param {string} dateString - format is in DATE_FORMAT
 * @return dateString - format is in DISPLAYED_FORMAT
 */
function getDatePickerDateString(dateString: string): string {
  return format(parse(dateString, INPUT_DATE_FORMAT, new Date()), DISPLAYED_FORMAT)
}

export default DatePicker
