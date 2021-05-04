import React from 'react'
import styled, { css } from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { ArrowRight } from '../common/icon/ArrowRight'
import { SubHeading } from '../common/components/Typography'
import DateRangeDisplay from '../common/components/DateRangeDisplay'
import { Inspection } from './inspectionTypes'

const ContentRow = styled.div`
  display: flex;
  align-items: center;

  &:not(:last-child) {
    margin-bottom: 0.25rem;
  }
`

const InspectionTitle = styled.h4`
  margin: 0 1rem 0 0;
`

const InspectionSubtitle = styled(SubHeading)`
  margin: 0;
  font-size: 0.875rem;
`

const InspectionDates = styled(DateRangeDisplay)``

const InspectionListItem = styled.button<{ onClick?: unknown; disabled?: boolean }>`
  font-family: inherit;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid var(--lighter-grey);
  padding: 1rem 0.5rem 1rem 1rem;
  margin-bottom: 1rem;
  text-align: left;
  display: flex;
  width: 100%;
  align-items: flex-start;
  justify-content: flex-start;
  font-size: 1.1rem;
  color: var(--dark-grey);
  transform: scale(1);
  transition: all 0.1s ease-out;
  outline: 0;

  ${(p) =>
    typeof p.onClick !== 'undefined'
      ? css`
          cursor: pointer;

          &:hover {
            background-color: #fafafa;
            transform: ${!p.disabled ? 'scale(1.01)' : 'scale(1)'};
          }
        `
      : ''}
`

const InspectionContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const InspectionVersion = styled.div`
  padding: 0.2rem 0.6rem;
  width: 1.5rem;
  font-size: 1rem;
  border-radius: 5px;
  background: var(--lighter-grey);
  font-weight: bold;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  user-select: none;
  align-self: center;
`

const GoToReportsButton = styled.div`
  background: transparent;
  border: 0;
  flex: 0;
  padding: 0.5rem 0.75rem;
  display: flex;
  align-items: center;
  align-self: center;
  border-top-right-radius: 0.5rem;
  margin-left: auto;
  margin-top: -0.5rem;
  margin-bottom: -0.5rem;
`

export type PropTypes = {
  inspection: Inspection
  onClick?: () => unknown
}

const InspectionIndexItem = observer(({ inspection, onClick }: PropTypes) => {
  return (
    <InspectionListItem key={inspection.id} onClick={onClick} as={onClick ? 'button' : 'div'}>
      <InspectionVersion>{inspection.version}</InspectionVersion>
      <InspectionContentWrapper>
        <ContentRow>
          {inspection.name ? (
            <InspectionTitle>{inspection.name}</InspectionTitle>
          ) : (
            <InspectionTitle>
              {inspection.operator.operatorName} / {inspection.seasonId}
            </InspectionTitle>
          )}
          <InspectionDates startDate={inspection.startDate} endDate={inspection.endDate} />
        </ContentRow>
        {inspection.name && (
          <ContentRow>
            <InspectionSubtitle>
              {inspection.operator.operatorName} / {inspection.seasonId}
            </InspectionSubtitle>
          </ContentRow>
        )}
      </InspectionContentWrapper>
      {onClick && (
        <GoToReportsButton>
          <ArrowRight fill="var(--blue)" width="1.5rem" height="1.5rem" />
        </GoToReportsButton>
      )}
    </InspectionListItem>
  )
})

export default InspectionIndexItem
