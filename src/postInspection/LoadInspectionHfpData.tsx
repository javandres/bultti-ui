import React, { useCallback, useContext, useEffect, useMemo } from 'react'
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
import { DATE_FORMAT } from '../constants'
import { pickGraphqlData } from '../util/pickGraphqlData'

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

type PropTypes = {
  setHfpLoaded: (loaded: boolean) => unknown
}

const LoadInspectionHfpData = observer(({ setHfpLoaded }: PropTypes) => {
  const inspection = useContext(InspectionContext)

  let { data: currentlyLoadingRanges } = useQueryData(currentlyLoadingRangesQuery)
  let { data: loadedRanges } = useQueryData(loadedRangesQuery)

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

  let dateStatusByRanges = useMemo(() => {
    let inspectionStatusInterval = {
      start: parseISO(inspection?.inspectionStartDate),
      end: parseISO(inspection?.inspectionEndDate),
    }

    let inspectionStatusGroup: HfpDateStatus[] = eachDayOfInterval(
      inspectionStatusInterval
    ).map((date) => ({
      date: format(date, DATE_FORMAT),
      status: HfpStatus.NotLoaded,
    }))

    let allDates = orderBy(
      [
        ...(currentlyLoadingRanges || []),
        ...(loadedRanges || []),
        ...(requestedHfpDateRanges || []),
        ...(pickGraphqlData(hfpStatusData) || []),
        ...inspectionStatusGroup,
      ].reduce((uniqStatuses: HfpDateStatus[], status, index, allStatuses) => {
        // We are only interested in dates within the inspection period.
        if (!isWithinInterval(parseISO(status.date), inspectionStatusInterval)) {
          return uniqStatuses
        }

        // Reduce to a unique array of date statuses. Ready and loading statuses have a
        // priority. A loading status should not be included instead of a ready status,
        // and a not_loaded status should not be included instead of a loading status.
        let isIncluded = uniqStatuses.find((s) => s.date === status.date)

        if (status.status === HfpStatus.Ready && !isIncluded) {
          // As a priority, include the status if the date is loaded and it is not included already
          uniqStatuses.push(status)
        } else if (
          status.status === HfpStatus.Loading &&
          !allStatuses.find(
            (s) => s !== status && s.date === status.date && s.status === HfpStatus.Ready
          ) &&
          !isIncluded
        ) {
          // If the status is loading, include only if the date cannot be found
          // with a ready status among all the items and not included already.
          uniqStatuses.push(status)
        } else if (
          !isIncluded &&
          !allStatuses.find(
            (s) =>
              s !== status &&
              s.date === status.date &&
              [HfpStatus.Ready, HfpStatus.Loading].includes(s.status)
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

    return allDates.reduce((statusRanges: HfpDateStatus[][], dateStatus: HfpDateStatus) => {
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
    }, [])
  }, [currentlyLoadingRanges, loadedRanges, requestedHfpDateRanges, hfpStatusData, inspection])

  // Check if all dates in the inspection period are loaded.
  let inspectionPeriodLoadingStatuses = useMemo(() => {
    let inspectionStatusInterval = {
      start: parseISO(inspection?.inspectionStartDate),
      end: parseISO(inspection?.inspectionEndDate),
    }

    return uniq(
      eachDayOfInterval(inspectionStatusInterval)
        .map((date) => {
          let dateStr = format(date, DATE_FORMAT)
          return flatten(dateStatusByRanges).find((s) => s.date === dateStr)
        })
        .map((dateStatus) => dateStatus?.status || HfpStatus.NotLoaded)
    )
  }, [dateStatusByRanges, inspection])

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
        varten. Niille tiedoille joille ei löydy julkaistua jälkitarkastusta siivotaan pois
        jonkin ajan kuluttua.
      </LoadDescription>
      <LoadButton
        loading={hfpDataLoading}
        size={ButtonSize.LARGE}
        onClick={onClickLoad}
        disabled={
          inspectionPeriodLoadingStatuses.includes(HfpStatus.Loading) ||
          inspectionPeriodLoadingStatuses.every((s) => s === HfpStatus.Ready)
        }>
        {inspectionPeriodLoadingStatuses.includes(HfpStatus.Loading)
          ? 'Tarkastusjakson päivämäärät ladataan'
          : inspectionPeriodLoadingStatuses.every((s) => s === HfpStatus.Ready)
          ? 'Tarkastusjaksolle löytyy kaikki HFP tiedot'
          : 'Lataa tarkastukseen tarvittava HFP'}
      </LoadButton>
      <LoadedRangesDisplay>
        <InputLabel theme="light" style={{ marginLeft: '1rem' }}>
          HFP tietojen tilanne päivämäärittäin
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
      </LoadedRangesDisplay>
    </LoadInspectionHfpDataView>
  )
})

export default LoadInspectionHfpData
