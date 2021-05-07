import React, { CSSProperties } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { isSameDay, parseISO } from 'date-fns'
import { getReadableDate } from '../../util/formatDate'

const DateRangeDisplayView = styled.div`
  display: flex;
  flex-wrap: nowrap;
  white-space: nowrap;
`

const StartDate = styled.span`
  margin-right: 0.75rem;
  display: inline-block;
  font-size: 1rem;

  &:not(:last-child)&:after {
    content: '➔';
    display: inline-block;
    margin-left: 0.75rem;
  }
`

const EndDate = styled(StartDate)`
  margin-right: 0;

  &:after {
    content: none;
  }
`

export type PropTypes = {
  className?: string
  style?: CSSProperties
  startDate?: Date | string
  endDate?: Date | string
}

const DateRangeDisplay = observer(({ startDate, endDate, className, style }: PropTypes) => {
  if (!startDate || !endDate) {
    return null
  }

  let startDateObj = typeof startDate === 'string' ? parseISO(startDate) : startDate
  let endDateObj = typeof endDate === 'string' ? parseISO(endDate) : endDate

  return (
    <DateRangeDisplayView className={className} style={style}>
      <StartDate>{getReadableDate(startDateObj)}</StartDate>
      {!isSameDay(startDateObj, endDateObj) && (
        <EndDate>{getReadableDate(endDateObj)}</EndDate>
      )}
    </DateRangeDisplayView>
  )
})

export default DateRangeDisplay
