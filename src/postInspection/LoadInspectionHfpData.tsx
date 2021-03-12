import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { PageSection } from '../common/components/common'
import { Button, ButtonSize } from '../common/components/Button'
import { InspectionContext } from '../inspection/InspectionContext'
import { InputLabel } from '../common/components/form'
import { gql, useSubscription } from '@apollo/client'
import { useQueryData } from '../util/useQueryData'
import { useMutationData } from '../util/useMutationData'
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
import { HfpDateStatus, HfpStatus, InspectionValidationError } from '../schema-types'
import DateRangeDisplay from '../common/components/DateRangeDisplay'
import { pickGraphqlData } from '../util/pickGraphqlData'
import { LoadingDisplay } from '../common/components/Loading'
import { useHasInspectionError } from '../util/hasInspectionError'
import { getDateString, getReadableDate } from '../util/formatDate'
import { HfpStatusIndicator } from '../common/components/HfpStatus'

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

const currentlyLoadingRangesQuery = gql`
  query currentlyLoadingHfpRanges {
    currentlyLoadingHfpRanges {
      status
      date
    }
  }
`

const loadedRangesQuery = gql`
  query loadedHfpRanges($startDate: String!, $endDate: String!) {
    loadedHfpRanges(startDate: $startDate, endDate: $endDate) {
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

  let hfpMissing = useHasInspectionError(
    inspection,
    InspectionValidationError.HfpUnavailableForInspectionDates
  )

  let [dateProgress, setDateProgress] = useState<Map<string, number>>(
    new Map<string, number>()
  )

  let { data: currentlyLoadingRanges } = useQueryData(currentlyLoadingRangesQuery)
  let { data: loadedRanges, loading: loadedRangesLoading } = useQueryData(loadedRangesQuery, {
    skip: !inspection,
    variables: {
      startDate: inspection?.inspectionStartDate,
      endDate: inspection?.inspectionEndDate,
    },
  })

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

    let startDate = parseISO(inspection?.inspectionStartDate)

    return {
      start: startDate,
      end: max([parseISO(inspection?.inspectionEndDate), addDays(startDate, 1)]),
    }
  }, [inspection])

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
          ...(loadedRanges || []),
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
    loadedRanges,
    requestedHfpDateRanges,
    hfpStatusData,
  ])

  // Group each date status into continuous date ranges/intervals.
  let dateStatusByRanges: HfpDateStatus[][] = useMemo(
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
            return flatten(dateStatusByRanges).find((s) => s.date === getDateString(date))
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
    <LoadInspectionHfpDataView error={hfpMissing}>
      <InputLabel>Lataa HFP</InputLabel>
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
          <InputLabel style={{ marginLeft: '1rem' }}>HFP tietojen tilanne</InputLabel>
          {dateStatusByRanges.map((dateStatusRange) => {
            let status = dateStatusRange[0].status

            return (
              <DateStatusDisplay key={dateStatusRange[0].date}>
                <LoadedDateRange
                  startDate={dateStatusRange[0].date}
                  endDate={dateStatusRange[dateStatusRange.length - 1].date}
                />
                <HfpStatusIndicator
                  color={
                    status === HfpStatus.Ready
                      ? 'var(--green)'
                      : status === HfpStatus.Loading
                      ? 'var(--yellow)'
                      : 'var(--red)'
                  }>
                  {status}
                </HfpStatusIndicator>
              </DateStatusDisplay>
            )
          })}
          {dateProgress.size !== 0 && (
            <>
              <InputLabel style={{ marginLeft: '1rem', marginTop: '1.5rem' }}>
                Nyt lataamassa
              </InputLabel>
              {inspectionDates.map((date) => {
                let dateStr = getDateString(date)
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
                    <span>{getReadableDate(date)}</span>
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
