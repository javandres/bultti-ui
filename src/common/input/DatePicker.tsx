import fi from 'date-fns/locale/fi'
import _ from 'lodash'
import React, { useState } from 'react'
import ReactDatePicker, { registerLocale } from 'react-datepicker'
import ReactDOM from 'react-dom'
import 'react-datepicker/dist/react-datepicker.css'
import { observer } from 'mobx-react-lite'
import { getDateObject, getDateString } from '../../util/formatDate'
import { DATE_FORMAT } from '../../constants'
import styled, { createGlobalStyle } from 'styled-components/macro'
import Input from './Input'
import { Calendar } from '../icon/Calendar'
import { text } from '../../util/translate'

/**
 * Date Picker using react-datepicker: https://www.npmjs.com/package/react-datepicker
 * Calendar examples: https://reactdatepicker.com/
 */

const MAX_YEAR = 2100
const MIN_YEAR = 2000

registerLocale('fi', fi)

// TODO: support acceptable dayTypes
type AcceptableDayType = 'mo' | 'tu' | 'we' | 'th' | 'fr' | 'sa' | 'su'

export type PropTypes = {
  value?: string // Format same as constants.DATE_FORMAT
  label?: string
  disabled?: boolean
  isEmptyValueAllowed?: boolean
  onChange: (dateString: string | null) => void
  minDate?: string
  maxDate?: string
  acceptableDayTypes?: AcceptableDayType[]
}

const DatePickerWrapperStyles = createGlobalStyle`
  
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
    ...attrs
  } = props
  let [isOpen, setIsOpen] = useState<boolean>(false)
  let [currentValue, setCurrentValue] = useState<string>(value ? value : '')

  // TODO: add an event listener to trim input when enter is pressed
  //   EventListener.on('enter', this.trimInputString)

  let getMinDate = () =>
    minDate ? getDateObject(minDate) : getDateObject(`${MIN_YEAR}-01-01`)
  let getMaxDate = () =>
    maxDate ? getDateObject(maxDate) : getDateObject(`${MAX_YEAR}-01-01`)

  // Update props.value only through this method
  let onChangeDate = (date: Date | null) => {
    let newDate = date ? date : null

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
    setCurrentValue(newDate ? getDateString(newDate) : '')
    if (!isEmptyValueAllowed && !newDate) return

    onChange(newDate ? getDateString(newDate) : null)
  }

  let onInputChange = (inputValue: string) => {
    setIsOpen(false)

    // Allow input date that is in the correct format
    if (isValidDate(inputValue)) {
      onChangeDate(getDateObject(inputValue))
    } else if (_.isEmpty(inputValue)) {
      onChangeDate(null)
    } else {
      // Change input field as invalid date which is not null
      setCurrentValue(inputValue)
    }
  }

  let onCalendarDateSelect = (date: Date | null) => {
    // Have to set 1 ms timeout because state.isOpen might have not been updated
    setTimeout(() => {
      selectDateIfCalendarIsOpen(date)
    }, 1)
  }

  let selectDateIfCalendarIsOpen = (date: Date | null) => {
    if (isOpen && date) {
      onInputChange(getDateString(date))
    }
  }

  let trimInputString = () => {
    let dateObjectToTrim = getDateObject(currentValue)
    // Note: this needs to be in constants.DATE_FORMAT
    const day = `0${dateObjectToTrim.getDate()}`.slice(-2)
    const month = `0${dateObjectToTrim.getMonth() + 1}`.slice(-2)
    const trimmedDateString = `${dateObjectToTrim.getFullYear()}-${month}-${day}`
    if (isValidDate(trimmedDateString)) {
      let trimmedDateObject = getDateObject(trimmedDateString)
      if (currentValue !== trimmedDateString) {
        onChangeDate(trimmedDateObject)
      }
    }
  }

  return (
    <DatePickerWrapper>
      <ReactDatePicker
        customInput={renderDatePickerInput({
          attrs,
          isEmptyValueAllowed,
          onInputChange,
          value: currentValue,
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
        locale={fi}
        dateFormat={DATE_FORMAT}
        showMonthDropdown={true}
        peekNextMonth={true}
        showYearDropdown={true}
        dropdownMode={'select'}
        startDate={value ? getDateObject(value) : null}
        scrollableYearDropdown={true}
        yearDropdownItemNumber={100}
        minDate={getMinDate()}
        maxDate={getMaxDate()}
        dateFormatCalendar={'dd.MM.yyyy'}
        popperContainer={renderCalendarContainer}
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
  isEmptyValueAllowed,
  openCalendar,
  attrs,
}: {
  onInputChange: (value: any) => void
  onInputBlur: () => void
  placeholder: string
  value?: string
  label?: string
  disabled?: boolean
  isEmptyValueAllowed?: boolean
  openCalendar: Function
  attrs: any
}) => {
  const onChange = (value: string) => {
    onInputChange(value)
  }

  let isInputValid = _.isEmpty(value) ? !!isEmptyValueAllowed : isValidDate(value!)

  return (
    <InputContainer>
      <Input
        style={isInputValid ? undefined : { backgroundColor: 'var(--light-red)' }}
        type="text"
        label={label}
        value={value ? value : ''}
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

function isValidDate(dateString: string) {
  let regEx = /^\d{4}-\d{2}-\d{2}$/
  if (!dateString.match(regEx)) return false // Invalid format
  let d = new Date(dateString)
  let dNum = d.getTime()
  if (!dNum && dNum !== 0) return false // NaN value, Invalid date
  return d.toISOString().slice(0, 10) === dateString
}

export default DatePicker
