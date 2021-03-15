import React, { useMemo } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { eachWeekOfInterval, isBefore, parseISO, startOfWeek, subMonths } from 'date-fns'
import { HfpStatus, InspectionDate, InspectionInput, InspectionType } from '../schema-types'
import Dropdown from '../common/input/Dropdown'
import { getDateObject, getDateString, getReadableDateRange } from '../util/formatDate'
import { allInspectionDatesQuery } from './inspectionDate/inspectionDateQuery'
import { LoadingDisplay } from '../common/components/Loading'
import { text } from '../util/translate'
import { addDays } from 'date-fns/esm'
import { useQueryData } from '../util/useQueryData'
import { getHfpStatusColor, HfpStatusIndicator } from '../common/components/HfpStatus'
import { lowerCase } from 'lodash'

const InspectionSelectDatesView = styled.div`
  margin: 1rem 0;
  width: 50%;
`

const InspectionDateLabel = styled.div`
  width: 100%;
  padding-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

interface DateOption {
  label: string
  value: {
    startDate: Date
    endDate: Date
  }
  hfpDataStatus?: HfpStatus
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

    let selectedItem: DateOption | null = useMemo(() => {
      let { inspectionEndDate, inspectionStartDate } = inspectionInput

      if (!(inspectionStartDate && inspectionEndDate)) {
        return null
      }

      let selectedDateOption: DateOption = {
        label: getReadableDateRange({
          start: inspectionStartDate,
          end: inspectionEndDate,
        }),
        value: {
          startDate: inspectionStartDate,
          endDate: inspectionEndDate,
        },
      }

      if (inspectionType === InspectionType.Post) {
        let inspectionDateOption = dateOptions.find(
          (dateOption) =>
            getDateString(dateOption.value.startDate) === inspectionStartDate &&
            getDateString(dateOption.value.endDate) === inspectionEndDate
        )

        if (inspectionDateOption) {
          selectedDateOption.hfpDataStatus = inspectionDateOption.hfpDataStatus
        }
      }

      return selectedDateOption
    }, [inspectionInput, inspectionType, dateOptions])

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
            itemToLabel={(item: DateOption) => (
              <InspectionDateLabel>
                <span>{item.label}</span>
                {item.hfpDataStatus && (
                  <HfpStatusIndicator
                    title={text(`inspectionDate_hfp_${lowerCase(item.hfpDataStatus)}`)}
                    color={getHfpStatusColor(item.hfpDataStatus)}
                  />
                )}
              </InspectionDateLabel>
            )}
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

  return dateOptionsEndDates.map((endDate) => {
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
}

function getPostInspectionDateOptions(
  inspectionDatesQueryResult: InspectionDate[]
): DateOption[] {
  let dateOneMonthAgo = subMonths(new Date(), 1)
  const isInspectionDateValid = (inspectionDate: InspectionDate) => {
    // Only dates that are older than 1 month are valid
    return isBefore(getDateObject(inspectionDate.endDate), dateOneMonthAgo)
  }

  return inspectionDatesQueryResult.filter(isInspectionDateValid).map(
    (inspectionDate: InspectionDate): DateOption => {
      let { startDate, endDate, hfpDataStatus } = inspectionDate
      let label = getReadableDateRange({ start: startDate, end: endDate })

      return {
        label,
        hfpDataStatus,
        value: {
          startDate: parseISO(startDate),
          endDate: parseISO(endDate),
        },
      }
    }
  )
}

export default InspectionSelectDates
