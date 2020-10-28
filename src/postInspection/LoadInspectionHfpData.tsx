import React, { useCallback, useContext, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { PageSection } from '../common/components/common'
import { Button, ButtonSize } from '../common/components/Button'
import { InspectionContext } from '../inspection/InspectionContext'
import { InputLabel } from '../common/components/form'
import { gql, useSubscription } from '@apollo/client'
import { useQueryData } from '../util/useQueryData'
import { useMutationData } from '../util/useMutationData'
import { orderBy } from 'lodash'
import { eachDayOfInterval, format, isSameDay, parseISO, subDays } from 'date-fns'
import { HfpDateStatus, HfpStatus } from '../schema-types'
import DateRangeDisplay from '../common/components/DateRangeDisplay'
import { DATE_FORMAT } from '../constants'

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
    loadHfpDataForInspectionPeriod(inspectionId: $inspectionId)
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

const LoadInspectionHfpData = observer(() => {
  const inspection = useContext(InspectionContext)

  let { data: currentlyLoadingRanges } = useQueryData(currentlyLoadingRangesQuery)
  let { data: loadedRanges } = useQueryData(loadedRangesQuery)
  let [loadHfpData, { loading: hfpDataLoading }] = useMutationData(loadHfpDataMutation)

  let { data: hfpStatusData } = useSubscription(hfpStatusSubscription, {
    shouldResubscribe: true,
    skip: !inspection,
    variables: {
      rangeStart: inspection?.inspectionStartDate,
      rangeEnd: inspection?.inspectionEndDate,
    },
  })

  let dateStatusByRanges = useMemo(() => {
    let allDates = orderBy(
      [...(currentlyLoadingRanges || []), ...(loadedRanges || [])],
      'date'
    )

    let groupedStatuses = allDates.reduce(
      (statusRanges: HfpDateStatus[][], dateStatus: HfpDateStatus) => {
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
      },
      []
    )

    if (
      inspection &&
      (groupedStatuses.length === 0 ||
        !groupedStatuses.some(
          (statusGroup) =>
            statusGroup[0]?.date === inspection?.inspectionStartDate &&
            statusGroup[statusGroup.length - 1]?.date === inspection?.inspectionEndDate
        ))
    ) {
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

      groupedStatuses.unshift(inspectionStatusGroup)
    }

    return groupedStatuses
  }, [currentlyLoadingRanges, loadedRanges, inspection])

  console.log(dateStatusByRanges)

  let onClickLoad = useCallback(() => {
    if (inspection) {
      loadHfpData({
        variables: {
          inspectionId: inspection.id,
        },
      })
    }
  }, [inspection])

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
      <LoadButton loading={hfpDataLoading} size={ButtonSize.LARGE} onClick={onClickLoad}>
        Lataa tarkastukseen tarvittava HFP
      </LoadButton>
      <LoadedRangesDisplay>
        <InputLabel theme="light" style={{ marginLeft: '1rem' }}>
          Ladatut päivämäärät
        </InputLabel>
        {dateStatusByRanges.map((dateStatusRange) => (
          <DateStatusDisplay key={dateStatusRange[0].date}>
            <LoadedDateRange
              startDate={dateStatusRange[0].date}
              endDate={dateStatusRange[dateStatusRange.length - 1].date}
            />
            <DateStatus color="var(--green)">{dateStatusRange[0].status}</DateStatus>
          </DateStatusDisplay>
        ))}
      </LoadedRangesDisplay>
    </LoadInspectionHfpDataView>
  )
})

export default LoadInspectionHfpData
