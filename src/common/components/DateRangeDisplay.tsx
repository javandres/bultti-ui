import React, { CSSProperties } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { format, parseISO } from 'date-fns'
import { READABLE_DATE_FORMAT } from '../../constants'

const DateRangeDisplayView = styled.div``

const StartDate = styled.span`
  margin-right: 0.75rem;
  display: inline-block;
  font-size: 1rem;

  &:after {
    content: '➔';
    display: inline-block;
    margin-left: 0.75rem;
  }
`

const EndDate = styled(StartDate)`
  &:after {
    content: '';
  }
`

export type PropTypes = {
  className?: string
  style?: CSSProperties
  startDate: Date | string
  endDate: Date | string
}

const DateRangeDisplay = observer(({ startDate, endDate, className, style }: PropTypes) => {
  let startDateObj = typeof startDate === 'string' ? parseISO(startDate) : startDate
  let endDateObj = typeof endDate === 'string' ? parseISO(endDate) : endDate

  return (
    <DateRangeDisplayView className={className} style={style}>
      <StartDate>{format(startDateObj, READABLE_DATE_FORMAT)}</StartDate>
      <EndDate>{format(endDateObj, READABLE_DATE_FORMAT)}</EndDate>
    </DateRangeDisplayView>
  )
})

export default DateRangeDisplay
