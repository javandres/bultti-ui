import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { PageSection } from '../../common/components/common'
import { Button, ButtonSize } from '../../common/components/Button'
import { InputLabel } from '../../common/components/form'
import { gql, useSubscription } from '@apollo/client'
import { useQueryData } from '../../util/useQueryData'
import { useMutationData } from '../../util/useMutationData'
import { flatten, orderBy, uniq, uniqBy } from 'lodash'
import {
  addDays,
  eachDayOfInterval,
  isSameDay,
  isWithinInterval,
  max,
  parseISO,
  subDays,
} from 'date-fns'
import { HfpDateStatus, HfpStatus, InspectionDate } from '../../schema-types'
import { pickGraphqlData } from '../../util/pickGraphqlData'
import { getDateString, getReadableDate } from '../../util/formatDate'
import { text, Text } from '../../util/translate'
import { useHasAdminAccessRights } from '../../util/userRoles'

const LoadInspectionHfpDataView = styled(PageSection)`
  margin: 1rem;
  padding: 1rem;
  width: auto;
`

const LoadButton = styled(Button)`
  width: auto;
  flex: 0;
`

const LoadedRangesDisplay = styled.div`
  margin-left: -1rem;
  margin-right: -1rem;
`

const DateStatusDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background-color: var(--lightest-grey);

  &:nth-child(even) {
    background-color: var(--white-grey);
  }
`

const DateProgressValue = styled.span``

const currentlyLoadingRangesQuery = gql`
  query currentlyLoadingHfpRanges {
    currentlyLoadingHfpRanges {
      status
      date
    }
  }
`

const loadHfpDataMutation = gql`
  mutation loadHfpDataForInspectionPeriod($inspectionDateId: String!) {
    loadHfpDataForInspectionPeriod(inspectionDateId: $inspectionDateId) {
      status
      date
    }
  }
`

const hfpStatusSubscription = gql`
  subscription hfpStatus($rangeStart: String!, $rangeEnd: String!) {
    hfpPreloadStatus(rangeStart: $rangeStart, rangeEnd: $rangeEnd) {
      status
      date
    }
  }
`

const hfpProgressSubscription = gql`
  subscription hfpLoadingProgress($rangeStart: String!, $rangeEnd: String!) {
    hfpLoadingProgress(rangeStart: $rangeStart, rangeEnd: $rangeEnd) {
      progress
      date
    }
  }
`

type PropTypes = {
  inspectionDate: InspectionDate
}

const InspectionDateHfpControl = observer(({ inspectionDate }: PropTypes) => {
  let hfpMissing = inspectionDate.hfpDataStatus !== HfpStatus.Ready
  let hfpLoading = inspectionDate.hfpDataStatus === HfpStatus.Loading

  let [dateProgress, setDateProgress] = useState<Map<string, number>>(
    new Map<string, number>()
  )

  let { data: currentlyLoadingRanges } = useQueryData(currentlyLoadingRangesQuery)

  let [
    loadHfpData,
    { data: requestedHfpDateRanges, loading: hfpDataLoading },
  ] = useMutationData(loadHfpDataMutation)

  let { data: hfpStatusData } = useSubscription(hfpStatusSubscription, {
    shouldResubscribe: true,
    variables: {
      rangeStart: inspectionDate.startDate,
      rangeEnd: inspectionDate.endDate,
    },
  })

  let { data: hfpTaskProgressData } = useSubscription(hfpProgressSubscription, {
    shouldResubscribe: true,
    variables: {
      rangeStart: inspectionDate.startDate,
      rangeEnd: inspectionDate.endDate,
    },
  })

  useEffect(() => {
    let data = pickGraphqlData(hfpTaskProgressData)

    if (data) {
      let { date, progress } = data
      setDateProgress((currentProgress) => {
        currentProgress.set(date, progress)
        return new Map(currentProgress)
      })
    }
  }, [hfpTaskProgressData])

  let inspectionStatusInterval = useMemo(() => {
    let startDate = parseISO(inspectionDate.startDate)

    return {
      start: startDate,
      end: max([parseISO(inspectionDate.endDate), addDays(startDate, 1)]),
    }
  }, [inspectionDate])

  let inspectionDates = useMemo(() => {
    if (!inspectionStatusInterval) {
      return []
    }

    return eachDayOfInterval(inspectionStatusInterval)
  }, [inspectionStatusInterval])

  let dateStatuses: HfpDateStatus[] = useMemo(() => {
    if (!inspectionStatusInterval) {
      return []
    }

    let inspectionStatusGroup: HfpDateStatus[] = inspectionDates.map((date) => ({
      date: getDateString(date),
      status: HfpStatus.NotLoaded,
    }))

    // Defines the priority order of statuses.
    let statusPriority = [HfpStatus.Ready, HfpStatus.Loading, HfpStatus.NotLoaded]
    let updatedStatuses = pickGraphqlData(hfpStatusData) || []

    return uniqBy(
      orderBy(
        [
          ...(currentlyLoadingRanges || []),
          ...(requestedHfpDateRanges || []),
          ...updatedStatuses,
          ...inspectionStatusGroup,
        ].filter((status) =>
          // The date needs to be within the inspection period
          isWithinInterval(parseISO(status.date), inspectionStatusInterval!)
        ),
        // Order by date and priority index. This way, the highest priority status will be selected by the uniq function.
        ['date', (s) => statusPriority.indexOf(s.status)]
      ),
      'date'
    )
  }, [
    inspectionStatusInterval,
    inspectionDates,
    currentlyLoadingRanges,
    requestedHfpDateRanges,
    hfpStatusData,
  ])

  let onClickLoad = useCallback(() => {
    loadHfpData({
      variables: {
        inspectionDateId: inspectionDate.id,
      },
    })
  }, [inspectionDate])

  let canLoadHfpManually = useHasAdminAccessRights()

  return (
    <LoadInspectionHfpDataView>
      <InputLabel>
        <Text>inspectionDate_hfpPanel_title</Text>
      </InputLabel>
      {canLoadHfpManually && (
        <LoadButton
          loading={hfpDataLoading}
          size={ButtonSize.LARGE}
          onClick={onClickLoad}
          disabled={hfpLoading}>
          {hfpLoading
            ? text('inspectionDate_hfpPanel_loadingDates')
            : !hfpMissing
            ? text('inspectionDate_hfpPanel_datesLoaded')
            : text('inspectionDate_hfpPanel_loadHfpForDates')}
        </LoadButton>
      )}
      <LoadedRangesDisplay>
        {dateProgress.size !== 0 && (
          <>
            <InputLabel style={{ marginLeft: '1rem', marginTop: '1.5rem' }}>
              <Text>inspectionDate_hfpPanel_nowLoading</Text>
            </InputLabel>
            {inspectionDates.map((date) => {
              let dateStr = getDateString(date)
              let currentProgress = dateProgress.get(dateStr)
              let loadedStatus = dateStatuses.find((status) => status.date === dateStr)?.status
              let loadedProgress =
                // Show the current progress if we have one and it is loading
                !!currentProgress || loadedStatus === HfpStatus.Loading
                  ? currentProgress || 0
                  : // Do not show in loading list if ready
                  loadedStatus === HfpStatus.Ready
                  ? undefined
                  : 0

              if (!loadedProgress) {
                return null
              }

              return (
                <DateStatusDisplay key={`date progress ${dateStr}`}>
                  <span>{getReadableDate(date)}</span>
                  <DateProgressValue>{loadedProgress}%</DateProgressValue>
                </DateStatusDisplay>
              )
            })}
          </>
        )}
      </LoadedRangesDisplay>
    </LoadInspectionHfpDataView>
  )
})

export default InspectionDateHfpControl
