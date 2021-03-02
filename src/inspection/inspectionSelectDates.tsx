import React, { useMemo } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { eachWeekOfInterval, parseISO, startOfWeek, subMonths, isBefore } from 'date-fns'
import { InspectionDate, InspectionInput, InspectionType } from '../schema-types'
import Dropdown from '../common/input/Dropdown'
import { getDateObject, getReadableDateRange } from '../util/formatDate'
import { allInspectionDatesQuery } from './inspectionDate/inspectionDateQuery'
import { LoadingDisplay } from '../common/components/Loading'
import { text } from '../util/translate'
import { addDays } from 'date-fns/esm'
import { useQueryData } from '../util/useQueryData'

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
  isEditingDisabled: boolean
  inspectionType: InspectionType
  inspectionInput: InspectionInput
  onChange: (startDate: Date, endDate: Date) => void
}

const InspectionSelectDates = observer(
  ({ isEditingDisabled, inspectionType, inspectionInput, onChange }: PropTypes) => {
    let {
      data: inspectionDatesQueryResult,
      loading: areInspectionDatesLoading,
    } = useQueryData<InspectionDate[]>(allInspectionDatesQuery, {
      skip: inspectionType === InspectionType.Pre,
    })

    let dateOptions: DateOption[] = useMemo(() => {
      if (inspectionType === InspectionType.Pre) {
        return getPreInspectionDateOptions()
      }
      return inspectionDatesQueryResult
        ? getPostInspectionDateOptions(inspectionDatesQueryResult)
        : []
    }, [inspectionType, inspectionDatesQueryResult])

    dateOptions.sort((a: DateOption, b: DateOption) => {
      return a.value.startDate.getTime() < b.value.startDate.getTime() ? -1 : 1
    })

    let onSelectDates = (dateOption: DateOption) => {
      onChange(dateOption.value.startDate, dateOption.value.endDate)
    }
    let selectedItem: DateOption | null =
      inspectionInput.inspectionStartDate && inspectionInput.inspectionEndDate
        ? {
            label: getReadableDateRange({
              start: inspectionInput.inspectionStartDate,
              end: inspectionInput.inspectionEndDate,
            }),
            value: {
              startDate: inspectionInput.inspectionStartDate,
              endDate: inspectionInput.inspectionEndDate!,
            },
          }
        : null
    return (
      <InspectionSelectDatesView>
        {areInspectionDatesLoading ? (
          <LoadingDisplay />
        ) : (
          <Dropdown
            disabled={isEditingDisabled}
            label={text('inspection_selectInspection')}
            items={dateOptions}
            onSelect={onSelectDates}
            selectedItem={selectedItem}
            hintText={
              inspectionType === InspectionType.Post
                ? text('inspection_date_postInspectionDateSelectionHint')
                : undefined
            }
          />
        )}
      </InspectionSelectDatesView>
    )
  }
)

function getPreInspectionDateOptions(): DateOption[] {
  let startDate = new Date()
  let endDate = addDays(startDate, 90)
  let dateOptionsEndDates = eachWeekOfInterval({
    start: startDate,
    end: endDate,
  })

  let dateOptions: DateOption[] = dateOptionsEndDates.map((endDate) => {
    let startDate = startOfWeek(endDate, { weekStartsOn: 1 })
    let value = {
      startDate,
      endDate,
    }
    let label = getReadableDateRange({ start: startDate, end: endDate })
    return {
      label,
      value,
    }
  })
  return dateOptions
}

function getPostInspectionDateOptions(
  inspectionDatesQueryResult: InspectionDate[]
): DateOption[] {
  let dateOneMonthAgo = subMonths(new Date(), 1)
  const isInspectionDateValid = (inspectionDate: InspectionDate) => {
    // Only dates that are older than 1 month are valid
    return isBefore(getDateObject(inspectionDate.endDate), dateOneMonthAgo)
  }

  return inspectionDatesQueryResult
    .filter(isInspectionDateValid)
    .map((inspectionDate: InspectionDate) => {
      let { startDate, endDate } = inspectionDate
      let label = getReadableDateRange({ start: startDate, end: endDate })
      return {
        label,
        value: {
          startDate: parseISO(startDate),
          endDate: parseISO(endDate),
        },
      }
    })
}

export default InspectionSelectDates