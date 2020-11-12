import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { PageSection } from '../common/components/common'
import { Button, ButtonSize } from '../common/components/Button'
import { InspectionContext } from '../inspection/InspectionContext'
import { InputLabel } from '../common/components/form'
import { gql, useSubscription } from '@apollo/client'
import { useQueryData } from '../util/useQueryData'
import { useMutationData } from '../util/useMutationData'
import { flatten, orderBy, uniq } from 'lodash'
import {
  eachDayOfInterval,
  format,
  isSameDay,
  isWithinInterval,
  parseISO,
  subDays,
} from 'date-fns'
import { HfpDateStatus, HfpStatus } from '../schema-types'
import DateRangeDisplay from '../common/components/DateRangeDisplay'
import { DATE_FORMAT, READABLE_DATE_FORMAT } from '../constants'
import { pickGraphqlData } from '../util/pickGraphqlData'
import { LoadingDisplay } from '../common/components/Loading'

const LoadInspectionHfpDataView = styled(PageSection)`
  margin: 1rem 0 0;
  padding: 1rem;
`

const LoadButton = styled(Button)`
  width: auto;
  flex: 0;
`

const LoadDescription = styled.p`
  margin-top: 0.5rem;

  &:last-of-type {
    margin-bottom: 1.5rem;
  }
`

const LoadedRangesDisplay = styled.div`
  margin-top: 1.5rem;
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

const LoadedDateRange = styled(DateRangeDisplay)``

const DateStatus = styled.div<{ color: string }>`
  display: flex;
  align-items: center;

  &:after {
    content: '';
    display: block;
    width: 1rem;
    height: 1rem;
    background-color: ${(p) => p.color};
    border-radius: 0.5rem;
    margin-left: 0.5rem;
  }
`

const currentlyLoadingRangesQuery = gql`
  query currentlyLoadingHfpRanges {
    currentlyLoadingHfpRanges {
      status
      date
    }
  }
`

const loadedRangesQuery = gql`
  query loadedHfpRanges {
    loadedHfpRanges {
      status
      date
    }
  }
`

const loadHfpDataMutation = gql`
  mutation loadHfpDataForInspectionPeriod($inspectionId: String!) {
    loadHfpDataForInspectionPeriod(inspectionId: $inspectionId) {
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
  setHfpLoaded: (loaded: boolean) => unknown
}

const LoadInspectionHfpData = observer(({ setHfpLoaded }: PropTypes) => {
  const inspection = useContext(InspectionContext)
  let [dateProgress, setDateProgress] = useState<Map<string, number>>(
    new Map<string, number>()
  )

  let { data: currentlyLoadingRanges } = useQueryData(currentlyLoadingRangesQuery)
  let { data: loadedRanges, loading: loadedRangesLoading } = useQueryData(loadedRangesQuery)

  let [
    loadHfpData,
    { data: requestedHfpDateRanges, loading: hfpDataLoading },
  ] = useMutationData(loadHfpDataMutation)

  let { data: hfpStatusData } = useSubscription(hfpStatusSubscription, {
    shouldResubscribe: true,
    skip: !inspection,
    variables: {
      rangeStart: inspection?.inspectionStartDate,
      rangeEnd: inspection?.inspectionEndDate,
    },
  })

  let { data: hfpTaskProgressData } = useSubscription(hfpProgressSubscription, {
    shouldResubscribe: true,
    skip: !inspection,
    variables: {
      rangeStart: inspection?.inspectionStartDate,
      rangeEnd: inspection?.inspectionEndDate,
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
    if (!inspection) {
      return
    }

    return {
      start: parseISO(inspection?.inspectionStartDate),
      end: parseISO(inspection?.inspectionEndDate),
    }
  }, [inspection])

  let inspectionDates = useMemo(() => {
    if (!inspectionStatusInterval) {
      return []
    }

    return eachDayOfInterval(inspectionStatusInterval)
  }, [inspectionStatusInterval])

  let dateStatuses = useMemo(() => {
    if (!inspectionStatusInterval) {
      return []
    }

    let inspectionStatusGroup: HfpDateStatus[] = inspectionDates.map((date) => ({
      date: format(date, DATE_FORMAT),
      status: HfpStatus.NotLoaded,
    }))

    // Defines the priority order of statuses.
    let statusPriority = [HfpStatus.Ready, HfpStatus.Loading, HfpStatus.NotLoaded]
    let updatedStatuses = pickGraphqlData(hfpStatusData) || []

    return orderBy(
      [
        ...(currentlyLoadingRanges || []),
        ...(loadedRanges || []),
        ...(requestedHfpDateRanges || []),
        ...updatedStatuses,
        ...inspectionStatusGroup,
      ].reduce((uniqStatuses: HfpDateStatus[], status, index, allStatuses) => {
        // We are only interested in dates within the inspection period.
        if (!isWithinInterval(parseISO(status.date), inspectionStatusInterval!)) {
          return uniqStatuses
        }

        // Reduce to a unique array of date statuses. statusPriority[0] and statusPriority[1]
        // statuses have a priority. A statusPriority[1] status should not be included
        // instead of a statusPriority[0] status, and a statusPriority[2] status
        // should not be included instead of a statusPriority[1] status.
        let isIncluded = uniqStatuses.some((s) => s.date === status.date)

        // Updates for loading dates comes through subscriptions to the updatedStatues array.
        let updatedDateStatus = updatedStatuses.find((s) => s.date === status.date)

        if (
          (status.status === statusPriority[0] ||
            // If the date is updated through the subscription and is ready,
            // show it as such and circumvent the priority list.
            (dateProgress.has(status.date) &&
              updatedDateStatus &&
              updatedDateStatus.status === HfpStatus.Ready)) &&
          !isIncluded
        ) {
          // As a priority, include the status if the date status is priority 1 and it is not included already
          uniqStatuses.push(status)
        } else if (
          status.status === statusPriority[1] &&
          !allStatuses.find(
            (s) => s !== status && s.date === status.date && s.status === statusPriority[0]
          ) &&
          !isIncluded
        ) {
          // If the status is ready, include only if the date cannot be found
          // with a loading status among all the items and not included already.
          uniqStatuses.push(status)
        } else if (
          !isIncluded &&
          !allStatuses.find(
            (s) =>
              s !== status &&
              s.date === status.date &&
              statusPriority.slice(0, 2).includes(s.status)
          )
        ) {
          // If all other conditions fail, include if the date is not loading
          // or ready elsewhere among the items and not included already.
          uniqStatuses.push(status)
        }

        return uniqStatuses
      }, []),
      'date'
    )
  }, [
    inspectionStatusInterval,
    inspectionDates,
    currentlyLoadingRanges,
    loadedRanges,
    requestedHfpDateRanges,
    hfpStatusData,
  ])

  let dateStatusByRanges = useMemo(
    () =>
      dateStatuses.reduce((statusRanges: HfpDateStatus[][], dateStatus: HfpDateStatus) => {
        let rangeIndex = statusRanges.length === 0 ? 0 : statusRanges.length - 1
        let currentRange = statusRanges[rangeIndex] || ([] as string[])
        let prevStatus = currentRange[currentRange.length - 1]

        // First status in the range
        if (!prevStatus) {
          currentRange.push(dateStatus)
        } else {
          let dateObj = parseISO(dateStatus.date)
          let prevDateObj = parseISO(prevStatus.date)

          if (
            prevStatus.status === dateStatus.status &&
            isSameDay(subDays(dateObj, 1), prevDateObj)
          ) {
            // Dates are consecutive and have the same status, push the date to the current range.
            currentRange.push(dateStatus)
          } else {
            // Dates are not consecutive or have different status, so we create a new range.
            currentRange = [dateStatus]
            rangeIndex++
          }
        }

        statusRanges.splice(rangeIndex, 1, currentRange)
        return statusRanges
      }, []),
    [dateStatuses]
  )

  // Check if all dates in the inspection period are loaded.
  let inspectionPeriodLoadingStatuses = useMemo(
    () =>
      uniq(
        inspectionDates
          .map((date) => {
            let dateStr = format(date, DATE_FORMAT)
            return flatten(dateStatusByRanges).find((s) => s.date === dateStr)
          })
          .map((dateStatus) => dateStatus?.status || HfpStatus.NotLoaded)
      ),
    [dateStatusByRanges, inspectionDates]
  )

  let onClickLoad = useCallback(() => {
    if (inspection) {
      loadHfpData({
        variables: {
          inspectionId: inspection.id,
        },
      })
    }
  }, [inspection])

  useEffect(() => {
    if (inspectionPeriodLoadingStatuses.every((s) => s === HfpStatus.Ready)) {
      setHfpLoaded(true)
    } else {
      setHfpLoaded(false)
    }
  }, [inspectionPeriodLoadingStatuses])

  return (
    <LoadInspectionHfpDataView>
      <InputLabel theme="light">Lataa HFP</InputLabel>
      <LoadDescription>
        Tarkastukseen tarvitaan suuri määrä HFP tietoa, eli tietoa liikenteen toteumasta. Kun
        olet säätänyt tarkastuksen tarkastusjakso mieleiseksi, lataa toteutunut tieto siltä
        ajalta tällä napilla.
      </LoadDescription>
      <LoadDescription>
        Toteutuneita tietoja vaaditaan jälkitarkastuksen raporteja ja suoritevaatimuksia
        varten. Niitä tietoja jotka ei käytetä jälkitarkastuksessa siivotaan pois jonkin ajan
        kuluttua.
      </LoadDescription>
      <LoadButton
        loading={hfpDataLoading}
        size={ButtonSize.LARGE}
        onClick={onClickLoad}
        disabled={
          loadedRangesLoading ||
          inspectionPeriodLoadingStatuses.includes(HfpStatus.Loading) ||
          inspectionPeriodLoadingStatuses.every((s) => s === HfpStatus.Ready)
        }>
        {loadedRangesLoading
          ? 'Tarkistetaan tilannetta...'
          : inspectionPeriodLoadingStatuses.includes(HfpStatus.Loading)
          ? 'Tarkastusjakson päivämäärät ladataan'
          : inspectionPeriodLoadingStatuses.every((s) => s === HfpStatus.Ready)
          ? 'Tarkastusjaksolle löytyy kaikki HFP tiedot'
          : 'Lataa tarkastukseen tarvittava HFP'}
      </LoadButton>
      <div
        style={{
          position: 'relative',
          height: loadedRangesLoading ? '70px' : 0,
          top: loadedRangesLoading ? '-12px' : 0,
        }}>
        <LoadingDisplay loading={loadedRangesLoading} />
      </div>
      {!loadedRangesLoading && (
        <LoadedRangesDisplay>
          <InputLabel theme="light" style={{ marginLeft: '1rem' }}>
            HFP tietojen tilanne
          </InputLabel>
          {dateStatusByRanges.map((dateStatusRange) => {
            let status = dateStatusRange[0].status

            return (
              <DateStatusDisplay key={dateStatusRange[0].date}>
                <LoadedDateRange
                  startDate={dateStatusRange[0].date}
                  endDate={dateStatusRange[dateStatusRange.length - 1].date}
                />
                <DateStatus
                  color={
                    status === HfpStatus.Ready
                      ? 'var(--green)'
                      : status === HfpStatus.Loading
                      ? 'var(--yellow)'
                      : 'var(--red)'
                  }>
                  {status}
                </DateStatus>
              </DateStatusDisplay>
            )
          })}
          {dateProgress.size !== 0 && (
            <>
              <InputLabel theme="light" style={{ marginLeft: '1rem', marginTop: '1.5rem' }}>
                Nyt lataamassa
              </InputLabel>
              {inspectionDates.map((date) => {
                let dateStr = format(date, 'yyyy-MM-dd')
                let currentProgress = dateProgress.get(dateStr)
                let loadedStatus = dateStatuses.find((status) => status.date === dateStr)
                  ?.status
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
                    <span>{format(date, READABLE_DATE_FORMAT)}</span>
                    <DateProgressValue>{loadedProgress}%</DateProgressValue>
                  </DateStatusDisplay>
                )
              })}
            </>
          )}
        </LoadedRangesDisplay>
      )}
    </LoadInspectionHfpDataView>
  )
})

export default LoadInspectionHfpData
