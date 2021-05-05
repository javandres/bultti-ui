import React, { useMemo } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { useStateValue } from '../state/useAppState'
import { Inspection, InspectionStatus, InspectionTimelineItem } from '../schema-types'
import DateRangeDisplay from '../common/components/DateRangeDisplay'
import { InputLabel } from '../common/components/form'
import { ArrowRight } from '../common/icon/ArrowRight'
import { orderBy } from 'lodash'
import { useQueryData } from '../util/useQueryData'
import { inspectionsTimelineByOperatorQuery } from './inspectionQueries'
import { getReadableDate } from '../util/formatDate'
import { operatorIsValid } from '../common/input/SelectOperator'

const InspectionTimelineView = styled.div`
  margin: 1rem 0;
`

const InspectionTimeLineItem = styled.div`
  border: 2px dashed transparent;
  padding: 0.5rem 0.75rem;
  border-radius: 5px;
  background: var(--green);
  color: white;
  font-size: 0.875rem !important;
  margin-right: 0.5rem;
  white-space: nowrap;
`
const InspectionDates = styled(DateRangeDisplay)`
  margin-top: 0.5rem;
  flex-wrap: nowrap;
`

const TimelineStart = styled(InspectionTimeLineItem)`
  background: var(--grey);

  strong {
    font-size: 1rem;
    margin-top: 0.5rem;
    display: block;
  }
`

const TimelineEnd = styled(InspectionTimeLineItem)<{ isProduction: boolean }>`
  border: 2px ${(p) => (p.isProduction ? 'solid transparent' : 'dashed var(--light-grey)')};
  background: ${(p) => (p.isProduction ? 'var(--green)' : 'white')};
  color: ${(p) => (p.isProduction ? 'white' : 'var(--light-grey)')}; ;
`

const TimelineWrapper = styled.div`
  display: flex;
  align-items: center;

  svg {
    margin-right: 0.5rem;
  }
`

export type PropTypes = {
  currentInspection: Inspection
}

const InspectionTimeline = observer(({ currentInspection }: PropTypes) => {
  var [operator] = useStateValue('globalOperator')
  var [season] = useStateValue('globalSeason')

  let { data: inspectionsData } = useQueryData<InspectionTimelineItem>(
    inspectionsTimelineByOperatorQuery,
    {
      skip: !operatorIsValid(operator),
      notifyOnNetworkStatusChange: true,
      variables: {
        operatorId: operator?.operatorId,
        inspectionType: currentInspection.inspectionType,
      },
    }
  )

  let inspections = !!inspectionsData && Array.isArray(inspectionsData) ? inspectionsData : []

  let previousProdInspections = useMemo(
    () =>
      orderBy(
        inspections.filter((inspection) => inspection.id !== currentInspection.id),
        'inspectionStartDate',
        'asc'
      ),
    [inspections, currentInspection]
  )

  let arrow = <ArrowRight fill="var(--light-grey)" width="1.5rem" height="1.5rem" />

  let seasonStartElement = useMemo(
    () =>
      season.startDate && (
        <>
          <TimelineStart>
            Kauden alku
            <br />
            <strong>{getReadableDate(season.startDate)}</strong>
          </TimelineStart>
          {arrow}
        </>
      ),
    [season]
  )

  // The season start date needs to be rendered only once *per render pass*.
  // This function takes care of that.
  let renderSeasonStartOnce = useMemo(() => {
    let didRenderSeasonStart = false

    // Pass true as the `last` argument for the last call in the element tree.
    return (last = false) => {
      // Save the state as it is now to determine what to return
      let initialDidRender = didRenderSeasonStart

      // If this is NOT the last call and we haven't rendered it yet,
      // set the flag to true to prevent future renders.
      if (!didRenderSeasonStart && !last) {
        didRenderSeasonStart = true
      }

      // If this IS the last call, set the flag back to false to
      // enable re-rendering during the next render pass.
      if (last) {
        didRenderSeasonStart = false
      }

      // So should we render it or not?
      return initialDidRender ? null : seasonStartElement
    }
  }, [seasonStartElement])

  return (
    <InspectionTimelineView>
      <InputLabel>Edelliset tarkastusjaksot</InputLabel>
      <TimelineWrapper>
        {previousProdInspections.length === 0 && renderSeasonStartOnce()}
        {previousProdInspections.length !== 0 &&
          previousProdInspections.slice(-2).map((inspection) => (
            <React.Fragment key={inspection.id}>
              {inspection.seasonId === season.id && renderSeasonStartOnce()}
              <InspectionTimeLineItem>
                {`${inspection.operatorName}/${inspection.seasonId}`}
                <InspectionDates
                  startDate={inspection.inspectionStartDate}
                  endDate={inspection.inspectionEndDate}
                />
              </InspectionTimeLineItem>
              {arrow}
            </React.Fragment>
          ))}
        {renderSeasonStartOnce(true)}
        <TimelineEnd isProduction={currentInspection.status === InspectionStatus.InProduction}>
          Tämä tarkastus
          <InspectionDates
            startDate={currentInspection.inspectionStartDate}
            endDate={currentInspection.inspectionEndDate}
          />
        </TimelineEnd>
      </TimelineWrapper>
    </InspectionTimelineView>
  )
})

export default InspectionTimeline
