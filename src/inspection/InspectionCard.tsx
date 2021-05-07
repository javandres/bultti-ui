import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { getInspectionStatusColor, getInspectionStatusName } from './inspectionUtils'
import { getReadableDate } from '../util/formatDate'
import InspectionActions from './InspectionActions'
import { Inspection, InspectionStatus } from '../schema-types'
import { SubHeading } from '../common/components/Typography'
import { Text } from '../util/translate'

type StatusProps = { status?: InspectionStatus }

const InspectionItem = styled.div<StatusProps>`
  padding: 0.75rem 1rem 0;
  border-radius: 5px;
  margin-bottom: 1rem;
  background: white;
  border: 2px solid ${(p) => getInspectionStatusColor(p.status)};
  font-family: inherit;
  margin-left: 1rem;
  text-align: left;
  line-height: 1.4;
  display: flex;
  flex-direction: column;
  flex: 0 0 25rem;
`

const InspectionTitle = styled(SubHeading)`
  margin-bottom: 0.75rem;
`

const InspectionSubtitle = styled(SubHeading)`
  margin-top: -0.75rem;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
`

const InspectionVersion = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.2rem 0.6rem;
  border-radius: 5px;
  background: var(--lighter-grey);
  font-weight: bold;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`

const InspectionStatusDisplay = styled.div<StatusProps>`
  padding: 0.25rem 0;
  text-align: center;
  background: ${(p) => getInspectionStatusColor(p.status)};
  color: ${(p) => (p.status === InspectionStatus.InReview ? 'var(--dark-grey)' : 'white')};
  margin: 0 0 1rem;
  border-radius: 5px;
`

const InspectionPeriodDisplay = styled.div`
  margin-bottom: 0.75rem;

  &:last-child {
    margin-bottom: 0.5rem;
  }
`

const StartDate = styled.span`
  margin-right: 0.75rem;

  &:after {
    content: '➔';
    display: inline-block;
    margin-left: 0.75rem;
  }
`

const EndDate = styled(StartDate)`
  &:after {
    content: '';
  }
`

const DateTitle = styled.h6`
  font-size: 0.75rem;
  margin-top: 0;
  margin-bottom: 0.25rem;
`

const ItemContent = styled.div`
  line-height: 1.4;
  position: relative;
`

export type PropTypes = {
  inspection: Inspection
  showActions?: boolean
  onRefresh: () => unknown
}

const InspectionCard: React.FC<PropTypes> = observer(
  ({ inspection, onRefresh, showActions = true }) => {
    return (
      <InspectionItem key={inspection.id} status={inspection.status}>
        <ItemContent>
          {inspection.name ? (
            <>
              <InspectionTitle>{inspection.name}</InspectionTitle>
              <InspectionSubtitle>
                {inspection.operator.operatorName}, {inspection.seasonId}
              </InspectionSubtitle>
            </>
          ) : (
            <InspectionTitle>
              {inspection.operator.operatorName}, {inspection.seasonId}
            </InspectionTitle>
          )}
          <InspectionVersion>{inspection.version}</InspectionVersion>
          <InspectionStatusDisplay status={inspection.status}>
            {getInspectionStatusName(inspection.status)}
          </InspectionStatusDisplay>
          <InspectionPeriodDisplay>
            <DateTitle>
              <Text>inspection_inspectionValidPeriod</Text>
            </DateTitle>
            <StartDate>{getReadableDate(inspection.startDate)}</StartDate>
            <EndDate>{getReadableDate(inspection.endDate)}</EndDate>
          </InspectionPeriodDisplay>
          <InspectionPeriodDisplay>
            <DateTitle>
              <Text>inspection_inspectionPeriod</Text>
            </DateTitle>
            <StartDate>{getReadableDate(inspection.inspectionStartDate)}</StartDate>
            <EndDate>{getReadableDate(inspection.inspectionEndDate)}</EndDate>
          </InspectionPeriodDisplay>
        </ItemContent>
        {showActions && <InspectionActions onRefresh={onRefresh} inspection={inspection} />}
      </InspectionItem>
    )
  }
)

export default InspectionCard
