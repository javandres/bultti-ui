import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { eachWeekOfInterval, startOfWeek } from 'date-fns'
import { InspectionInput } from '../schema-types'
import Dropdown from '../common/input/Dropdown'
import { readableDateRange } from '../util/formatDate'

const InspectionSelectDatesView = styled.div`
  margin: 1rem 0;
  width: 50%;
`

interface DateOption {
  label: string
  value: {
    startDate: Date
    endDate: Date
  }
}

export type PropTypes = {
  inspectionInput: InspectionInput
  onChange: (startDate: Date, endDate: Date) => void
}

const InspectionSelectDates = observer(({ inspectionInput, onChange }: PropTypes) => {
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

  let dateOptions: DateOption[] = dateOptionsEndDates.map((endDate) => {
    const startDate = startOfWeek(endDate, { weekStartsOn: 1 })
    const value = {
      startDate,
      endDate,
    }
    const label = readableDateRange({ startDate, endDate })
    return {
      label,
      value,
    }
  })
  const onSelectDates = (dateOption: DateOption) => {
    onChange(dateOption.value.startDate, dateOption.value.endDate)
  }
  let selectedItem: DateOption | null =
    inspectionInput.inspectionStartDate && inspectionInput.inspectionEndDate
      ? {
          label: readableDateRange({
            startDate: inspectionInput.inspectionStartDate,
            endDate: inspectionInput.inspectionEndDate,
          }),
          value: {
            startDate: inspectionInput.inspectionStartDate,
            endDate: inspectionInput.inspectionEndDate!,
          },
        }
      : null
  return (
    <InspectionSelectDatesView>
      <Dropdown
        label={'Valitse tarkastusjakso'}
        items={dateOptions}
        onSelect={onSelectDates}
        selectedItem={selectedItem}
      />
    </InspectionSelectDatesView>
  )
})

export default InspectionSelectDates
