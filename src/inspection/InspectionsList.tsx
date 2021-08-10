import React, { useMemo } from 'react'
import styled from 'styled-components/macro'
import { get, groupBy, orderBy } from 'lodash'
import InspectionItem from './InspectionItem'
import {
  Inspection,
  InspectionStatus,
  InspectionType,
  PreInspection,
  Season,
} from '../schema-types'
import { getInspectionTypeStrings, isPreInspection } from './inspectionUtils'
import { isBetween } from '../util/compare'
import { LoadingDisplay } from '../common/components/Loading'
import { useSeasons } from '../util/useSeasons'
import { MessageView } from '../common/components/Messages'
import { getDateString } from '../util/formatDate'
import { Text } from '../util/translate'

const InspectionsListView = styled.div`
  min-height: 100%;
  padding-left: 1rem;
  margin-bottom: 2rem;
`

const InspectionsWrapper = styled.div`
  border-left: 3px solid var(--blue);
  margin-top: 1.5rem;
  padding-bottom: 1.5rem;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    height: 3px;
    width: calc(2rem + 1px);
    background: var(--blue);
    left: calc(-1rem - 2px);
    border-radius: 3px;
  }
`

const TimelineHeading = styled.div`
  position: relative;
  padding: 0 0 1rem 1.5rem;
  font-weight: bold;

  &:before {
    content: '';
    display: block;
    position: absolute;
    width: 1.1rem;
    height: 1.1rem;
    top: -0.25rem;
    left: calc(-0.75rem - 1px);
    border-radius: 50%;
    background: white;
    border: 3px solid var(--blue);
  }
`

const TimelineMessage = styled(MessageView)`
  margin-left: 1.5rem;
  margin-top: 0;
`

const TimelineCurrentTime = styled(TimelineHeading)`
  margin-top: 1.25rem;
  margin-bottom: 1rem;

  &:before {
    box-sizing: border-box;
    width: 1.1rem;
    height: 1.05rem;
    top: 0;
    left: calc(-0.5rem - 2px);
    border-radius: 50%;
    border: 3px solid var(--blue);
    background: var(--blue);
  }
`

const TimelineInspectionItem = styled(InspectionItem)<{
  isCurrentlyInEffect?: boolean
}>`
  margin-right: 0;
  margin-left: 1.5rem;
  margin-bottom: 2rem;
  position: relative;

  &:last-child {
    margin-bottom: 1rem;
  }

  &:before {
    content: '';
    display: ${(p) => (p.isCurrentlyInEffect ? 'block' : 'none')};
    position: absolute;
    width: calc(1.5rem + 1px);
    height: 2px;
    top: calc(50% - 1px);
    left: calc(-1.5rem - 1px);
    background: var(--blue);
  }

  &:after {
    content: '';
    display: ${(p) => (p.isCurrentlyInEffect ? 'block' : 'none')};
    position: absolute;
    width: 1.1rem;
    height: 1.1rem;
    border-radius: 50%;
    top: calc(50% - 0.75rem);
    left: calc(-2.5rem + 1px);
    background: white;
    border: 3px solid var(--green);
  }

  & + ${TimelineHeading} {
    margin-top: 2.5rem;
  }
`

export type PropTypes = {
  inspections: Inspection[]
  inspectionType: InspectionType
  loading?: boolean
  onUpdate: () => unknown
}

let currentDateString = getDateString(new Date())

const InspectionsList: React.FC<PropTypes> = ({
  inspections,
  inspectionType,
  onUpdate,
  loading = false,
}) => {
  let seasons = useSeasons()
  seasons = orderBy(seasons, ['startDate', 'endDate'], ['desc', 'desc'])

  const seasonGroups = groupBy(
    orderBy(inspections, ['inspectionStartDate'], ['desc', 'desc']),
    'seasonId'
  )

  let currentSeason = useMemo(
    () =>
      seasons.reduce((curSeason: Season | null, season: Season) => {
        if (!curSeason && isBetween(currentDateString, season.startDate, season.endDate)) {
          return season
        }

        return curSeason
      }, null),
    [seasons]
  )

  let typeStrings = getInspectionTypeStrings(inspectionType)

  return (
    <InspectionsListView>
      <LoadingDisplay loading={loading} />
      <InspectionsWrapper>
        {seasons.map((season) => {
          let { id: seasonId } = season
          let inspections: Inspection[] = get(seasonGroups, seasonId, [])

          let maxProductionVersion = isPreInspection(inspections[0])
            ? inspections.reduce((maxVersion, inspection) => {
                let version = (inspection as PreInspection).version

                return status === InspectionStatus.InProduction && version > maxVersion
                  ? version
                  : maxVersion
              }, 1)
            : 0

          let renderCurrentTemporalLocationInSeason =
            currentSeason?.id === seasonId && inspections.length === 0

          return (
            <React.Fragment key={seasonId}>
              <TimelineHeading>{seasonId}</TimelineHeading>
              {renderCurrentTemporalLocationInSeason && (
                <TimelineCurrentTime>
                  <Text>inspectionList_youAreHere</Text>
                </TimelineCurrentTime>
              )}
              {!inspections.some((pi) => pi.status === InspectionStatus.InProduction) && (
                <>
                  <TimelineMessage>
                    <Text
                      keyValueMap={{
                        inspection: typeStrings.prefixLC,
                      }}>
                      inspectionList_noInspectionInProduction
                    </Text>
                  </TimelineMessage>
                </>
              )}
              {inspections.map((inspection) => {
                let renderCurrentTemporalLocation =
                  currentSeason?.id === seasonId &&
                  isPreInspection(inspection) &&
                  isBetween(currentDateString, inspection.startDate, inspection.endDate)

                return (
                  <React.Fragment
                    key={inspection.id + (renderCurrentTemporalLocation ? 'iamhere' : '')}>
                    {renderCurrentTemporalLocation && (
                      <TimelineCurrentTime>
                        <Text>inspectionList_youAreHere</Text>
                      </TimelineCurrentTime>
                    )}
                    <TimelineInspectionItem
                      inspection={inspection}
                      onInspectionUpdated={onUpdate}
                      isCurrentlyInEffect={
                        (!isPreInspection(inspection) ||
                          inspection.version === maxProductionVersion) &&
                        inspection.status === InspectionStatus.InProduction
                      }
                    />
                  </React.Fragment>
                )
              })}
            </React.Fragment>
          )
        })}
      </InspectionsWrapper>
    </InspectionsListView>
  )
}

export default InspectionsList
