import React, { useCallback } from 'react'
import styled from 'styled-components'
import { groupBy, orderBy } from 'lodash'
import { Heading, MessageView } from '../common/components/common'
import PreInspectionItem from './PreInspectionItem'
import { InspectionStatus, PreInspection } from '../schema-types'
import { useCreatePreInspection, useEditPreInspection } from './preInspectionUtils'
import { useStateValue } from '../state/useAppState'
import { Button } from '../common/components/Button'

const PreInspectionsListView = styled.div`
  min-height: 100%;
  padding: 0 1rem;
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

const TimelineItem = styled.div`
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

const TimelinePreInspectionItem = styled(PreInspectionItem)`
  margin-right: 0;
  margin-left: 1.5rem;
  position: relative;

  &:before {
    content: '';
    display: block;
    position: absolute;
    width: calc(1.5rem + 1px);
    height: 1px;
    top: calc(50% - 1px);
    left: calc(-1.5rem - 1px);
    background: var(--blue);
  }

  & + ${TimelineItem} {
    margin-top: 2.5rem;
  }
`

export type PropTypes = {
  preInspections: PreInspection[]
  onUpdate: () => unknown
}
const PreInspectionsList: React.FC<PropTypes> = ({ preInspections, onUpdate }) => {
  var [season] = useStateValue('globalSeason')
  var [operator] = useStateValue('globalOperator')

  const seasonGroups = groupBy(
    orderBy(preInspections, ['startDate', 'version'], ['desc', 'desc']),
    'season.id'
  )

  let editPreInspection = useEditPreInspection()

  // Initialize the form by creating a pre-inspection on the server and getting the ID.
  let createPreInspection = useCreatePreInspection(operator, season)

  let onCreatePreInspection = useCallback(async () => {
    let createdPreInspection = await createPreInspection()

    if (createdPreInspection) {
      editPreInspection(createdPreInspection.id)
    } else {
      onUpdate()
    }
  }, [createPreInspection, editPreInspection, onUpdate])

  return (
    <PreInspectionsListView>
      <Heading>Liikennöitsijän ennakkotarkastukset</Heading>
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
              <TimelineItem>{seasonId}</TimelineItem>
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
              {preInspections.map((preInspection) => (
                <TimelinePreInspectionItem
                  key={preInspection.id}
                  preInspection={preInspection}
                  isCurrentlyInEffect={
                    preInspection.version === maxProductionVersion &&
                    preInspection.status === InspectionStatus.InProduction
                  }
                />
              ))}
            </React.Fragment>
          )
        })}
      </PreInspectionsWrapper>
    </PreInspectionsListView>
  )
}

export default PreInspectionsList
