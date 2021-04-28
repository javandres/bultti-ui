import React, { useMemo } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { eachWeekOfInterval, endOfWeek, parseISO } from 'date-fns'
import {
  HfpStatus,
  InspectionDate,
  InspectionInput,
  InspectionType,
  Season,
} from '../schema-types'
import Dropdown from '../common/input/Dropdown'
import { getDateObject, getDateString, getReadableDateRange } from '../util/formatDate'
import { getObservedInspectionDatesQuery } from './inspectionDate/inspectionDateQuery'
import { LoadingDisplay } from '../common/components/Loading'
import { text } from '../util/translate'
import { useQueryData } from '../util/useQueryData'
import { getHfpStatusColor, HfpStatusIndicator } from '../common/components/HfpStatus'
import { lowerCase, orderBy } from 'lodash'

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
  id?: string
  startDate: Date
  endDate: Date
  hfpDataStatus?: HfpStatus
}

export type PropTypes = {
  isEditingDisabled: boolean
  inspectionType: InspectionType
  inspectionSeason: Season
  inspectionInput: InspectionInput
  onChange: (startDate: Date, endDate: Date, id?: string) => void
}

const InspectionSelectDates = observer(
  ({
    isEditingDisabled,
    inspectionType,
    inspectionSeason,
    inspectionInput,
    onChange,
  }: PropTypes) => {
    let {
      data: inspectionDatesQueryResult,
      loading: areInspectionDatesLoading,
    } = useQueryData<InspectionDate[]>(getObservedInspectionDatesQuery, {
      variables: {
        seasonId: inspectionSeason.id,
      },
      skip: inspectionType === InspectionType.Pre,
    })

    let dateOptions: DateOption[] = useMemo(() => {
      let opts: DateOption[] = []

      if (inspectionType === InspectionType.Pre) {
        opts = getPreInspectionDateOptions(inspectionSeason)
      } else {
        opts = inspectionDatesQueryResult
          ? getPostInspectionDateOptions(inspectionDatesQueryResult)
          : []
      }

      return orderBy(opts, (opt) => opt.startDate.getTime())
    }, [inspectionType, inspectionDatesQueryResult])

    let onSelectDates = (dateOption: DateOption) => {
      onChange(dateOption.startDate, dateOption.endDate, dateOption.id)
    }

    let selectedItem: DateOption | undefined = useMemo(() => {
      let { inspectionEndDate, inspectionStartDate, inspectionDateId } = inspectionInput

      if (!(inspectionStartDate && inspectionEndDate)) {
        return undefined
      }

      let selectedDateOption: DateOption = {
        label: getReadableDateRange({
          start: inspectionStartDate,
          end: inspectionEndDate,
        }),
        startDate: inspectionStartDate,
        endDate: inspectionEndDate,
      }

      if (inspectionType === InspectionType.Post) {
        let inspectionDateOption = dateOptions.find(
          (dateOption) =>
            dateOption.id === inspectionDateId ||
            (getDateString(dateOption.startDate) === inspectionStartDate &&
              getDateString(dateOption.endDate) === inspectionEndDate)
        )

        if (inspectionDateOption) {
          selectedDateOption.id = inspectionDateOption.id || undefined
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
            label={text('inspection_selectInspectionDate')}
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

function getPreInspectionDateOptions(season: Season): DateOption[] {
  let seasonStartDates = eachWeekOfInterval(
    {
      start: getDateObject(season.startDate),
      end: getDateObject(season.endDate),
    },
    { weekStartsOn: 1 }
  )

  return seasonStartDates.map((startDate) => {
    let endDate = endOfWeek(startDate, { weekStartsOn: 1 })
    let label = getReadableDateRange({ start: startDate, end: endDate })

    return {
      label,
      startDate,
      endDate,
    }
  })
}

function getPostInspectionDateOptions(
  inspectionDatesQueryResult: InspectionDate[]
): DateOption[] {
  return inspectionDatesQueryResult.map((inspectionDate: InspectionDate) => {
    let { id, hfpDataStatus, startDate, endDate } = inspectionDate
    let label = getReadableDateRange({ start: startDate, end: endDate })

    return {
      label,
      hfpDataStatus,
      id,
      startDate: parseISO(startDate),
      endDate: parseISO(endDate),
    }
  })
}

export default InspectionSelectDates
