import React, { FC } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useQueryData } from '../util/useQueryData'
import { executionSchemaStatsQuery } from './executionRequirementsQueries'
import {
  DayTypeEquipmentStat,
  EquipmentTypeStat,
  ExecutionRequirement,
  ExecutionSchemaStats,
} from '../schema-types'
import Table, { PropTypes as TablePropTypes } from '../common/components/Table'
import { text, Text } from '../util/translate'
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

const statsTableLabels = {
  dayType: text('requirement.stats.dayType'),
  equipmentType: text('requirement.stats.equipmentType'),
  equipmentCount: text('requirement.stats.equipmentCount'),
  kilometers: text('requirement.stats.kilometers'),
}

export type PropTypes = {
  executionRequirement: ExecutionRequirement
}

const PlannedExecutionStats = observer(({ executionRequirement }: PropTypes) => {
  let { data: executionStatsData, loading: statsLoading } = useQueryData<ExecutionSchemaStats>(
    executionSchemaStatsQuery,
    {
      skip: !executionRequirement,
      variables: {
        requirementId: executionRequirement.id,
      },
    }
  )

  let dayTypeStats = executionStatsData?.dayTypeEquipment || []
  let equipmentTypeStats = executionStatsData?.equipmentTypes || []

  let requirementEquipmentCount = executionRequirement.equipmentQuotas.length

  return (
    <PlannedExecutionStatsView>
      <TableWrapper>
        <SmallHeading>
          <Text>requirement.heading.day_type_stats</Text>
        </SmallHeading>
        <StatsTable<FC<TablePropTypes<DayTypeEquipmentStat>>>
          items={dayTypeStats}
          columnLabels={statsTableLabels}
          fluid={true}
          highlightRow={(row) =>
            row.equipmentCount > requirementEquipmentCount ? 'var(--lighter-red)' : false
          }
        />
      </TableWrapper>
      <TableWrapper>
        <SmallHeading>
          <Text>requirement.heading.equipment_type_stats</Text>
        </SmallHeading>
        <StatsTable<FC<TablePropTypes<EquipmentTypeStat>>>
          columnLabels={statsTableLabels}
          items={equipmentTypeStats}
          fluid={true}
        />
      </TableWrapper>
    </PlannedExecutionStatsView>
  )
})

export default PlannedExecutionStats
