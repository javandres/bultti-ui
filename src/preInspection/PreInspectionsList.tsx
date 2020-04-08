import React from 'react'
import styled from 'styled-components'
import { groupBy, orderBy } from 'lodash'
import { Heading } from '../common/components/common'
import PreInspectionItem from './PreInspectionItem'
import { PreInspection } from '../schema-types'

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
    content: "";
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
  const seasonGroups = groupBy(
    orderBy(preInspections, ['startDate', 'version'], ['desc', 'desc']),
    'season.id'
  )

  return (
    <PreInspectionsListView>
      <Heading>Liikennöitsijän ennakkotarkastukset</Heading>
      <PreInspectionsWrapper>
        {Object.entries(seasonGroups).map(([seasonId, preInspections]) => {
          return (
            <React.Fragment key={seasonId}>
              <TimelineItem>{seasonId}</TimelineItem>
              {preInspections.map((preInspection) => (
                <TimelinePreInspectionItem key={preInspection.id} preInspection={preInspection} />
              ))}
            </React.Fragment>
          )
        })}
      </PreInspectionsWrapper>
    </PreInspectionsListView>
  )
}

export default PreInspectionsList
