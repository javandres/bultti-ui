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
import { orderBy } from 'lodash'
import { normalDayTypes } from '../constants'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { FlexRow } from '../common/components/common'

const PlannedExecutionStatsView = styled.div`
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
  let { data: executionStatsData, refetch } = useQueryData<ExecutionSchemaStats>(
    executionSchemaStatsQuery,
    {
      skip: !executionRequirement,
      variables: {
        requirementId: executionRequirement.id,
      },
    }
  )

  let dayTypeStats = orderBy(
    executionStatsData?.dayTypeEquipment || [],
    (row) => normalDayTypes.indexOf(row.dayType) || 0
  )

  let equipmentTypeStats = executionStatsData?.equipmentTypes || []
  let requirementEquipmentCount = executionRequirement.equipmentQuotas.length

  return (
    <PlannedExecutionStatsView>
      <FlexRow style={{ marginTop: '1.5rem' }}>
        <Button
          buttonStyle={ButtonStyle.SECONDARY}
          size={ButtonSize.SMALL}
          onClick={() => refetch()}>
          <Text>general.app.update</Text>
        </Button>
      </FlexRow>
      <FlexRow>
        <TableWrapper>
          <SmallHeading style={{ marginTop: '0.5rem' }}>
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
          <SmallHeading style={{ marginTop: '0.5rem' }}>
            <Text>requirement.heading.equipment_type_stats</Text>
          </SmallHeading>
          <StatsTable<FC<TablePropTypes<EquipmentTypeStat>>>
            columnLabels={statsTableLabels}
            items={equipmentTypeStats}
            fluid={true}
          />
        </TableWrapper>
      </FlexRow>
    </PlannedExecutionStatsView>
  )
})

export default PlannedExecutionStats
