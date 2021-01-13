import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useQueryData } from '../util/useQueryData'
import { executionSchemaStatsQuery } from './executionRequirementsQueries'
import { ExecutionSchemaStats } from '../schema-types'
import Table from '../common/components/Table'
import { Text } from '../util/translate'
import { SmallHeading } from '../common/components/Typography'

const PlannedExecutionStatsView = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;
`

const TableWrapper = styled.div`
  flex: 1 0 auto;
  margin-right: 0.75rem;

  &:last-child {
    margin-right: 0;
    margin-left: 0.75rem;
  }
`

const StatsTable = styled(Table)`
  width: 100%;
  max-width: 100%;
  margin: 0;
  border-left: 1px solid var(--lightest-grey);
  border-right: 1px solid var(--lightest-grey);
`

export type PropTypes = {
  executionRequirementId: string
}

const PlannedExecutionStats = observer(({ executionRequirementId }: PropTypes) => {
  let { data: executionStatsData, loading: statsLoading } = useQueryData<ExecutionSchemaStats>(
    executionSchemaStatsQuery,
    {
      skip: !executionRequirementId,
      variables: {
        requirementId: executionRequirementId,
      },
    }
  )

  let dayTypeStats = executionStatsData?.dayTypeEquipment || []
  let equipmentTypeStats = executionStatsData?.equipmentTypes || []

  return (
    <PlannedExecutionStatsView>
      <TableWrapper>
        <SmallHeading>
          <Text>requirement.heading.day_type_stats</Text>
        </SmallHeading>
        <StatsTable items={dayTypeStats} fluid={true} />
      </TableWrapper>
      <TableWrapper>
        <SmallHeading>
          <Text>requirement.heading.equipment_type_stats</Text>
        </SmallHeading>
        <StatsTable items={equipmentTypeStats} fluid={true} />
      </TableWrapper>
    </PlannedExecutionStatsView>
  )
})

export default PlannedExecutionStats
