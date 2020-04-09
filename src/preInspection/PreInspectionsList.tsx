import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { groupBy, orderBy } from 'lodash'
import { FlexRow, Heading, MessageView } from '../common/components/common'
import PreInspectionItem from './PreInspectionItem'
import { InspectionStatus, PreInspection, Season } from '../schema-types'
import { useCreatePreInspection, useEditPreInspection } from './preInspectionUtils'
import { useStateValue } from '../state/useAppState'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { DATE_FORMAT } from '../constants'
import { format } from 'date-fns'
import { isBetween } from '../util/isBetween'
import Loading from '../common/components/Loading'

const PreInspectionsListView = styled.div`
  min-height: 100%;
  padding: 0 1rem;
  margin-bottom: 2rem;
`

const HeaderRow = styled(FlexRow)`
  margin: 1rem 0 2rem;
  align-items: center;
`

const PreInspectionsWrapper = styled.div`
  border-left: 2px solid var(--blue);
  margin-left: 0.75rem;
  margin-top: 1.5rem;
  padding-bottom: 2rem;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    height: 2.5px;
    width: calc(2rem + 1px);
    background: var(--blue);
    left: calc(-1rem - 2px);
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
    width: 2rem;
    height: 2rem;
    top: -0.5rem;
    left: calc(-1rem - 1px);
    border-radius: 50%;
    background: var(--blue);
  }
`

const TimelineMessage = styled(MessageView)`
  margin-left: 1.5rem;
  margin-top: 0;
`

const TimelineActions = styled.div`
  margin-left: 1.5rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
`

const TimelineCurrentTime = styled(TimelineHeading)`
  margin-top: 2rem;
  margin-bottom: 1rem;

  &:before {
    width: 1rem;
    height: 1rem;
    top: 0.1rem;
    left: calc(-0.5rem - 1px);
    border-radius: 50%;
    background: var(--green);
  }
`

const TimelinePreInspectionItem = styled(PreInspectionItem)<{ isCurrentlyInEffect?: boolean }>`
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
    width: calc(1.5rem + 1px);
    height: 1.5rem;
    border-radius: 50%;
    top: calc(50% - 0.75rem);
    left: calc(-2.25rem - 2px);
    background: var(--green);
  }

  & + ${TimelineHeading} {
    margin-top: 2.5rem;
  }
`

export type PropTypes = {
  preInspections: PreInspection[]
  loading?: boolean
  onUpdate: () => unknown
}

let currentDate = format(new Date(), DATE_FORMAT)

const PreInspectionsList: React.FC<PropTypes> = ({ preInspections, onUpdate, loading = false }) => {
  var [season] = useStateValue('globalSeason')
  var [operator] = useStateValue('globalOperator')

  const seasonGroups = groupBy(
    orderBy(preInspections, ['startDate', 'version'], ['desc', 'desc']),
    'season.id'
  )

  let editPreInspection = useEditPreInspection()

  let createPreInspection = useCreatePreInspection(operator, season)

  let onCreatePreInspection = useCallback(async () => {
    let createdPreInspection = await createPreInspection()

    if (createdPreInspection) {
      editPreInspection(createdPreInspection.id)
    } else {
      onUpdate()
    }
  }, [createPreInspection, editPreInspection, onUpdate])

  let currentSeason = useMemo(
    () =>
      preInspections.reduce((curSeason: Season | null, { season }) => {
        if (!curSeason && isBetween(currentDate, season.startDate, season.endDate)) {
          return season
        }

        return curSeason
      }, null),
    [preInspections]
  )

  return (
    <PreInspectionsListView>
      <HeaderRow>
        <Heading style={{ marginRight: '1rem', marginBottom: 0, marginTop: 0 }}>
          Liikennöitsijän ennakkotarkastukset
        </Heading>
        {loading && <Loading size={25} inline={true} />}
        <Button
          style={{ marginLeft: 'auto' }}
          buttonStyle={ButtonStyle.SECONDARY}
          size={ButtonSize.SMALL}
          onClick={() => onUpdate()}>
          Päivitä
        </Button>
      </HeaderRow>

      <PreInspectionsWrapper>
        {Object.entries(seasonGroups).map(([seasonId, preInspections]) => {
          let maxProductionVersion = preInspections.reduce(
            (maxVersion, { version, status }) =>
              status === InspectionStatus.InProduction && version > maxVersion
                ? version
                : maxVersion,
            1
          )

          return (
            <React.Fragment key={seasonId}>
              <TimelineHeading>{seasonId}</TimelineHeading>
              {!preInspections.some((pi) => pi.status === InspectionStatus.InProduction) && (
                <>
                  <TimelineMessage>
                    Tällä kaudella ei ole tuotannossa-olevaa ennakkotarkastusta.
                  </TimelineMessage>
                  <TimelineActions>
                    <Button onClick={onCreatePreInspection}>Luo uusi ennakkotarkastus</Button>
                  </TimelineActions>
                </>
              )}
              {preInspections.map((preInspection) => {
                let renderCurrentTemporalLocation =
                  currentSeason?.id === seasonId &&
                  isBetween(currentDate, preInspection.startDate, preInspection.endDate)

                return (
                  <React.Fragment
                    key={preInspection.id + (renderCurrentTemporalLocation ? 'iamhere' : '')}>
                    {renderCurrentTemporalLocation && (
                      <TimelineCurrentTime>Olet tässä</TimelineCurrentTime>
                    )}
                    <TimelinePreInspectionItem
                      preInspection={preInspection}
                      onPreInspectionUpdated={onUpdate}
                      isCurrentlyInEffect={
                        preInspection.version === maxProductionVersion &&
                        preInspection.status === InspectionStatus.InProduction
                      }
                    />
                  </React.Fragment>
                )
              })}
            </React.Fragment>
          )
        })}
      </PreInspectionsWrapper>
    </PreInspectionsListView>
  )
}

export default PreInspectionsList
