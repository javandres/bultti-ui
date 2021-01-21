import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { eachWeekOfInterval, startOfWeek } from 'date-fns'
import { Inspection } from '../schema-types'
import Dropdown from '../common/input/Dropdown'

const InspectionSelectDatesView = styled.div`
  margin: 1rem 0;
`

interface IDateOption {
  endDate: Date
  startDate: Date
}

export type PropTypes = {
  inspection: Inspection
  onChange: Function
}

const InspectionSelectDates = observer(({ inspection, onChange }: PropTypes) => {
  // TODO: use inspection.InspectionType to know how to get options
  // preInspections: automatically generated options
  // postInspections: query options from backend

  let startDate = new Date()
  let endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + 90)
  let dateOptionsEndDates = eachWeekOfInterval({
    start: startDate,
    end: endDate,
  })

  let dateOptions: IDateOption[] = dateOptionsEndDates.map((endDate) => {
    return {
      endDate,
      startDate: startOfWeek(endDate, { weekStartsOn: 1 }),
    }
  })
  const onSelectDates = (val: any) => {
    // TODO, call onChange
  }

  return (
    <InspectionSelectDatesView>
      <Dropdown
        label={'Valitse aika'}
        items={dateOptions}
        onSelect={onSelectDates}
        selectedItem={''}
      />
    </InspectionSelectDatesView>
  )
})

export default InspectionSelectDates
